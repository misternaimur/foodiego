import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ১. Node.js runtime-কে নির্দেশ দেওয়া যাতে প্যাকেজগুলো আলাদাভাবে হ্যান্ডেল করে
  serverExternalPackages: ['firebase-admin', 'jwks-rsa', 'jose'],

  // ২. Next.js 16 / Turbopack-কে jose ও jwks-rsa প্যাকেজ দুটো ট্রান্সপাইল করার নির্দেশ
  transpilePackages: ['jose', 'jwks-rsa'],

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