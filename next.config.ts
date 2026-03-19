import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://devcard-pro.pages.dev' : '',
};

export default nextConfig;
