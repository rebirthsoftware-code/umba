/** Alt dizinde yayın (GitHub Pages) için /public yollarına basePath ekler. */
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

export function assetUrl(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
