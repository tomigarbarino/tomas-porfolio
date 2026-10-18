import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  experimental: { globalNotFound: true },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/trainly", destination: "/en/trainly", permanent: true },
      { source: "/trainyl", destination: "/en/trainly", permanent: true },
      { source: "/agora", destination: "/en/agora", permanent: true },
    ];
  },
};

export default nextConfig;
