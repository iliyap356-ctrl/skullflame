import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Открывать dev-сервер с телефона и других устройств в локальной сети
  allowedDevOrigins: ["192.168.1.111", "192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
