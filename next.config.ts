import type { NextConfig } from "next";

// Сборка для GitHub Pages (GITHUB_PAGES=true): статичные файлы в out/, сайт живёт в подпапке /skullflame
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? "/skullflame" : "";

const nextConfig: NextConfig = {
  /* config options here */
  ...(pages && { output: "export", basePath, trailingSlash: true }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Открывать dev-сервер с телефона и других устройств в локальной сети
  allowedDevOrigins: ["192.168.1.111", "192.168.*.*"],
  // Статичный экспорт не поддерживает частичный пререндер, поэтому для Pages эти режимы выключены
  cacheComponents: !pages,
  partialPrefetching: !pages,
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
