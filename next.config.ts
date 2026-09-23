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
      // UPDATE (responsive/image fix): some real seeded restaurants store
      // their logo/cover image on ibb.co — without this, next/image throws
      // an unrecoverable runtime error for that one restaurant, which took
      // down the ENTIRE /restaurants page (and anywhere else it rendered)
      // instead of just that one broken image.
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
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
