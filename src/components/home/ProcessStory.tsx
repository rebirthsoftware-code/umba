"use client";

import { useEffect, useRef, useState } from "react";
import { getProduct } from "@/lib/products";
import { ProductArt } from "@/components/product/ProductArt";
import { DrinkArt } from "@/components/product/DrinkArt";
import { cn } from "@/lib/format";

const steps = [
  {
    id: "secim",
    no: "01",
    title: "Kaynağında seçim",
    text: "Kahve çekirdeklerini kooperatiflerden, meyveleri sezonunda, kakaoyu yüksek oranlı tedarik ediyoruz. Her partiyi tadıp onaylamadan üretime almıyoruz.",
    product: "etiyopya-yirgacheffe",
    color: "#9a5f3b",
  },
  {
    id: "uretim",
    no: "02",
    title: "Küçük partiler, kendi tesisimiz",
    text: "Şuruplar ve soslar kendi dolum hattımızda, kahveler sipariş sonrası küçük partiler hâlinde kavruluyor. Taze gider, taze gelir.",
    product: "karamel-surubu",
    color: "#d08f2e",
  },
  {
    id: "test",
    no: "03",
    title: "Barista testi",
    text: "Her reçete sıcak, soğuk ve soda bazlı içeceklerde gerçek bar koşullarında denenir. Çöken, ayrışan, rengi solan ürün rafa çıkmaz.",
    product: "cilek-puresi",
    color: "#d9484f",
    drink: true,
  },
  {
    id: "teslimat",
    no: "04",
    title: "Aynı gün kargo",
    text: "14:00'e kadar onaylanan siparişler aynı gün yola çıkar. Cam şişeler bölmeli kutularda, 81 ile 1–3 iş gününde kapınızda.",
    product: "klasik-sicak-cikolata",
    color: "#4a2318",
  },
];

export function ProcessStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.index);
            setActive(idx);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = steps[active];

  return (
    <section className="bg-cream-100 py-16 sm:py-24">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-caramel-600">Tarladan bardağa</p>
          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-espresso-900 sm:text-4xl lg:text-[2.75rem]">
            Dört adımda <span className="accent-italic text-caramel-600">aynı tat,</span> her siparişte.
          </h2>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          {/* Sabit panel */}
          <div className="lg:col-span-5">
            <div
              className="grain sticky top-24 flex aspect-[4/5] max-h-[34rem] flex-col justify-between overflow-hidden rounded-[2.5rem] p-7 text-cream-50 shadow-lift transition-colors duration-700 lg:p-9"
              style={{ background: `linear-gradient(160deg, ${current.color} 0%, #2b1b12 120%)` }}
            >
              <div className="relative flex items-start justify-between">
                <span key={current.no} className="animate-pop-in font-display text-6xl font-semibold text-cream-50/90">
                  {current.no}
                </span>
                <div className="flex gap-1.5">
                  {steps.map((s, i) => (
                    <span key={s.id} className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-8 bg-cream-50" : "w-3 bg-cream-50/30")} />
                  ))}
                </div>
              </div>
              <div className="relative flex-1">
                {steps.map((s, i) => {
                  const p = getProduct(s.product)!;
                  const on = i === active;
                  return (
                    <div
                      key={s.id}
                      aria-hidden={!on}
                      className={cn(
                        "absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        on ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-90 opacity-0",
                      )}
                    >
                      {s.drink ? <DrinkArt product={p} className="h-[88%] w-auto drop-shadow-2xl" /> : <ProductArt product={p} className="h-[88%] w-auto drop-shadow-2xl" />}
                    </div>
                  );
                })}
              </div>
              <h3 key={current.id} className="relative animate-pop-in font-display text-2xl font-semibold">
                {current.title}
              </h3>
            </div>
          </div>

          {/* Adımlar */}
          <ol className="lg:col-span-7">
            {steps.map((s, i) => (
              <li key={s.id}>
                <div
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  data-index={i}
                  className={cn(
                    "flex min-h-[46vh] flex-col justify-center border-t border-espresso-900/10 py-10 transition-opacity duration-500 lg:min-h-[60vh]",
                    i === active ? "opacity-100" : "opacity-35",
                  )}
                >
                  <p className="font-display text-sm italic text-caramel-700">Adım {s.no}</p>
                  <h3 className="mt-2 font-display text-3xl font-semibold leading-tight text-espresso-900 sm:text-4xl">{s.title}</h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-espresso-700 sm:text-lg">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
