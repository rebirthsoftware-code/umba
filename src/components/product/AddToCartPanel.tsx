"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice, cn, unitPrice } from "@/lib/format";
import { DeliveryEstimate } from "./DeliveryEstimate";
import { site } from "@/lib/site";

export function AddToCartPanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  const submit = () => {
    add({ productSlug: product.slug, variantId: variant.id, quantity: qty });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-espresso-900/10 bg-cream-50 p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Fiyat (KDV dahil)</p>
          <p className="mt-1 font-display text-4xl font-semibold tabular-nums text-espresso-900">{formatPrice(variant.price)}</p>
          {unitPrice(variant.label, variant.price) && (
            <p className="mt-1 text-xs text-espresso-600">{unitPrice(variant.label, variant.price)}</p>
          )}
        </div>
        {variant.compareAtPrice && (
          <p className="text-sm text-espresso-600 line-through">{formatPrice(variant.compareAtPrice)}</p>
        )}
      </div>

      {product.variants.length > 1 && (
        <fieldset className="mt-5">
          <legend className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Boy seçin</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <label
                key={v.id}
                className={cn(
                  "cursor-pointer rounded-2xl border px-4 py-2.5 text-sm transition-colors",
                  v.id === variantId
                    ? "border-espresso-900 bg-espresso-900 text-cream-50"
                    : "border-espresso-900/15 bg-cream-50 hover:border-espresso-900",
                  !v.inStock && "cursor-not-allowed opacity-50",
                )}
              >
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={v.id === variantId}
                  onChange={() => setVariantId(v.id)}
                  disabled={!v.inStock}
                  className="sr-only"
                />
                <span className="font-bold">{v.label}</span>
                <span className={cn("ml-2 text-xs", v.id === variantId ? "text-cream-200" : "text-espresso-600")}>
                  {formatPrice(v.price)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <div className="inline-flex h-13 items-center rounded-full border border-espresso-900/15">
          <button
            type="button"
            aria-label="Azalt"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="inline-flex h-full w-12 items-center justify-center rounded-l-full hover:bg-cream-200"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
            aria-label="Adet"
            className="h-full w-14 bg-transparent text-center text-base font-bold tabular-nums focus:outline-none"
          />
          <button
            type="button"
            aria-label="Artır"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className="inline-flex h-full w-12 items-center justify-center rounded-r-full hover:bg-cream-200"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={!variant.inStock}
          className={cn(
            "inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full text-base font-bold transition-all active:scale-[0.98] disabled:opacity-50",
            added ? "bg-leaf-500 text-cream-50" : "bg-espresso-900 text-cream-50 hover:bg-espresso-800",
          )}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" /> Sepete eklendi
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" /> Sepete ekle · {formatPrice(variant.price * qty)}
            </>
          )}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-espresso-600">
          Stok kodu: <span className="font-mono">{variant.sku}</span> ·{" "}
          {variant.inStock ? <span className="font-semibold text-leaf-500">Stokta</span> : "Tükendi"}
        </p>
        <DeliveryEstimate />
      </div>

      <ul className="mt-5 grid gap-2 border-t border-espresso-900/10 pt-4 text-xs text-espresso-700 sm:grid-cols-3">
        <li className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-caramel-600" /> {formatPrice(site.commerce.freeShippingThreshold)}+ kargo bedava
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-caramel-600" /> Güvenli ödeme
        </li>
        <li className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-caramel-600" /> 14 gün iade
        </li>
      </ul>
    </div>
  );
}
