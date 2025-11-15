import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@tailwindcss/postcss"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
};

export default nextConfig;
