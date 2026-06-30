import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "95.81.115.48",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.skriptkin.ru",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
