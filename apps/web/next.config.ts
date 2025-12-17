import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@ascendos/database",
    "@ascendos/ai",
    "@ascendos/templates",
    "@ascendos/validators",
  ],
};

export default nextConfig;
