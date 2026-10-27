"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { ProductVisual } from "./ProductVisual";
import { formatPrice, cn } from "@/lib/format";

/** Satın alma paneli görünümden çıkınca altta beliren sabit çubuk. */
export function StickyBuyBar({ product, targetId }: { product: Product; targetId: string }) {
  const { add } = useCart();
  const [visible, setVisible] = useState(false);
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [done, setDone] = useState(false);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setVisible(passed);
      },
      { threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [targetId]);

  useEffect(() => {
    document.body.classList.toggle("has-buybar", visible);
    return () => document.body.classList.remove("has-buybar");
  }, [visible]);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div className="container-x pb-3">
        <div className="flex items-center gap-3 rounded-2xl border border-espresso-900/10 bg-cream-50/95 p-2.5 pr-3 shadow-lift backdrop-blur-xl">
          <span className="hidden h-12 w-10 shrink-0 items-center justify-center rounded-xl bg-cream-100 sm:flex">
            <ProductVisual product={product} className="h-[84%] w-auto" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-espresso-900">{product.name}</p>
            <p className="text-xs text-espresso-600">{formatPrice(variant.price)}</p>
          </div>
          {product.variants.length > 1 && (
            <select
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              aria-label="Boy"
              className="h-10 rounded-full border border-espresso-900/15 bg-cream-50 px-3 text-xs font-semibold focus:border-caramel-500 focus:outline-none"
            >
              {product.variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => {
              add({ productSlug: product.slug, variantId: variant.id, quantity: 1 });
              setDone(true);
              window.setTimeout(() => setDone(false), 1200);
            }}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-bold transition-all",
              done ? "bg-leaf-500 text-cream-50" : "bg-espresso-900 text-cream-50 hover:bg-espresso-800",
            )}
          >
            {done ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
            <span className="hidden sm:inline">{done ? "Eklendi" : "Sepete ekle"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
