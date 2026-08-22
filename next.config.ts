import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // firebase-admin (and its transitive deps jose, jwks-rsa) are server-only
  // Node packages — keep them external instead of bundling.
  serverExternalPackages: ['firebase-admin', 'jwks-rsa', 'jose'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
