import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  // Allow the dev server to be opened from a phone on the LAN (QR workflow).
  allowedDevOrigins: ["192.168.31.41"],
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
    // Profile pictures, course thumbnails, and galleries served from Cloudinary.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
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
