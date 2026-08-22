import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js 16 Node.js Server External Packages
  serverExternalPackages: ['firebase-admin', 'jose', 'jwks-rsa'],

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