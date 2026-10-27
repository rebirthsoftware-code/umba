"use client";

import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/format";

export function QuickAddButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const variant = product.variants[0];

  return (
    <button
      type="button"
      aria-label={`${product.name} sepete ekle`}
      disabled={!variant?.inStock}
      onClick={() => {
        add({ productSlug: product.slug, variantId: variant.id, quantity: 1 });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={cn(
        "relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
        added
          ? "border-leaf-500 bg-leaf-500 text-cream-50"
          : "border-espresso-900/15 bg-cream-50 text-espresso-900 hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50",
      )}
    >
      {added ? <Check className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
    </button>
  );
}
