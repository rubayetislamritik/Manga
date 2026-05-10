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
  // No custom headers needed — default Next.js security headers apply.
};

export default nextConfig;
