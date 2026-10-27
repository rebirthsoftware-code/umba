import Link from "next/link";
import type { Product } from "@/lib/types";
import { categoryMap } from "@/lib/categories";
import { minPrice } from "@/lib/products";
import { Price } from "@/components/ui/Price";
import { TagBadge } from "@/components/ui/Badge";
import { ProductImage } from "./ProductImage";
import { QuickAddButton } from "./QuickAddButton";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const category = categoryMap[product.category];
  const price = minPrice(product);
  const visibleTags = product.tags.filter((t) => t === "cok-satan" || t === "yeni" || t === "sekersiz").slice(0, 2);
  const hasMultiple = product.variants.length > 1;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-espresso-900/5 bg-cream-50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/urun/${product.slug}`} className="shine relative block" aria-label={product.name}>
        <ProductImage
          product={product}
          priority={priority}
          className="aspect-[4/5] w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          artClassName="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-3 group-hover:-translate-y-1"
        />
        {visibleTags.length > 0 && (
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {visibleTags.map((t) => (
              <TagBadge key={t} tag={t} />
            ))}
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-caramel-700">{category.name}</p>
        <h3 className="font-display text-lg font-semibold leading-tight text-espresso-900">
          <Link href={`/urun/${product.slug}`} className="after:absolute after:inset-0 after:z-0">
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-espresso-600">{product.short}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <Price value={price} prefix={hasMultiple ? "başlangıç" : undefined} />
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  );
}
