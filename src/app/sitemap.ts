export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { products } from "@/lib/products";
import { categories } from "@/lib/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const lastModified = new Date("2026-10-01");
  const statics = ["", "/urunler", "/hakkimizda", "/kurumsal", "/iletisim", "/sss", "/kvkk", "/gizlilik-politikasi", "/mesafeli-satis-sozlesmesi", "/on-bilgilendirme-formu", "/iptal-ve-iade", "/teslimat-ve-kargo"];
  return [
    ...statics.map((p) => ({
      url: `${base}${p}`,
      lastModified,
      changeFrequency: (p === "" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: p === "" ? 1 : p === "/urunler" ? 0.9 : 0.5,
    })),
    ...categories.map((c) => ({ url: `${base}/kategori/${c.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/urun/${p.slug}`, lastModified, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
