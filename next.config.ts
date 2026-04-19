import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   output: 'standalone',
   font: {
    disable: true, // Skip next/font optimization during build
  }
};

export default nextConfig;
