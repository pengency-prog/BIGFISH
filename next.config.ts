import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/thedubem/:path*',
        destination: 'https://the-dubem.vercel.app/:path*',
      },
    ];
  },
};

export default nextConfig;
