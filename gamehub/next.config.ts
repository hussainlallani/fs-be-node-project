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
  // async headers() {
  //   return [
  //     {
  //       source: "/:path*", // apply to all routes
  //       headers: [
  //         {
  //           key: "Content-Security-Policy",
  //           value:
  //             "default-src 'none'; connect-src 'self' https://127.0.0.1:3001;",
  //         },
  //       ],
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.igdb.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "media.rawg.io",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.freetogame.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "flowbite.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "flowbite.s3.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
