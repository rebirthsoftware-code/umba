"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/format";

const steps = [
  {
    id: "secim",
    no: "01",
    title: "Kaynağında seçim",
    text: "Kahve çekirdeklerini kooperatiflerden, meyveleri sezonunda, kakaoyu yüksek oranlı tedarik ediyoruz. Her partiyi tadıp onaylamadan üretime almıyoruz.",
    image: "/story/cekirdek.webp",
    color: "#9a5f3b",
  },
  {
    id: "uretim",
    no: "02",
    title: "Küçük partiler, kendi tesisimiz",
    text: "Şuruplar ve soslar kendi dolum hattımızda, kahveler sipariş sonrası küçük partiler hâlinde kavruluyor. Taze gider, taze gelir.",
    image: "/products/tuzlu-karamel-surubu.webp",
    color: "#c9b48a",
  },
  {
    id: "test",
    no: "03",
    title: "Barista testi",
    text: "Her reçete sıcak, soğuk ve soda bazlı içeceklerde gerçek bar koşullarında denenir. Çöken, ayrışan, rengi solan ürün rafa çıkmaz.",
    image: "/products/cilek-puresi.webp",
    color: "#d9484f",
  },
  {
    id: "teslimat",
    no: "04",
    title: "Aynı gün kargo",
    text: "14:00'e kadar onaylanan siparişler aynı gün yola çıkar. Cam şişeler bölmeli kutularda, 81 ile 1–3 iş gününde kapınızda.",
    image: "/story/odul.webp",
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
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-caramel-600">Tarladan bardağa</p>
          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-espresso-900 sm:text-4xl lg:text-[2.75rem]">
            Dört adımda <span className="accent-italic text-caramel-600">aynı tat,</span> her siparişte.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12">
          {/* Sabit panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 aspect-[4/5] max-h-[34rem] overflow-hidden rounded-[1.75rem] bg-espresso-950 text-cream-50 shadow-lift">
              {steps.map((s, i) => (
                <Image
                  key={s.id}
                  src={assetUrl(s.image)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  aria-hidden={i !== active}
                  priority={i === 0}
                  className={cn(
                    "object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    i === active ? "scale-100 opacity-100" : "scale-110 opacity-0",
                  )}
                />
              ))}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/35 to-[#0a0806]/10" />
              <div className="absolute inset-0 flex flex-col justify-between p-7 lg:p-9">
                <div className="flex items-start justify-between">
                  <span key={current.no} className="animate-pop-in font-display text-6xl font-semibold text-cream-50/90">
                    {current.no}
                  </span>
                  <div className="flex gap-1.5">
                    {steps.map((s, i) => (
                      <span key={s.id} className={cn("h-1.5 rounded-full transition-all duration-500", i === active ? "w-8 bg-cream-50" : "w-3 bg-cream-50/40")} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-caramel-300">Adım {current.no} / 04</p>
                  <h3 key={current.id} className="mt-2 animate-pop-in font-display text-3xl font-semibold leading-tight">
                    {current.title}
                  </h3>
                </div>
              </div>
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
