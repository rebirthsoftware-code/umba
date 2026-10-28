"use client";

import { useRef, type CSSProperties, type MouseEvent } from "react";
import type { Product } from "@/lib/types";
import { ProductVisual } from "@/components/product/ProductVisual";
import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { assetUrl } from "@/lib/assets";

export interface StageTheme {
  panel: string;
  glow: string;
  captionColor?: string;
}

/** Fare hareketiyle hafifçe eğilen, katmanlı paralaks ürün sahnesi. */
export function HeroStage({
  products,
  image,
  theme,
  caption,
  badge,
  active = true,
}: {
  products: Product[];
  /** Ürün yığını yerine tek büyük görsel (şeffaf PNG/WebP). */
  image?: { src: string; alt: string; fit?: "contain" | "cover" };
  theme: StageTheme;
  caption: string;
  badge?: { label: string; product: Product };
  active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--mx", "0");
    ref.current?.style.setProperty("--my", "0");
  };

  const layer = (depth: number, delay: number): CSSProperties => ({
    transform: active
      ? `translate3d(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth * 0.7}px), 0)`
      : `translate3d(0, 40px, 0) scale(0.9)`,
    opacity: active ? 1 : 0,
    transition: `transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 0.7s ease ${delay}ms`,
  });

  const positions = [
    "absolute bottom-16 left-[30%] z-10 w-[34%]",
    "absolute bottom-10 left-[6%] w-[30%]",
    "absolute bottom-12 left-[56%] w-[30%]",
    "absolute bottom-8 right-[2%] hidden w-[22%] sm:block",
  ];
  const depths = [-34, -18, -22, -10];

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="relative mx-auto aspect-[5/4] w-full max-w-xl [perspective:1400px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-8 bottom-6 top-10 rounded-[1.5rem] shadow-lift"
        style={{
          background: theme.panel,
          transform: `rotateX(calc(var(--my, 0) * -7deg)) rotateY(calc(var(--mx, 0) * 9deg)) ${active ? "scale(1)" : "scale(0.92)"}`,
          opacity: active ? 1 : 0,
          transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="absolute inset-0 rounded-[1.5rem] opacity-80"
          style={{
            background: `radial-gradient(60% 50% at calc(70% + var(--mx, 0) * 20%) calc(20% + var(--my, 0) * 20%), ${theme.glow} 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-[1.5rem] opacity-30"
          style={{
            backgroundImage: "radial-gradient(rgba(253,250,245,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(60% 60% at 50% 40%, #000 0%, transparent 100%)",
          }}
        />
        <p className="absolute left-6 top-6 font-display text-sm italic" hidden={!!image} style={{ color: theme.captionColor ?? "rgba(253,250,245,0.7)" }}>
          {caption}
        </p>
      </div>

      {image?.fit === "cover" && (
        <div className="absolute inset-x-8 bottom-6 top-10 z-10 overflow-hidden rounded-[1.5rem]" style={layer(-10, 140)}>
          <Image src={assetUrl(image.src)} alt={image.alt} fill priority={active} sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      )}
      {image && image.fit !== "cover" && (
        <div className="absolute inset-x-[2%] -top-2 bottom-4 z-10" style={layer(-26, 140)}>
          <div className="animate-float relative h-full w-full" style={{ animationDelay: "-1s" }}>
            <Image
              src={assetUrl(image.src)}
              alt={image.alt}
              fill
              priority={active}
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      )}

      {products.slice(0, 4).map((p, i) => (
        <div key={p.slug} className={positions[i]} style={layer(depths[i], 120 + i * 90)}>
          <div className="animate-float" style={{ animationDelay: `${-i * 1.6}s` }}>
            <ProductVisual product={p} className="w-full drop-shadow-2xl" />
          </div>
        </div>
      ))}

      {badge && (
        <div
          className="absolute -bottom-2 right-4 z-20 rounded-2xl border border-espresso-900/10 bg-cream-50/95 px-4 py-3 shadow-card backdrop-blur sm:right-10"
          style={layer(12, 520)}
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-caramel-700">{badge.label}</p>
          <p className="mt-0.5 text-sm font-bold text-espresso-900">{badge.product.name}</p>
          <p className="text-xs text-espresso-600">
            {formatPrice(badge.product.variants[0].price)} · {badge.product.variants[0].label}
          </p>
        </div>
      )}
    </div>
  );
}
