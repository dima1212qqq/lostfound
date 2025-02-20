import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone", // Включает standalone-режим для деплоя
  typescript: {
    ignoreBuildErrors: true, // Игнорируем ошибки TS
  },
  eslint: {
    ignoreDuringBuilds: true, // Игнорируем ошибки ESLint
  },
};

module.exports = nextConfig; // Убираем `export default`


export default nextConfig;
