"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { ProductArt } from "./ProductArt";
import { formatPrice, cn } from "@/lib/format";

/** "Birlikte daha iyi": iki ürünü tek tıkla sepete ekler. */
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
    <Link href={`/urun/${p.slug}`} className="group flex min-w-0 flex-1 items-center gap-3">
      <span className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl bg-cream-100">
        <ProductArt product={p} className="h-[84%] w-auto transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105" />
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 text-sm font-semibold leading-snug text-espresso-900">{p.name}</span>
        <span className="block text-xs text-espresso-600">
          {p.variants[0].label} · {formatPrice(p.variants[0].price)}
        </span>
      </span>
    </Link>
  );

  return (
    <section className="rounded-2xl border border-espresso-900/10 p-5">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-caramel-700">Birlikte daha iyi</p>
      <p className="mt-1 text-sm text-espresso-700">{reason}</p>
      <div className="mt-4 flex items-center gap-3">
        {tile(product)}
        <Plus className="h-4 w-4 shrink-0 text-espresso-600" />
        {tile(partner)}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-espresso-900/10 pt-4">
        <p className="text-sm text-espresso-700">
          İkisi birlikte <span className="font-semibold text-espresso-900">{formatPrice(total)}</span>
        </p>
        <button
          type="button"
          onClick={addBoth}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
            done ? "bg-leaf-500 text-cream-50" : "border border-espresso-900/20 text-espresso-900 hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50",
          )}
        >
          {done ? <Check className="h-4 w-4" /> : null}
          {done ? "Eklendi" : "İkisini ekle"}
        </button>
      </div>
    </section>
  );
}
