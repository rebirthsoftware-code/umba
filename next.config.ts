import type { NextConfig } from "next";

/** Vercel üzerinde çalışır (umbagida.com). Sipariş API'si src/app/api altındadır. */
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 200, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
