import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@tailwindcss/postcss"],
  },
};

export default nextConfig;
