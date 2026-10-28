import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import type { Category, Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";

/** Kategori görseli: kategoriye özel şeffaf fotoğraf varsa onu, yoksa ilk ürünün görselini gösterir. */
export function CategoryVisual({ category, sample, className }: { category: Category; sample?: Product; className?: string }) {
  if (category.image) {
    const landscape = category.imageLandscape;
    return <Image src={assetUrl(category.image)} alt={category.name} width={landscape ? 1200 : 900} height={landscape ? 800 : 1200} className={className} style={{ objectFit: "contain" }} />;
  }
  if (!sample) return null;
  return <ProductVisual product={sample} className={className} />;
}
