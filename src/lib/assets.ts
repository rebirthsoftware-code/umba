/**
 * Statik görsel yolu çözümleyici.
 *
 * Vercel'in görsel optimizasyonu ve bant genişliği kotalarını aşmamak için
 * ürün/koleksiyon fotoğrafları GitHub deposundan (jsDelivr CDN üzerinden)
 * sunulur: NEXT_PUBLIC_ASSET_BASE tanımlıysa /products, /hero, /categories,
 * /story ve /brand altındaki dosyalar bu tabana yönlendirilir.
 * Tanımlı değilse (yerel geliştirme) dosyalar /public'ten gelir.
 */
const CDN = (process.env.NEXT_PUBLIC_ASSET_BASE ?? "").replace(/\/+$/, "");
const REMOTE_DIRS = /^\/(products|hero|categories|story|brand)\//;

export function assetUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return CDN && REMOTE_DIRS.test(p) ? `${CDN}${p}` : p;
}

export const assetCdnEnabled = Boolean(CDN);
