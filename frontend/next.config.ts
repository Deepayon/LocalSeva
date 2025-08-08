import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration for minimal setup
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;