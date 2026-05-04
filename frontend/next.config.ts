import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // env variables from process.env are automatically exposed to the client
};

export default nextConfig;
