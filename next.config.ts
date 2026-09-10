import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['firebase-admin'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/ad0uzhe4/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.britannica.com',
      },
    ],
  },
};

export default nextConfig;
