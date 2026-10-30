/**
 * Fiyat katmanı: katalogdaki temel fiyatların üstüne yönetim panelinden
 * girilen SKU bazlı fiyatlar uygulanır. Hem sunucu (sipariş hesabı, ISR
 * sayfalar) hem istemci (sepet, ürün kartları) aynı depoyu kullanır;
 * Variant.price bu depodan okur (bkz. products.ts → v()).
 */
export type PriceOverrides = Record<string, number>;

let overrides: PriceOverrides = {};
let version = 0;
const listeners = new Set<() => void>();

export function priceOverride(sku: string): number | undefined {
  return overrides[sku];
}

export function getPriceOverrides(): PriceOverrides {
  return overrides;
}

export function setPriceOverrides(next: PriceOverrides): void {
  overrides = { ...next };
  version++;
  for (const l of listeners) l();
}

export function subscribePrices(l: () => void): () => void {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function priceVersion(): number {
  return version;
}

/* ------------------------- Kargo ayarları (panelden) ------------------------- */
export interface CommerceSettings {
  shippingFee: number;
  freeShippingThreshold: number;
}
export const defaultCommerce: CommerceSettings = { shippingFee: 89.9, freeShippingThreshold: 1500 };
let commerce: CommerceSettings = { ...defaultCommerce };

export function getCommerceSettings(): CommerceSettings {
  return commerce;
}

export function setCommerceSettings(next: Partial<CommerceSettings>): void {
  commerce = { ...defaultCommerce, ...commerce, ...next };
  version++;
  for (const l of listeners) l();
}

/** Kargo ücreti 0 olabilir (her zaman ücretsiz); limit 0 ise her siparişte ücretsiz. */
export function normalizeAmount(n: unknown): number | null {
  const x = typeof n === "string" ? Number(n.replace(",", ".")) : Number(n);
  if (!Number.isFinite(x) || x < 0 || x > 1_000_000) return null;
  return Math.round(x * 100) / 100;
}

/** Geçerli bir satış fiyatı mı (pozitif, kuruş hassasiyetinde). */
export function normalizePrice(n: unknown): number | null {
  const x = typeof n === "string" ? Number(n.replace(",", ".")) : Number(n);
  if (!Number.isFinite(x) || x <= 0 || x > 1_000_000) return null;
  return Math.round(x * 100) / 100;
}
