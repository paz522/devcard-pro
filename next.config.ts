import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages uses next-on-pages to handle API routes as Edge Functions
  // output: 'export' is NOT needed for Cloudflare Pages deployment
};

export default nextConfig;
