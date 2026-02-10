import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://37.27.255.95:8090/api/:path*',
      },
    ]
  },
};

export default nextConfig;
