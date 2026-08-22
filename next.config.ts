import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // firebase-admin কে Server External Package হিসেবে যুক্ত করা হলো
  serverExternalPackages: ['firebase-admin'],
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