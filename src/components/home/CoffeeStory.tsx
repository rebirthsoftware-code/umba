"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { assetUrl } from "@/lib/assets";

/**
 * Kaydırmaya bağlı, fotoğraflı kahve hikâyesi: çekirdek → öğütüm → ekstraksiyon → fincan.
 * Bölüm 4 ekran yüksekliğinde; görsel yapışkan kalır, kaydırdıkça kareler birbirine geçer
 * ve hafifçe yakınlaşır. İlerleme `--p` CSS değişkeniyle aktarılır; React yeniden render etmez.
 * Fotoğraflar: Unsplash lisansı (ticari kullanım serbest). Kendi çekimlerinizle değiştirmek için
 * public/story/<ad>.webp (1920×1080) ve <ad>-m.webp (900×1600) dosyalarını güncelleyin.
 */
const scenes = [
  { id: "cekirdek", no: "01", label: "Çekirdek", a: "Kaynağında", b: "seçilir.", text: "Yüksek rakım Arabica; kooperatiflerden, sezonunda. Her parti tadılır, onaylanmadan kavruma girmez." },
  { id: "ogutum", no: "02", label: "Öğütüm", a: "Demlemeden", b: "saniyeler önce.", text: "Sipariş sonrası kavrulan çekirdek, tam zamanında öğütülür. Taze gider, taze gelir." },
  { id: "ekstraksiyon", no: "03", label: "Ekstraksiyon", a: "9 bar,", b: "25 saniye.", text: "Dengeli basınç, doğru sıcaklık: yoğun, parlak ve tatlı bir shot. Her seferinde aynı." },
  { id: "odul", no: "04", label: "Ödül", a: "Fincanınızda", b: "altın.", text: "Kalın krema, uzun bitiş. Kafe standardında espresso; barınızda, otelinizde, evinizde." },
];

export function CoffeeStory() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = reduced ? 1 : Math.min(1, Math.max(0, -r.top / Math.max(1, total)));
      el.style.setProperty("--p", p.toFixed(4));
      el.dataset.stage = String(Math.min(scenes.length - 1, Math.floor(p * scenes.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (total * (i + 0.5)) / scenes.length, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="hikaye" className="story relative bg-[#0a0806] text-cream-50" style={{ height: `${scenes.length * 100}vh` }} data-stage="0">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Fotoğraf katmanları */}
        {scenes.map((s, i) => (
          <div key={s.id} className="story-photo absolute inset-0" data-i={i}>
            <Image src={assetUrl(`/story/${s.id}.webp`)} alt="" fill sizes="100vw" loading={i === 0 ? "eager" : "lazy"} quality={70} className="hidden object-cover md:block" />
            <Image src={assetUrl(`/story/${s.id}-m.webp`)} alt="" fill sizes="100vw" loading={i === 0 ? "eager" : "lazy"} quality={70} className="object-cover md:hidden" />
          </div>
        ))}
        {/* Okunabilirlik için karartma */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0a0806] via-[#0a0806]/55 to-[#0a0806]/20 lg:bg-gradient-to-r lg:from-[#0a0806] lg:via-[#0a0806]/60 lg:to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0a0806]/70 to-transparent" />

        {/* Metin */}
        <div className="container-x relative z-10 flex h-full items-end pb-16 lg:items-center lg:pb-0">
          <div className="w-full lg:max-w-xl">
            <div className="relative h-60 sm:h-64 lg:h-80">
              {scenes.map((s, i) => (
                <div key={s.no} className="story-caption absolute inset-0" data-i={i}>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.26em] text-caramel-300">
                    Bölüm {s.no} <span className="mx-2 opacity-50">—</span> {s.label}
                  </p>
                  <h2 className="mt-5 font-display text-[2.6rem] font-semibold leading-[0.98] sm:text-6xl lg:text-7xl">
                    {s.a}
                    <br />
                    <span className="story-gold">{s.b}</span>
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-cream-200/90 sm:text-lg">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-5">
              <div className="flex gap-2" role="tablist" aria-label="Hikâye bölümleri">
                {scenes.map((s, i) => (
                  <button
                    key={s.no}
                    type="button"
                    role="tab"
                    aria-label={`${s.no} ${s.label}`}
                    onClick={() => goTo(i)}
                    className="story-dot h-1.5 w-10 rounded-full bg-cream-50/25 transition-colors hover:bg-cream-50/60"
                    data-i={i}
                  />
                ))}
              </div>
              <Button href="/kategori/kahve" size="sm" variant="light" className="group/btn">
                Kahveleri keşfet <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
