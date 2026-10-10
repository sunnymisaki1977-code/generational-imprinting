import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: { workerThreads: false, cpus: 1 },
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
