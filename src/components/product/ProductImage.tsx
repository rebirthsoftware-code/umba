import Image from "next/image";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductArt } from "./ProductArt";

/**
 * Ürün görseli. `product.image` tanımlıysa gerçek fotoğrafı,
 * değilse vektörel ambalaj çizimini gösterir.
 */
export function ProductImage({
  product,
  className,
  artClassName,
  sizeLabel,
  priority = false,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  product: Product;
  className?: string;
  artClassName?: string;
  sizeLabel?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn("relative isolate flex items-center justify-center overflow-hidden", className)}
      style={{
        background: `radial-gradient(120% 90% at 50% 100%, ${product.color}33 0%, transparent 60%), linear-gradient(180deg, #fdfaf5 0%, #f3ebdf 100%)`,
      }}
    >
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain p-6"
        />
      ) : (
        <ProductArt product={product} sizeLabel={sizeLabel} className={cn("h-[82%] w-auto drop-shadow-xl", artClassName)} />
      )}
    </div>
  );
}
