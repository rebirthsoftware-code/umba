"use client";

import { useRef, type MouseEvent } from "react";
import type { Product } from "@/lib/types";
import { ProductArt } from "@/components/product/ProductArt";
import { formatPrice } from "@/lib/format";

/** Fare hareketiyle hafifçe eğilen, katmanlı paralaks ürün sahnesi. */
export function HeroStage({ featured, others }: { featured: Product; others: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--mx", x.toFixed(3));
    el.style.setProperty("--my", y.toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  const layer = (depth: number, extra = "") =>
    ({
      transform: `translate3d(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth * 0.7}px), 0) ${extra}`,
      transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
    }) as const;

  const [b, c, d] = others;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative mx-auto aspect-[5/4] w-full max-w-xl [perspective:1400px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-8 bottom-6 top-10 rounded-[3rem] bg-gradient-to-br from-espresso-900 via-espresso-800 to-espresso-950 shadow-lift"
        style={{
          transform: "rotateX(calc(var(--my, 0) * -7deg)) rotateY(calc(var(--mx, 0) * 9deg))",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 rounded-[3rem] opacity-70"
          style={{
            background:
              "radial-gradient(60% 50% at calc(70% + var(--mx, 0) * 20%) calc(20% + var(--my, 0) * 20%), rgba(226,168,75,0.4) 0%, transparent 60%), radial-gradient(50% 40% at 20% 90%, rgba(217,72,79,0.25) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 rounded-[3rem] opacity-30"
          style={{
            backgroundImage: "radial-gradient(rgba(253,250,245,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(60% 60% at 50% 40%, #000 0%, transparent 100%)",
          }}
        />
        <p className="absolute left-6 top-6 font-display text-sm italic text-cream-200/70">Umba Coffee · 2026 koleksiyonu</p>
        <span
          aria-hidden="true"
          className="absolute right-6 top-6 h-20 w-20 animate-spin-slow rounded-full border border-dashed border-cream-50/20"
        />
      </div>

      {b && (
        <div className="absolute bottom-10 left-[6%] w-[30%]" style={layer(-18)}>
          <div className="animate-float" style={{ animationDelay: "0s" }}>
            <ProductArt product={b} className="w-full drop-shadow-2xl" />
          </div>
        </div>
      )}
      <div className="absolute bottom-16 left-[30%] z-10 w-[34%]" style={layer(-34)}>
        <div className="animate-float" style={{ animationDelay: "-2s" }}>
          <ProductArt product={featured} className="w-full drop-shadow-2xl" />
        </div>
      </div>
      {c && (
        <div className="absolute bottom-12 left-[56%] w-[30%]" style={layer(-22)}>
          <div className="animate-float" style={{ animationDelay: "-4s" }}>
            <ProductArt product={c} className="w-full drop-shadow-2xl" />
          </div>
        </div>
      )}
      {d && (
        <div className="absolute bottom-8 right-[2%] hidden w-[22%] sm:block" style={layer(-10)}>
          <div className="animate-float" style={{ animationDelay: "-1s" }}>
            <ProductArt product={d} className="w-full drop-shadow-2xl" />
          </div>
        </div>
      )}

      <div
        className="absolute -bottom-2 right-4 rounded-2xl border border-espresso-900/10 bg-cream-50/95 px-4 py-3 shadow-card backdrop-blur sm:right-10"
        style={layer(12)}
      >
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-caramel-700">Çok satan</p>
        <p className="mt-0.5 text-sm font-bold text-espresso-900">{featured.name}</p>
        <p className="text-xs text-espresso-600">
          {formatPrice(featured.variants[0].price)} · {featured.variants[0].label}
        </p>
      </div>
    </div>
  );
}
