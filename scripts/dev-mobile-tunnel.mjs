// Dev stack reachable from ANY phone (even on Wi-Fi with AP/client isolation),
// via two Cloudflare quick tunnels + a scannable QR in the terminal.
//
//   npm run tunnel      start FastAPI backend + Next frontend locally, open a
//                       public https tunnel to each, point the browser bundle
//                       at the backend tunnel, then print the QR of the
//                       frontend tunnel URL.
//
// Why two tunnels: the browser calls the API directly (NEXT_PUBLIC_API_URL), so
// the phone needs a public URL for BOTH the frontend and the backend. The LAN
// IP route (npm run dev:mobile) fails when the router isolates clients; a tunnel
// goes out to the internet and back, so isolation never matters.
//
// Quick-tunnel URLs are random (*.trycloudflare.com) and change every run. The
// QR carries whatever this run got, so you never type them.

import os from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import qrcode from "qrcode-terminal";

const PORT = process.env.PORT || "3000";
const BACKEND_PORT = process.env.BACKEND_PORT || "8000";

const webRoot = path.resolve(fileURLToPath(import.meta.url), "../..");
const backendDir = path.resolve(webRoot, "../Astra-Astrology-Backend");

const children = [];
let shuttingDown = false;

function killAll(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const c of children) {
    try {
      c.kill("SIGINT");
    } catch {}
  }
  process.exit(code);
}

/** Spawn a long-lived child; if it dies, the whole stack comes down. */
function run(command, args, opts = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  child.on("exit", (c) => killAll(c ?? 0));
  children.push(child);
  return child;
}

/**
 * Start a cloudflared quick tunnel to `http://localhost:<port>` and resolve
 * with its public https URL. cloudflared prints the URL to stderr.
 */
function startTunnel(port, label) {
  return new Promise((resolve, reject) => {
    const child = spawn("cloudflared", [
      "tunnel",
      "--no-autoupdate",
      "--url",
      `http://localhost:${port}`,
    ]);
    children.push(child);
    child.on("exit", (c) => killAll(c ?? 0));

    let settled = false;
    const re = /https:\/\/[-a-z0-9]+\.trycloudflare\.com/;
    const onData = (buf) => {
      const m = String(buf).match(re);
      if (m && !settled) {
        settled = true;
        clearTimeout(timer);
        console.log(`  🌐  ${label} tunnel → ${m[0]}`);
        resolve(m[0]);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`${label} tunnel: no URL after 40s`));
      }
    }, 40000);
  });
}

process.on("SIGINT", () => killAll(0));
process.on("SIGTERM", () => killAll(0));

(async () => {
  console.log("\n  Starting local servers + Cloudflare tunnels…\n");

  // 1. Backend (local, bound to localhost — the tunnel reaches it there).
  run(
    "uv",
    [
      "run",
      "uvicorn",
      "app.main:app",
      "--reload",
      "--host",
      "127.0.0.1",
      "--port",
      BACKEND_PORT,
    ],
    { cwd: backendDir },
  );

  // 2. Public URL for the backend, so the phone's client-side API calls resolve.
  const backendUrl = await startTunnel(BACKEND_PORT, "backend ");

  // 3. Frontend, with the browser bundle pointed at the backend tunnel.
  run("next", ["dev", "-p", PORT], {
    env: { ...process.env, NEXT_PUBLIC_API_URL: backendUrl },
  });

  // 4. Public URL for the frontend — this is what the phone opens.
  const frontendUrl = await startTunnel(PORT, "frontend");

  console.log(`\n  📱  Scan to open on your phone (any network):\n      ${frontendUrl}`);
  console.log(`      API → ${backendUrl}\n`);
  qrcode.generate(frontendUrl, { small: true });
  console.log("\n  Ctrl-C stops everything.\n");
})().catch((err) => {
  console.error("\n  ✗", err.message, "\n");
  killAll(1);
});
