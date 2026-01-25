import type { NextConfig } from "next";
import { baseURL } from "./lib/utils";

const nextConfig: NextConfig = {
  assetPrefix: baseURL,
  typedRoutes: true,
};

export default nextConfig;
