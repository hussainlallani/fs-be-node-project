import path, { basename } from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/gamehub",
  turbopack: {
    root: path.resolve(__dirname),
  },
  env: {
    basePath: "/gamehub",
  },
};

export default nextConfig;
