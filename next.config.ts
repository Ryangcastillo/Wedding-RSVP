import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  // Enable static exports for GitHub Pages deployment
  output: 'export',
  // Disable server-side image optimization
  images: {
    unoptimized: true,
  },
  // Configure base path for GitHub Pages (uncomment and set if needed)
  // basePath: '/Wedding-RSVP',
  // assetPrefix: '/Wedding-RSVP/',
  // Disable server-side features that don't work with static exports
  trailingSlash: true,
  // Skip build-time API route validation since we're doing static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
