import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploads.mangadex.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.mangadex.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cmdxd98sb0x3yprd.mangadex.network",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Removed X-Frame-Options restriction so the app can be embedded
          // in iframes (e.g. Arena preview). Use CSP frame-ancestors instead
          // if you need to restrict embedding to specific origins later.
        ],
      },
    ];
  },
};

export default nextConfig;
