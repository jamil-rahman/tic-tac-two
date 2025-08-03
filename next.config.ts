import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',
  
  // Custom server handles Socket.IO
};

export default nextConfig;
