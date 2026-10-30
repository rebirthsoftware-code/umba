import type { ImageLoaderProps } from "next/image";

/**
 * next/image özel yükleyici.
 * - Uzak (CDN) görseller: wsrv.nl üzerinden istenen genişlikte WebP olarak
 *   sunulur; Vercel'in görsel optimizasyon kotası kullanılmaz.
 * - Yerel görseller (/public): olduğu gibi döner (optimizasyon yok).
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!/^https?:\/\//.test(src)) return src;
  const u = new URL("https://wsrv.nl/");
  u.searchParams.set("url", src);
  u.searchParams.set("w", String(width));
  u.searchParams.set("q", String(quality ?? 75));
  u.searchParams.set("output", "webp");
  u.searchParams.set("we", "1"); // büyütme yok
  u.searchParams.set("maxage", "1y");
  return u.toString();
}
