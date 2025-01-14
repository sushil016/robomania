import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;


module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.caesars.com',
        port: '',
        pathname: '/account123/**',
        search: '',
      },
    ],
  },
}