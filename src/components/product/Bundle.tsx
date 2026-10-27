"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { ProductArt } from "./ProductArt";
import { formatPrice, cn } from "@/lib/format";

/** "Birlikte daha iyi" paketi: iki ürünü tek tıkla sepete ekler. */
export function Bundle({ product, partner, reason }: { product: Product; partner: Product; reason: string }) {
  const { add, open } = useCart();
  const [done, setDone] = useState(false);
  const total = product.variants[0].price + partner.variants[0].price;

  const addBoth = () => {
    add({ productSlug: product.slug, variantId: product.variants[0].id, quantity: 1 }, { silent: true });
    add({ productSlug: partner.slug, variantId: partner.variants[0].id, quantity: 1 }, { silent: true });
    setDone(true);
    window.setTimeout(() => {
      setDone(false);
      open();
    }, 700);
  };

  const tile = (p: Product) => (
    <Link href={`/urun/${p.slug}`} className="group flex min-w-0 flex-1 flex-col items-center rounded-2xl bg-cream-50 p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-card">
      <span className="flex h-28 w-full items-center justify-center rounded-xl" style={{ background: `radial-gradient(120% 90% at 50% 100%, ${p.color}33 0%, transparent 60%), #f3ebdf` }}>
        <ProductArt product={p} className="h-[88%] w-auto drop-shadow transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105" />
      </span>
      <span className="mt-3 line-clamp-2 text-sm font-bold text-espresso-900">{p.name}</span>
      <span className="mt-1 text-xs text-espresso-600">
        {p.variants[0].label} · {formatPrice(p.variants[0].price)}
      </span>
    </Link>
  );

  return (
    <section className="rounded-[2rem] border border-espresso-900/10 bg-cream-100 p-5 sm:p-6">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-caramel-700">Birlikte daha iyi</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-espresso-900">{reason}</h2>
      <div className="mt-5 flex items-center gap-3">
        {tile(product)}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-cream-50">
          <Plus className="h-4 w-4" />
        </span>
        {tile(partner)}
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-espresso-900/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-espresso-600">İkisi birlikte</p>
          <p className="font-display text-2xl font-semibold text-espresso-900">{formatPrice(total)}</p>
        </div>
        <button
          type="button"
          onClick={addBoth}
          className={cn(
            "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-all active:scale-[0.98]",
            done ? "bg-leaf-500 text-cream-50" : "bg-espresso-900 text-cream-50 hover:bg-espresso-800",
          )}
        >
          {done ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
          {done ? "Eklendi" : "İkisini sepete ekle"}
        </button>
      </div>
    </section>
  );
}
