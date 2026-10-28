"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Kaydırmaya bağlı üç sahnelik kahve hikâyesi: Damla → Ekstraksiyon → Ödül.
 * Bölüm 3 ekran yüksekliğinde; içerik yapışkan kalır, kaydırdıkça sahne ilerler.
 * İlerleme yeniden render olmadan `--p` CSS değişkeniyle sahneye aktarılır.
 */
const scenes = [
  { no: "01", label: "Damla", a: "Her damlada", b: "altın.", text: "Yoğun krema, parlak yüzey. Umba Signature harmanı her shot'ta aynı renk, aynı tat." },
  { no: "02", label: "Ekstraksiyon", a: "Taze öğütüm,", b: "9 bar.", text: "Sipariş sonrası kavrulan çekirdek, demlemeden saniyeler önce öğütülür. 25 saniyede dengeli ekstraksiyon." },
  { no: "03", label: "Ödül", a: "Fincanınızda", b: "ödül.", text: "Kalın krema, uzun bitiş. Kafe standardında espresso; barınızda, otelinizde, evinizde." },
];

/* Çekirdek girdabı: spiral üzerinde parçacıklar */
const swirl = Array.from({ length: 70 }, (_, i) => {
  const t = i * 0.42;
  const r = 60 + i * 2.9;
  return { x: 300 + r * Math.cos(t), y: 300 + r * Math.sin(t) * 0.7, s: 4 + (i % 5), rot: (i * 37) % 180 };
});

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
      el.dataset.stage = String(Math.min(2, Math.floor(p * 3)));
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
    window.scrollTo({ top: top + (total * (i + 0.5)) / 3, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="hikaye" className="story relative bg-[#0a0806] text-cream-50" style={{ height: "300vh" }} data-stage="0">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Işık ve filigran */}
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 60% 45%, rgba(201,150,70,0.22) 0%, rgba(10,8,6,0) 70%)" }} />
        <p aria-hidden="true" className="story-mark pointer-events-none absolute left-1/2 top-[8%] -translate-x-1/2 select-none font-display text-[26vw] font-semibold leading-none tracking-tight text-cream-50/[0.045] lg:text-[18vw]">
          UMBA
        </p>

        {/* Sahneler */}
        <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[6vw]">
          <svg viewBox="0 0 600 600" className="story-scene h-[52vh] w-auto max-w-[92vw] lg:h-[82vh]" aria-hidden="true">
            <defs>
              <linearGradient id="st-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f3d7a0" />
                <stop offset="0.45" stopColor="#c9893a" />
                <stop offset="1" stopColor="#5a2a10" />
              </linearGradient>
              <radialGradient id="st-crema" cx="50%" cy="40%" r="60%">
                <stop offset="0" stopColor="#e9c58a" />
                <stop offset="0.5" stopColor="#b57a3a" />
                <stop offset="1" stopColor="#3a1a0a" />
              </radialGradient>
              <linearGradient id="st-steel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f2f2f2" />
                <stop offset="0.4" stopColor="#8d8d8d" />
                <stop offset="0.6" stopColor="#d6d6d6" />
                <stop offset="1" stopColor="#4a4a4a" />
              </linearGradient>
              <linearGradient id="st-cupb" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3a3a3a" />
                <stop offset="0.5" stopColor="#111" />
                <stop offset="1" stopColor="#2a2a2a" />
              </linearGradient>
              <linearGradient id="st-stream" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#6a2e10" />
                <stop offset="1" stopColor="#d9a05a" />
              </linearGradient>
              <radialGradient id="st-hl" cx="35%" cy="30%" r="50%">
                <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <clipPath id="st-cupclip">
                <path d="M190 330 h220 v150 q0 60 -60 60 h-100 q-60 0 -60 -60 z" />
              </clipPath>
            </defs>

            {/* 01 · Damla */}
            <g className="story-sc story-sc1">
              <g className="story-crema">
                <ellipse cx="300" cy="440" rx="230" ry="80" fill="url(#st-crema)" />
                <ellipse cx="300" cy="440" rx="160" ry="54" fill="none" stroke="#f0cf96" strokeOpacity="0.35" strokeWidth="3" />
                <ellipse cx="300" cy="440" rx="95" ry="32" fill="none" stroke="#f0cf96" strokeOpacity="0.5" strokeWidth="3" />
                <ellipse className="story-ripple" cx="300" cy="440" rx="40" ry="14" fill="none" stroke="#fff4dc" strokeOpacity="0.8" strokeWidth="3" />
              </g>
              <g className="story-drop">
                <path d="M300 60 c-40 90 -95 150 -95 220 a95 95 0 0 0 190 0 c0 -70 -55 -130 -95 -220z" fill="url(#st-gold)" />
                <path d="M300 60 c-40 90 -95 150 -95 220 a95 95 0 0 0 190 0 c0 -70 -55 -130 -95 -220z" fill="url(#st-hl)" />
                <path d="M252 220 c-10 20 -12 45 -4 70" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="14" strokeLinecap="round" />
              </g>
            </g>

            {/* 02 · Ekstraksiyon */}
            <g className="story-sc story-sc2">
              <g className="story-swirl">
                {swirl.map((b, i) => (
                  <ellipse key={i} cx={b.x} cy={b.y} rx={b.s} ry={b.s * 1.5} fill={i % 3 ? "#b8762e" : "#e3b872"} style={{ transform: `rotate(${b.rot}deg)` }} />
                ))}
              </g>
              <g className="story-pf">
                <rect x="330" y="300" width="190" height="34" rx="17" fill="#141414" />
                <rect x="470" y="296" width="60" height="42" rx="14" fill="#0a0a0a" />
                <path d="M200 260 h190 a24 24 0 0 1 24 24 v36 a24 24 0 0 1 -24 24 h-190 a24 24 0 0 1 -24 -24 v-36 a24 24 0 0 1 24 -24z" fill="url(#st-steel)" />
                <ellipse cx="295" cy="262" rx="110" ry="18" fill="#2a1a10" />
                <ellipse className="story-basket" cx="295" cy="262" rx="100" ry="14" fill="#5a3a22" />
                <path d="M270 344 l-10 22 h18z M320 344 l10 22 h-18z" fill="#3a3a3a" />
              </g>
            </g>

            {/* 03 · Ödül */}
            <g className="story-sc story-sc3">
              <g className="story-head">
                <rect x="190" y="40" width="220" height="70" rx="20" fill="#1c1c1c" />
                <path d="M225 110 h150 a16 16 0 0 1 16 16 v20 a16 16 0 0 1 -16 16 h-150 a16 16 0 0 1 -16 -16 v-20 a16 16 0 0 1 16 -16z" fill="url(#st-steel)" />
                <path d="M275 162 l-8 22 h16z M325 162 l8 22 h-16z" fill="#3a3a3a" />
              </g>
              <g className="story-pour">
                <rect x="264" y="184" width="6" height="150" rx="3" fill="url(#st-stream)" />
                <rect x="330" y="184" width="6" height="150" rx="3" fill="url(#st-stream)" />
              </g>
              <g className="story-cup3">
                <path d="M190 330 h220 v150 q0 60 -60 60 h-100 q-60 0 -60 -60 z" fill="url(#st-cupb)" />
                <path d="M410 360 q80 0 80 55 q0 55 -80 55 v-24 q52 0 52 -31 q0 -31 -52 -31z" fill="#1a1a1a" />
                <g clipPath="url(#st-cupclip)">
                  <rect className="story-fill" x="170" y="330" width="260" height="210" fill="#3a1a0a" />
                </g>
                <ellipse className="story-cremaTop" cx="300" cy="332" rx="110" ry="22" fill="url(#st-crema)" />
                <ellipse cx="300" cy="332" rx="110" ry="22" fill="none" stroke="#2a2a2a" strokeWidth="6" />
                <ellipse cx="300" cy="548" rx="150" ry="14" fill="#000" fillOpacity="0.5" />
              </g>
            </g>
          </svg>
        </div>

        {/* Metin */}
        <div className="container-x relative z-10 flex h-full items-end pb-16 lg:items-center lg:pb-0">
          <div className="story-text relative w-full lg:max-w-xl">
            <div className="absolute inset-x-[-1.5rem] inset-y-[-2rem] -z-10 rounded-[2rem] bg-[#0a0806]/70 backdrop-blur-sm lg:hidden" />
            <div className="relative h-56 sm:h-64 lg:h-80">
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
                  <p className="mt-5 max-w-md text-base leading-relaxed text-cream-200/85 sm:text-lg">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-5">
              <div className="flex gap-2" role="tablist" aria-label="Hikâye bölümleri">
                {scenes.map((s, i) => (
                  <button
                    key={s.no}
                    type="button"
                    role="tab"
                    aria-label={`${s.no} ${s.label}`}
                    onClick={() => goTo(i)}
                    className="story-dot h-1.5 w-10 rounded-full bg-cream-50/20 transition-colors hover:bg-cream-50/50"
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
