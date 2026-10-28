import { formatPrice } from "./format";

/**
 * Sepet tutarına göre kademeli indirim; tüm basamaklar sabit TL.
 * 2.000→50, 2.400→70, 2.900→140, 3.500→200, 4.100→246, 4.700→329, 5.300→424, 5.900→531, 6.500→650 ₺;
 * 6.500 ₺'den sonra her 600 ₺'de 60 ₺ artar (20.000 ₺'ye kadar, sonra sabit).
 * Hem istemci (sepet) hem sunucu (sipariş) aynı tabloyu kullanır.
 */
export type DiscountTier = { min: number; amount: number } | { min: number; pct: number };

const baseTiers: DiscountTier[] = [
  { min: 2000, amount: 50 },
  { min: 2400, amount: 70 },
  { min: 2900, amount: 140 },
  { min: 3500, amount: 200 },
  { min: 4100, amount: 246 },
  { min: 4700, amount: 329 },
  { min: 5300, amount: 424 },
  { min: 5900, amount: 531 },
  { min: 6500, amount: 650 },
];
const extraTiers: DiscountTier[] = [];
for (let min = 7100, amount = 710; min <= 20000; min += 600, amount += 60) extraTiers.push({ min, amount });

export const discountTiers: DiscountTier[] = [...baseTiers, ...extraTiers];

const round2 = (n: number) => Math.round(n * 100) / 100;

function tierAmount(tier: DiscountTier, subtotal: number): number {
  return "amount" in tier ? tier.amount : round2((subtotal * tier.pct) / 100);
}

export interface DiscountInfo {
  /** Uygulanan indirim (₺) */
  amount: number;
  /** Uygulanan indirimin ara toplama oranı (%) */
  pct: number;
  /** Bir sonraki basamak (varsa) */
  next: { min: number; missing: number; amount: number; pct: number } | null;
  /** Tavan basamağa ulaşıldı mı */
  maxed: boolean;
}

export function computeDiscount(subtotal: number): DiscountInfo {
  let current: DiscountTier | null = null;
  let next: DiscountTier | null = null;
  for (const t of discountTiers) {
    if (subtotal >= t.min) current = t;
    else {
      next = t;
      break;
    }
  }
  const amount = current ? tierAmount(current, subtotal) : 0;
  const pct = subtotal > 0 && amount > 0 ? round2((amount / subtotal) * 100) : 0;
  const nextInfo = next
    ? {
        min: next.min,
        missing: round2(next.min - subtotal),
        amount: tierAmount(next, next.min),
        pct: "pct" in next ? next.pct : round2((next.amount / next.min) * 100),
      }
    : null;
  return { amount, pct, next: nextInfo, maxed: !next && Boolean(current) };
}

/** Yüzdeyi Türkçe biçimde yazar: %2,5 */
export function formatPct(pct: number): string {
  return `%${pct.toLocaleString("tr-TR", { maximumFractionDigits: 1 })}`;
}

/** Sepet için teşvik / bilgi cümlesi. */
export function discountMessage(subtotal: number): string {
  const d = computeDiscount(subtotal);
  if (d.amount > 0 && d.next) {
    return `${formatPrice(d.amount)} (${formatPct(d.pct)}) indirim kazandınız. ${formatPrice(d.next.missing)} daha ekleyin, indirim ${formatPrice(d.next.amount)} (${formatPct(d.next.pct)}) olsun.`;
  }
  if (d.amount > 0) return `Tebrikler! ${formatPrice(d.amount)} (${formatPct(d.pct)}) indirim kazandınız.`;
  if (d.next) return `${formatPrice(d.next.missing)} daha ekleyin, ${formatPrice(d.next.amount)} (${formatPct(d.next.pct)}) indirim kazanın.`;
  return "";
}
