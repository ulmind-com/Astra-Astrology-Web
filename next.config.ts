import path from "node:path";
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
    root: path.resolve(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Profile pictures, course thumbnails, and galleries served from Cloudinary.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://astra-astrology-backend.onrender.com/api/v1/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/verify/certificate/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
        ],
      },
    ];
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
      {
        source: "/tools/annual-horoscope",
        destination: "/annual-horoscope",
        permanent: true,
      },
      {
        source: "/tools/muhurat",
        destination: "/muhurat",
        permanent: true,
      },
      {
        source: "/tools/panchang",
        destination: "/panchang",
        permanent: true,
      },
      {
        source: "/tools/festivals",
        destination: "/festivals",
        permanent: true,
      },
      {
        source: "/tools/kundli",
        destination: "/kundli",
        permanent: true,
      },
      {
        source: "/tools/matching",
        destination: "/kundli-matching",
        permanent: true,
      },
      {
        source: "/tools/dasha",
        destination: "/dasha-calculator",
        permanent: true,
      },
      {
        source: "/tools/rashi",
        destination: "/rashi-calculator",
        permanent: true,
      },
      {
        source: "/tools/nakshatra",
        destination: "/nakshatra-calculator",
        permanent: true,
      },
      {
        source: "/tools/kp",
        destination: "/kp-calculator",
        permanent: true,
      },
      {
        source: "/tools/numerology",
        destination: "/numerology",
        permanent: true,
      },
      {
        source: "/tools/vastu",
        destination: "/vastu",
        permanent: true,
      },
      {
        source: "/tools/ai-astrologer",
        destination: "/ai-astrologer",
        permanent: true,
      },
      {
        source: "/reading/palm",
        destination: "/palm-reading",
        permanent: true,
      },
      {
        source: "/reading/face",
        destination: "/face-reading",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
