import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://querydog.benjaminwootton.com:8090/api/:path*',
      },
      {
        source: '/api-thirdparty/:path*',
        destination: 'http://querydog.benjaminwootton.com:8091/api/:path*',
      },
    ]
  },
};

export default nextConfig;
