import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { categoryMap } from "@/lib/categories";
import { minPrice } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { TagBadge } from "@/components/ui/Badge";
import { ProductImage } from "./ProductImage";
import { DrinkArt } from "./DrinkArt";
import { RollingPrice } from "./RollingPrice";
import { QuickAddButton } from "./QuickAddButton";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const category = categoryMap[product.category];
  const price = minPrice(product);
  const visibleTags = product.tags.filter((t) => t === "cok-satan" || t === "yeni" || t === "sekersiz").slice(0, 2);
  const hasMultiple = product.variants.length > 1;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-espresso-900/5 bg-cream-50 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
      <Link href={`/urun/${product.slug}`} className="shine relative block overflow-hidden" aria-label={product.name}>
        {/* Ambalaj görseli (varsayılan) */}
        <ProductImage
          product={product}
          priority={priority}
          className="aspect-[4/5] w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-0"
        />
        {/* Hover: bardaktaki görünüm (veya ikinci fotoğraf) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:translateY(14px)_scale(0.94)] group-hover:opacity-100 group-hover:[transform:translateY(0)_scale(1)]"
          style={{
            background: `radial-gradient(120% 90% at 50% 100%, ${product.color}55 0%, transparent 62%), linear-gradient(180deg, #fdfaf5 0%, #f3ebdf 100%)`,
          }}
        >
          {product.imageHover ? (
            <Image src={product.imageHover} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain p-6" />
          ) : (
            <DrinkArt product={product} className="h-[82%] w-auto drop-shadow-xl" />
          )}
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-espresso-900/85 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-cream-50 opacity-0 transition-all delay-150 duration-500 [transform:translate(-50%,8px)] group-hover:opacity-100 group-hover:[transform:translate(-50%,0)]">
            Bardakta
          </span>
        </div>
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

        {/* Açıklama ↔ boy seçenekleri (hover'da yer değiştirir) */}
        <div className="relative h-10">
          <p className="line-clamp-2 text-sm leading-relaxed text-espresso-600 transition-all duration-400 group-hover:-translate-y-1 group-hover:opacity-0">
            {product.short}
          </p>
          <ul className="absolute inset-0 flex flex-wrap content-start gap-1.5 opacity-0 transition-all delay-75 duration-400 [transform:translateY(6px)] group-hover:opacity-100 group-hover:[transform:translateY(0)]">
            {product.variants.map((v, i) => (
              <li
                key={v.id}
                style={{ transitionDelay: `${90 + i * 60}ms` }}
                className="rounded-full border border-espresso-900/10 bg-cream-100 px-2.5 py-1 text-[0.7rem] font-semibold text-espresso-800"
              >
                {v.label} · {formatPrice(v.price)}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <span className="inline-flex items-baseline gap-2">
            {hasMultiple && (
              <span className="text-xs font-medium text-espresso-600 transition-opacity group-hover:opacity-0">başlangıç</span>
            )}
            <RollingPrice value={price} />
          </span>
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  );
}
