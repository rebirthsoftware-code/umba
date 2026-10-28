/** /public altındaki dosya yolu (alt dizin desteği kaldırıldı; site kök alan adında yayınlanır). */
export function assetUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}
