"use client";

import { Check, X, ShoppingBag } from "lucide-react";
import { useCart, TOAST_MS } from "./CartProvider";
import { getProduct, getVariant } from "@/lib/products";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/format";
import type { CSSProperties } from "react";

export function CartToast() {
  const { toast, dismissToast, open, totals } = useCart();
  if (!toast) return null;
  const product = getProduct(toast.productSlug);
  if (!product) return null;
  const variant = getVariant(product, toast.variantId);

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-[70] w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 animate-pop-in overflow-hidden rounded-2xl border border-espresso-900/10 bg-cream-50/95 shadow-lift backdrop-blur-xl sm:left-5 sm:translate-x-0"
    >
      <div className="flex items-center gap-3 p-3 pr-2">
        <ProductImage product={product} sizeLabel={variant.label} className="h-16 w-14 shrink-0 rounded-2xl" />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-leaf-500">
            <Check className="h-3.5 w-3.5" /> Sepete eklendi
          </p>
          <p className="truncate text-sm font-bold text-espresso-900">{product.name}</p>
          <p className="text-xs text-espresso-600">
            {variant.label} × {toast.quantity} · {formatPrice(variant.price * toast.quantity)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            dismissToast();
            open();
          }}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-espresso-900 px-4 text-xs font-bold text-cream-50 hover:bg-espresso-800"
        >
          <ShoppingBag className="h-3.5 w-3.5" /> Sepet ({totals.itemCount})
        </button>
        <button type="button" onClick={dismissToast} aria-label="Kapat" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-espresso-600 hover:bg-cream-200">
          <X className="h-4 w-4" />
        </button>
      </div>
      <span className="toast-bar block h-0.5 bg-caramel-500" style={{ "--toast-ms": `${TOAST_MS}ms` } as CSSProperties} />
    </div>
  );
}
