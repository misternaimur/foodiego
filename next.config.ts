import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // firebase-admin is a server-only Node package — keep it external instead
  // of bundling. Its transitive deps jose/jwks-rsa must stay bundled: jose
  // ships ESM-only and jwks-rsa require()s it, which only works if the
  // bundler handles the interop (externalizing them breaks with
  // ERR_REQUIRE_ESM at runtime).
  serverExternalPackages: ['firebase-admin'],

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
    ],
  },
};

export default nextConfig;
