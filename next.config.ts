import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Type checking done locally and in CI — skip on Vercel to avoid timeout
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
