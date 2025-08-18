import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export for Vercel server-side functionality
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
