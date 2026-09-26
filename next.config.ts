import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/biolab-lims",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
