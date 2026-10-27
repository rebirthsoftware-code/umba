import Image from "next/image";
import type { Product } from "@/lib/types";
import { ProductArt } from "./ProductArt";

/** Ürün sayfası ana görseli: sade sahne, yumuşak tint, tek odak. */
export function ProductStage({ product }: { product: Product }) {
  return (
    <div
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-cream-100 sm:aspect-square"
      style={{ background: `linear-gradient(180deg, #f6f0e6 0%, #efe4d4 100%)` }}
    >
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: `linear-gradient(180deg, transparent, ${product.color}26)` }} />
      <span aria-hidden="true" className="absolute left-1/2 top-[64%] h-10 w-2/3 -translate-x-1/2 rounded-[100%] bg-espresso-900/10 blur-xl" />
      {product.image ? (
        <Image src={product.image} alt={product.name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-10" />
      ) : (
        <ProductArt
          product={product}
          className="absolute left-1/2 top-1/2 h-[76%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      )}
    </div>
  );
}
