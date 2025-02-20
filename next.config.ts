import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
module.exports = {
  typescript: {
    ignoreBuildErrors: true, // Игнорирует ошибки TypeScript
  },
  eslint: {
    ignoreDuringBuilds: true, // Игнорирует ошибки ESLint при билде
  },
};

export default nextConfig;
