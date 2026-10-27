import Link from "next/link";
import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import type { Product } from "@/lib/types";
import { categoryMap } from "@/lib/categories";
import { minPrice } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { TagBadge } from "@/components/ui/Badge";
import { ProductArt } from "./ProductArt";
import { DrinkArt } from "./DrinkArt";
import { RollingPrice } from "./RollingPrice";
import { QuickAddButton } from "./QuickAddButton";

export function ProductCard({ product }: { product: Product; priority?: boolean }) {
  const category = categoryMap[product.category];
  const price = minPrice(product);
  const visibleTags = product.tags.filter((t) => t === "cok-satan" || t === "yeni" || t === "sekersiz").slice(0, 1);
  const hasMultiple = product.variants.length > 1;

  return (
    <article className="group relative flex h-full flex-col">
      <Link
        href={`/urun/${product.slug}`}
        aria-label={product.name}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-cream-100 transition-colors duration-500 group-hover:bg-cream-200"
      >
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/5" style={{ background: `linear-gradient(180deg, transparent, ${product.color}1f)` }} />
        {/* Ambalaj */}
        <span className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-3 group-hover:opacity-0">
          {product.image ? (
            <Image src={assetUrl(product.image)} alt={product.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-3 drop-shadow-lg" />
          ) : (
            <ProductArt product={product} className="h-[78%] w-auto drop-shadow-lg" />
          )}
        </span>
        {/* Bardakta */}
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:translateY(12px)] group-hover:opacity-100 group-hover:[transform:translateY(0)]">
          {product.imageHover ? (
            <Image src={assetUrl(product.imageHover)} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-6" />
          ) : (
            <DrinkArt product={product} className="h-[78%] w-auto drop-shadow-lg" />
          )}
        </span>
        {visibleTags.length > 0 && (
          <span className="absolute left-3 top-3">
            {visibleTags.map((t) => (
              <TagBadge key={t} tag={t} />
            ))}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-caramel-700">{category.name}</p>
        <h3 className="mt-1 font-display text-[1.15rem] font-semibold leading-snug text-espresso-900">
          <Link href={`/urun/${product.slug}`} className="after:absolute after:inset-0 after:z-0">
            {product.name}
          </Link>
        </h3>
        <div className="relative mt-1 h-10">
          <p className="line-clamp-2 text-sm leading-relaxed text-espresso-600 transition-opacity duration-300 group-hover:opacity-0">{product.short}</p>
          <p className="absolute inset-0 text-sm leading-relaxed text-espresso-700 opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
            {product.variants.map((v) => `${v.label} · ${formatPrice(v.price)}`).join("  ·  ")}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <span className="inline-flex items-baseline gap-2">
            {hasMultiple && <span className="text-xs text-espresso-600 transition-opacity group-hover:opacity-0">başlangıç</span>}
            <RollingPrice value={price} className="text-[15px]" />
          </span>
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  );
}
