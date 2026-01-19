import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "70mb", // increase this as needed
    },
  },
};

export default nextConfig;
