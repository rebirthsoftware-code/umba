"use client";

import { useRef, useState, type PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/format";

/** Yatay, snap'li, sürüklenebilir ürün rayı. */
export function ProductRail({ products, ariaLabel = "Ürünler", className }: { products: Product[]; ariaLabel?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  };
  const by = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = ref.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4) d.moved = true;
    el.scrollLeft = d.left - dx;
  };
  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (d?.moved && ref.current) {
      // sürükleme sonrası tıklamayı yut
      const stop = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      ref.current.addEventListener("click", stop, { capture: true, once: true });
      window.setTimeout(() => ref.current?.removeEventListener("click", stop, { capture: true }), 50);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        role="list"
        aria-label={ariaLabel}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="snap-rail -mx-4 cursor-grab px-4 pb-2 active:cursor-grabbing sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {products.map((p, i) => (
          <div key={p.slug} role="listitem" className="w-[16.5rem] sm:w-[18rem]">
            <ProductCard product={p} priority={i < 3} />
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-espresso-900/10">
          <div className="h-full rounded-full bg-caramel-500 transition-[width] duration-200" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => by(-1)} aria-label="Geri kaydır" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 bg-cream-50 text-espresso-900 transition-colors hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => by(1)} aria-label="İleri kaydır" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 bg-cream-50 text-espresso-900 transition-colors hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
