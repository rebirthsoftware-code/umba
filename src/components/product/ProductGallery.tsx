"use client";

import { useState, type MouseEvent } from "react";
import { ZoomIn } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductArt } from "./ProductArt";
import { DrinkArt } from "./DrinkArt";
import { ProductImage } from "./ProductImage";
import { cn } from "@/lib/format";

type ViewId = "ambalaj" | "bardak" | "etiket";
const views: { id: ViewId; label: string }[] = [
  { id: "ambalaj", label: "Ambalaj" },
  { id: "bardak", label: "Bardakta" },
  { id: "etiket", label: "Etiket" },
];

/** Ambalaj / bardakta / etiket görünümleri, imleçle yakınlaştırma ve küçük önizlemeler. */
export function ProductGallery({ product }: { product: Product }) {
  const [view, setView] = useState<ViewId>("ambalaj");
  const [zoom, setZoom] = useState(false);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--zx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    e.currentTarget.style.setProperty("--zy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
  };

  const bg = `radial-gradient(120% 90% at 50% 100%, ${product.color}40 0%, transparent 60%), linear-gradient(180deg, #fdfaf5 0%, #f3ebdf 100%)`;

  return (
    <div>
      <div
        className={cn(
          "relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden rounded-[2rem] border border-espresso-900/5 shadow-card sm:aspect-square",
          zoom && "zoom-active cursor-zoom-out",
        )}
        style={{ background: bg }}
        onMouseMove={onMove}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onClick={() => setZoom((z) => !z)}
        role="img"
        aria-label={`${product.name} – ${views.find((v) => v.id === view)?.label}`}
      >
        {/* Ambalaj */}
        <div className={cn("absolute inset-0 transition-all duration-500", view === "ambalaj" ? "scale-100 opacity-100" : "scale-95 opacity-0")} aria-hidden={view !== "ambalaj"}>
          <div className="zoomable absolute inset-0">
            {product.image ? (
              <ProductImage product={product} priority sizes="(min-width: 1024px) 50vw, 100vw" className="h-full w-full bg-transparent" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ProductArt product={product} className="h-[78%] w-auto drop-shadow-2xl" />
              </div>
            )}
          </div>
        </div>
        {/* Bardakta */}
        <div className={cn("absolute inset-0 transition-all duration-500", view === "bardak" ? "scale-100 opacity-100" : "scale-95 opacity-0")} aria-hidden={view !== "bardak"}>
          <div className="zoomable absolute inset-0 flex items-center justify-center">
            <DrinkArt product={product} className="h-[80%] w-auto drop-shadow-2xl" />
          </div>
        </div>
        {/* Etiket yakın plan */}
        <div className={cn("absolute inset-0 transition-all duration-500", view === "etiket" ? "scale-100 opacity-100" : "scale-95 opacity-0")} aria-hidden={view !== "etiket"}>
          <div className="zoomable absolute inset-0 flex items-center justify-center overflow-hidden">
            <ProductArt product={product} className="h-[240%] w-auto translate-y-[8%] drop-shadow-2xl" />
          </div>
        </div>
        <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-cream-50/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-espresso-700 backdrop-blur">
          <ZoomIn className="h-3.5 w-3.5" /> {zoom ? "Yakınlaştırıldı" : "Yakınlaştır"}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label="Görünümler">
        {views.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border p-2 text-left transition-all",
              view === v.id ? "border-espresso-900 bg-cream-50 shadow-card" : "border-espresso-900/10 bg-cream-100 hover:border-espresso-900/40",
            )}
          >
            <span className="flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl" style={{ background: bg }}>
              {v.id === "ambalaj" && <ProductArt product={product} className="h-[84%] w-auto" />}
              {v.id === "bardak" && <DrinkArt product={product} className="h-[84%] w-auto" />}
              {v.id === "etiket" && <ProductArt product={product} className="h-[220%] w-auto translate-y-[6%]" />}
            </span>
            <span className="text-xs font-bold text-espresso-900">{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
