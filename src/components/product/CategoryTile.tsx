import Image from "next/image";
import type { CSSProperties } from "react";
import { assetUrl } from "@/lib/assets";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductVisual } from "./ProductVisual";

/**
 * Sabit boyutlu kategori görsel kutusu. Görselin oranı ne olursa olsun (dikey şişe, yatay koleksiyon,
 * kavanoz) kutunun içine sığdırılır ve ortalanır; böylece menü ve kartlarda hepsi aynı hizada durur.
 */
export function CategoryTile({ category, sample, className, imgClassName, style }: { category: Category; sample?: Product; className?: string; imgClassName?: string; style?: CSSProperties }) {
  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)} style={style}>
      {category.image ? (
        <Image src={assetUrl(category.image)} alt={category.name} fill sizes="200px" className={cn("object-contain", imgClassName)} />
      ) : sample ? (
        <ProductVisual product={sample} className={cn("h-full w-auto max-w-full", imgClassName)} />
      ) : null}
    </div>
  );
}
