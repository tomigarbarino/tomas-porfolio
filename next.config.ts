import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/es", destination: "/", permanent: true },
      { source: "/trainly", destination: "/en/trainly", permanent: true },
      { source: "/es/trainly", destination: "/en/trainly", permanent: true },
      { source: "/trainyl", destination: "/en/trainly", permanent: true },
    ];
  },
};

export default nextConfig;
