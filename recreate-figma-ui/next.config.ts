import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    // Disable the Image Optimization API for static exports
    unoptimized: true,
  },
};

export default nextConfig;
