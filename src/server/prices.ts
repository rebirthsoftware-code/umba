import { db, dbConfigured } from "./db";
import { products } from "@/lib/products";
import { normalizePrice, normalizeAmount, setPriceOverrides, setCommerceSettings, getCommerceSettings, defaultCommerce, type PriceOverrides, type CommerceSettings } from "@/lib/prices";

/** Veritabanındaki SKU → fiyat tablosunu okur. */
export async function readPriceOverrides(): Promise<PriceOverrides> {
  const client = await db();
  const rs = await client.execute("SELECT sku, price FROM price_overrides");
  const map: PriceOverrides = {};
  for (const r of rs.rows) map[String(r.sku)] = Number(r.price);
  return map;
}

/**
 * Sunucu tarafında fiyat deposunu tazeler. Veritabanı yoksa veya
 * erişilemezse sessizce katalog fiyatlarıyla devam eder (derleme dahil).
 */
export async function loadPriceOverrides(): Promise<PriceOverrides> {
  if (!dbConfigured()) return {};
  try {
    const [map, commerce] = await Promise.all([readPriceOverrides(), readCommerceSettings()]);
    setPriceOverrides(map);
    setCommerceSettings(commerce);
    return map;
  } catch {
    return {};
  }
}

const COMMERCE_KEYS: (keyof CommerceSettings)[] = ["shippingFee", "freeShippingThreshold"];

/** Panelden kaydedilen kargo ayarları; kayıt yoksa varsayılanlar. */
export async function readCommerceSettings(): Promise<CommerceSettings> {
  const client = await db();
  const rs = await client.execute("SELECT key, value FROM settings WHERE key IN ('shippingFee','freeShippingThreshold')");
  const out: CommerceSettings = { ...defaultCommerce };
  for (const r of rs.rows) {
    const k = String(r.key) as keyof CommerceSettings;
    const n = normalizeAmount(String(r.value));
    if (COMMERCE_KEYS.includes(k) && n !== null) out[k] = n;
  }
  return out;
}

export async function saveCommerceSettings(input: Partial<Record<keyof CommerceSettings, unknown>>): Promise<CommerceSettings> {
  const client = await db();
  const now = new Date().toISOString();
  const stmts: { sql: string; args: (string | number)[] }[] = [];
  for (const k of COMMERCE_KEYS) {
    if (input[k] === undefined) continue;
    const n = normalizeAmount(input[k]);
    if (n === null) throw new Error(`Geçersiz değer: ${k}`);
    stmts.push({ sql: "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at", args: [k, String(n), now] });
  }
  if (stmts.length) await client.batch(stmts, "write");
  await loadPriceOverrides();
  return getCommerceSettings();
}

export interface PriceRow {
  slug: string;
  name: string;
  category: string;
  variantId: string;
  label: string;
  sku: string;
  basePrice: number;
  price: number;
  overridden: boolean;
}

/** Yönetim paneli için tüm ürün/varyantlar ve güncel fiyatları. */
export async function listPrices(): Promise<PriceRow[]> {
  const map = await loadPriceOverrides();
  const rows: PriceRow[] = [];
  for (const p of products)
    for (const v of p.variants)
      rows.push({ slug: p.slug, name: p.name, category: p.category, variantId: v.id, label: v.label, sku: v.sku, basePrice: v.basePrice ?? v.price, price: map[v.sku] ?? v.basePrice ?? v.price, overridden: v.sku in map });
  return rows;
}

/** price null → temel fiyata dön (kayıt silinir). */
export async function savePrices(items: { sku: string; price: number | null }[]): Promise<{ saved: number; reset: number; invalid: string[] }> {
  const known = new Set(products.flatMap((p) => p.variants.map((v) => v.sku)));
  const client = await db();
  const now = new Date().toISOString();
  let saved = 0;
  let reset = 0;
  const invalid: string[] = [];
  const stmts: { sql: string; args: (string | number)[] }[] = [];
  for (const it of items) {
    if (!known.has(it.sku)) {
      invalid.push(it.sku);
      continue;
    }
    if (it.price === null || it.price === undefined) {
      stmts.push({ sql: "DELETE FROM price_overrides WHERE sku = ?", args: [it.sku] });
      reset++;
      continue;
    }
    const price = normalizePrice(it.price);
    if (price === null) {
      invalid.push(it.sku);
      continue;
    }
    stmts.push({ sql: "INSERT INTO price_overrides (sku, price, updated_at) VALUES (?, ?, ?) ON CONFLICT(sku) DO UPDATE SET price = excluded.price, updated_at = excluded.updated_at", args: [it.sku, price, now] });
    saved++;
  }
  if (stmts.length) await client.batch(stmts, "write");
  await loadPriceOverrides();
  return { saved, reset, invalid };
}
