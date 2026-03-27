/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for multi-stage Docker build (Phase 5)
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures
      },
    ],
  },

  // Suppress known React hydration warnings from browser extensions
  reactStrictMode: true,
};

export default nextConfig;
