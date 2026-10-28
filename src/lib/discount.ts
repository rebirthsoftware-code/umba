import { formatPrice } from "./format";

/**
 * Sepet tutarına göre kademeli indirim.
 * İlk basamaklar sabit TL; 4.100 ₺'den itibaren her 600 ₺'de %1 artarak %10'da sabitlenir.
 * Hem istemci (sepet) hem sunucu (sipariş) aynı tabloyu kullanır.
 */
export type DiscountTier = { min: number; amount: number } | { min: number; pct: number };

export const discountTiers: DiscountTier[] = [
  { min: 2000, amount: 50 },
  { min: 2400, amount: 70 },
  { min: 2900, amount: 140 },
  { min: 3500, amount: 200 },
  { min: 4100, pct: 6 },
  { min: 4700, pct: 7 },
  { min: 5300, pct: 8 },
  { min: 5900, pct: 9 },
  { min: 6500, pct: 10 },
];

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
  if (d.amount > 0) return `Tebrikler! En yüksek indirim: ${formatPrice(d.amount)} (${formatPct(d.pct)}).`;
  if (d.next) return `${formatPrice(d.next.missing)} daha ekleyin, ${formatPrice(d.next.amount)} (${formatPct(d.next.pct)}) indirim kazanın.`;
  return "";
}
