export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdfaf5",
    theme_color: "#141414",
    lang: "tr",
    categories: ["shopping", "food"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Ürünler", url: "/urunler", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Sepet", url: "/sepet", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Sipariş takip", url: "/siparis-takip", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
