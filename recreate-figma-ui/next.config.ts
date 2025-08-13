import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to enable server-side features for Supabase
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
