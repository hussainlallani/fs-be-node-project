import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/gamehub",
  turbopack: {
    root: path.resolve(__dirname),
  },
  env: {
    basePath: "/gamehub",
  },
  images: {
    domains: [
      "images.igdb.com",
      "media.istockphoto.com", // ✅ add this
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flowbite.s3.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
