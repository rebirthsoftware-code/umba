import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import type { Product } from "@/lib/types";
import { ProductArt } from "./ProductArt";

/**
 * Ürün görseli: gerçek fotoğraf varsa onu (şeffaf PNG/WebP, 900×1200),
 * yoksa vektörel ambalaj çizimini gösterir. Sabit yükseklik + otomatik genişlik ile kullanılır.
 */
export function ProductVisual({
  product,
  className,
  sizeLabel,
  priority = false,
}: {
  product: Pick<Product, "name" | "color" | "color2" | "art" | "category" | "slug" | "variants" | "image">;
  className?: string;
  sizeLabel?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return <Image src={assetUrl(product.image)} alt={product.name} width={900} height={1200} priority={priority} className={className} style={{ objectFit: "contain" }} />;
  }
  return <ProductArt product={product} className={className} sizeLabel={sizeLabel} />;
}
