// Префикс адреса сайта: пустой локально и "/skullflame" на GitHub Pages (см. next.config.ts).
// Обычные <a href="/..."> его не добавляют, поэтому внутренние ссылки строятся через withBase
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string) {
  return `${BASE_PATH}${path}`;
}
