import { cn } from "@/lib/format";
import type { ProductTag } from "@/lib/types";

const tagLabel: Record<ProductTag, string> = {
  "cok-satan": "Çok satan",
  yeni: "Yeni",
  sekersiz: "Şekersiz",
  vegan: "Vegan",
  horeca: "HoReCa",
  "single-origin": "Single origin",
};

const tagStyle: Record<ProductTag, string> = {
  "cok-satan": "bg-caramel-500 text-espresso-950",
  yeni: "bg-leaf-500 text-cream-50",
  sekersiz: "bg-cream-50 text-espresso-900 ring-1 ring-espresso-900/15",
  vegan: "bg-leaf-100 text-leaf-500",
  horeca: "bg-espresso-900 text-cream-50",
  "single-origin": "bg-cream-50 text-espresso-900 ring-1 ring-espresso-900/15",
};

export function TagBadge({ tag, className }: { tag: ProductTag; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider",
        tagStyle[tag],
        className,
      )}
    >
      {tagLabel[tag]}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-espresso-900/10 bg-cream-50/80 px-3 py-1 text-xs font-semibold text-espresso-700 backdrop-blur",
        className,
      )}
    >
      {children}
    </span>
  );
}
