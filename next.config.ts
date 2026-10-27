import type { NextConfig } from "next";

/**
 * Site tamamen statik olarak dışa aktarılır (GitHub Pages, Netlify, herhangi bir statik hosting).
 * Alt dizinde yayınlanıyorsa (ör. https://kullanici.github.io/umba) NEXT_PUBLIC_BASE_PATH=/umba verin.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
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
