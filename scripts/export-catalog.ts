/**
 * Katalog fiyatlarını public/catalog.json olarak dışa aktarır.
 * PayTR Worker'ı sepet tutarını bu dosyadan yeniden hesaplar (istemciye güvenmez).
 * `npm run build` öncesinde otomatik çalışır (prebuild).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { products } from "../src/lib/products";
import { site } from "../src/lib/site";

const items = products.flatMap((p) =>
  p.variants.map((v) => ({
    slug: p.slug,
    variantId: v.id,
    sku: v.sku,
    name: `${p.name} (${v.label})`,
    variantLabel: v.label,
    price: v.price,
    inStock: v.inStock,
  })),
);

const catalog = {
  generatedAt: new Date().toISOString(),
  currency: "TRY",
  commerce: {
    freeShippingThreshold: site.commerce.freeShippingThreshold,
    shippingFee: site.commerce.shippingFee,
    codFee: site.commerce.codFee,
  },
  items,
};

mkdirSync("public", { recursive: true });
writeFileSync("public/catalog.json", JSON.stringify(catalog));
console.log(`catalog.json yazıldı: ${items.length} varyant`);
