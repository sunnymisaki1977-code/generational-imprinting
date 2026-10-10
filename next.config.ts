import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  optimizeFonts: false,
  staticPageGenerationTimeout: 300,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
