// Dev servers reachable from your phone, with a scannable QR in the terminal.
//
//   npm run dev:mobile        start the Next frontend + the FastAPI backend on
//                             the LAN, then print the QR
//   npm run qr                print the QR only (servers already running)
//
// The QR encodes http://<your-LAN-IP>:<port>. Scan it from a phone on the SAME
// Wi-Fi; it hits this very dev server (hot reload and all). "localhost" on the
// phone would point at the phone itself, so the LAN IP is what makes it work.
//
// Both servers bind 0.0.0.0, so the phone can reach the frontend AND call the
// backend API directly at http://<your-LAN-IP>:8000.

import os from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { spawn } from "node:child_process";
import qrcode from "qrcode-terminal";

const PORT = process.env.PORT || "3000";
const BACKEND_PORT = process.env.BACKEND_PORT || "8000";
const QR_ONLY = process.argv.includes("--qr-only");

// Backend lives in the sibling directory next to this web project.
const webRoot = path.resolve(fileURLToPath(import.meta.url), "../..");
const backendDir = path.resolve(webRoot, "../Astra-Astrology-Backend");

/** First non-internal IPv4 address (the LAN IP a phone can reach). */
function lanIp() {
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const net of iface || []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "127.0.0.1";
}

const ip = lanIp();
const url = `http://${ip}:${PORT}`;

console.log(`\n  📱  Scan to open on your phone (same Wi-Fi):\n      ${url}`);
console.log(`      API → http://${ip}:${BACKEND_PORT}\n`);
qrcode.generate(url, { small: true });
console.log("");

if (QR_ONLY) process.exit(0);

const children = [];

/** Spawn a child, inheriting stdio; kill the whole group if it dies. */
function run(command, args, opts = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opts,
  });
  child.on("exit", (code) => {
    // One server going down takes the other with it, so you never get a
    // half-running stack.
    for (const other of children) {
      if (other !== child) other.kill();
    }
    process.exit(code ?? 0);
  });
  children.push(child);
  return child;
}

// Bind to 0.0.0.0 so the LAN IP is actually served, not just localhost.
// Point the browser bundle at the LAN backend so the phone's client-side calls
// reach the API instead of its own localhost. This is derived from the live LAN
// IP, so it stays correct across Wi-Fi networks; it overrides any value in .env.
run("next", ["dev", "-H", "0.0.0.0", "-p", PORT], {
  env: { ...process.env, NEXT_PUBLIC_API_URL: `http://${ip}:${BACKEND_PORT}` },
});
run(
  "uv",
  [
    "run",
    "uvicorn",
    "app.main:app",
    "--reload",
    "--host",
    "0.0.0.0",
    "--port",
    BACKEND_PORT,
  ],
  { cwd: backendDir },
);

// Ctrl-C should bring down both servers cleanly.
process.on("SIGINT", () => {
  for (const child of children) child.kill("SIGINT");
});
