// Dev server reachable from your phone, with a scannable QR in the terminal.
//
//   npm run dev:mobile        start Next dev on the LAN + print the QR
//   npm run qr                print the QR only (server already running)
//
// The QR encodes http://<your-LAN-IP>:<port>. Scan it from a phone on the SAME
// Wi-Fi; it hits this very dev server (hot reload and all). "localhost" on the
// phone would point at the phone itself, so the LAN IP is what makes it work.

import os from "node:os";
import { spawn } from "node:child_process";
import qrcode from "qrcode-terminal";

const PORT = process.env.PORT || "3000";
const QR_ONLY = process.argv.includes("--qr-only");

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

console.log(`\n  📱  Scan to open on your phone (same Wi-Fi):\n      ${url}\n`);
qrcode.generate(url, { small: true });
console.log("");

if (QR_ONLY) process.exit(0);

// Bind to 0.0.0.0 so the LAN IP is actually served, not just localhost.
const child = spawn("next", ["dev", "-H", "0.0.0.0", "-p", PORT], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
child.on("exit", (code) => process.exit(code ?? 0));
