import type { NextConfig } from "next";

/**
 * Görseller GitHub deposundan (jsDelivr CDN) sunulur; Vercel'in görsel
 * optimizasyon ve bant genişliği kotası kullanılmaz. Taban adres, Vercel
 * derlemesinde o anki commit'e sabitlenir (yeni görsel = yeni commit = taze CDN).
 * Elle vermek için: NEXT_PUBLIC_ASSET_BASE=https://cdn.jsdelivr.net/gh/<owner>/<repo>@<ref>/public
 */
function assetBase(): string {
  if (process.env.NEXT_PUBLIC_ASSET_BASE !== undefined) return process.env.NEXT_PUBLIC_ASSET_BASE;
  if (!process.env.VERCEL) return "";
  const owner = process.env.VERCEL_GIT_REPO_OWNER || "rebirthsoftware-code";
  const repo = process.env.VERCEL_GIT_REPO_SLUG || "umba";
  const ref = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_REF || "main";
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${ref}/public`;
}

/** Vercel üzerinde çalışır (umbagida.com). Sipariş API'si src/app/api altındadır. */
const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_ASSET_BASE: assetBase() },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 200, 256, 384],
    remotePatterns: [{ protocol: "https", hostname: "cdn.jsdelivr.net" }, { protocol: "https", hostname: "raw.githubusercontent.com" }, { protocol: "https", hostname: "wsrv.nl" }],
  },
  // Statik dosyalar (görseller, ikonlar, SW) için önbellek başlıkları
  async headers() {
    return [
      { source: "/:path(products|hero|categories|story|brand|icons)/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache" }] },
    ];
  },
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
