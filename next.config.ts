import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  // Allow the dev server to be opened from a phone on the LAN (QR workflow), or
  // through a Cloudflare quick tunnel (npm run tunnel) whose *.trycloudflare.com
  // host is random each run — the wildcard covers every run without edits.
  allowedDevOrigins: ["192.168.31.41", "*.trycloudflare.com"],
  // Hide the Next.js dev indicator (bottom-left "N" overlay).
  devIndicators: false,
  // `cacheComponents` (on by default in the scaffold) refuses to prerender any
  // route that reads request-time state. This app is signed-in and
  // client-rendered — `useSearchParams`, `useParams` and the auth context are
  // on nearly every page — so it only produced build failures. Off, those
  // routes simply render on demand, which is what they need anyway.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Profile pictures and galleries are served from Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  async redirects() {
    return [
      {
        source: "/wallet",
        destination: "/account/wallet",
        permanent: true,
      },
      {
        source: "/horoscope",
        destination: "/daily-horoscope",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
