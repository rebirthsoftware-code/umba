import type { CartItem, CartLine } from "./types";
import { getProduct, getVariant } from "./products";
import { site } from "./site";
import { computeDiscount } from "./discount";

export const CART_STORAGE_KEY = "umba:cart:v1";

export function lineKey(item: Pick<CartItem, "productSlug" | "variantId">): string {
  return `${item.productSlug}::${item.variantId}`;
}

export function resolveLines(items: CartItem[]): CartLine[] {
  const lines: CartLine[] = [];
  for (const item of items) {
    const product = getProduct(item.productSlug);
    if (!product) continue;
    const variant = getVariant(product, item.variantId);
    if (!variant) continue;
    lines.push({
      ...item,
      product,
      variant,
      lineTotal: round2(variant.price * item.quantity),
    });
  }
  return lines;
}

export type PaymentMethod = "havale" | "kart";

export interface Totals {
  subtotal: number;
  shipping: number;
  codFee: number;
  discount: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number;
}

export function computeTotals(
  lines: CartLine[],
  paymentMethod: PaymentMethod = "havale",
): Totals {
  const subtotal = round2(lines.reduce((s, l) => s + l.lineTotal, 0));
  const itemCount = lines.reduce((s, l) => s + l.quantity, 0);
  const { freeShippingThreshold, shippingFee, codFee } = site.commerce;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const cod = 0;
  void paymentMethod;
  void codFee;
  const discount = computeDiscount(subtotal).amount;
  const total = round2(subtotal - discount + shipping + cod);
  return {
    subtotal,
    shipping,
    codFee: cod,
    discount,
    total,
    itemCount,
    freeShippingRemaining: Math.max(0, round2(freeShippingThreshold - subtotal)),
  };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
