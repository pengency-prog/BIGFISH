import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.bigfork.co.uk',
      },
    ],
  },
};

export default nextConfig;
