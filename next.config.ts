import type { NextConfig } from "next";

/** Vercel üzerinde çalışır (umbagida.com). Sipariş API'si src/app/api altındadır. */
const nextConfig: NextConfig = {
  images: { unoptimized: true },
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
