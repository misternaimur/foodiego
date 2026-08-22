import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Turbopack-কে নির্দেশ দেওয়া হচ্ছে যেন firebase-admin এবং সম্পর্কিত প্যাকেজগুলো ইন্টারনালি না মুড়ে Node.js রানটাইম থেকে সরাসরি লোড করে
  serverExternalPackages: [
    'firebase-admin',
    'jose',
    'jwks-rsa',
    'google-gax',
    'gaxios',
  ],
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