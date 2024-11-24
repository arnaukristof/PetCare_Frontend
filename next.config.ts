import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Ha strict mode-ot használsz
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5290',
        pathname: '/api/Image/images/**',
      },
    ],
  },
};

//ssl cert solution?
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export default nextConfig;
