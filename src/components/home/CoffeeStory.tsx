"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Kaydırmaya bağlı kahve hikâyesi. Bölüm 4 ekran yüksekliğinde; içerik yapışkan (sticky)
 * kalır ve sayfa kaydırıldıkça sahne ilerler: çiğ çekirdek → öğütüm → ekstraksiyon → fincan.
 * İlerleme, yeniden render olmadan `--p` CSS değişkeniyle sahneye aktarılır.
 */
const stages = [
  { no: "01", title: "Çiğ çekirdek", text: "Yüksek rakım Arabica çekirdekleri; kooperatiflerden, sezonunda." },
  { no: "02", title: "Taze öğütüm", text: "Sipariş sonrası kavrulur, demlemeden saniyeler önce öğütülür." },
  { no: "03", title: "Ekstraksiyon", text: "9 bar basınç, 25 saniye: yoğun, parlak ve dengeli bir shot." },
  { no: "04", title: "Fincanınızda", text: "Kalın krema, uzun bitiş. Umba Signature, kafe standardında." },
];

const beans = [
  [120, 150, -25], [210, 95, 30], [300, 160, -10], [390, 110, 45], [470, 170, -35],
  [160, 250, 15], [250, 215, -40], [340, 260, 25], [430, 230, -15], [300, 340, 40], [200, 330, -30], [410, 330, 10],
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
      el.dataset.stage = String(Math.min(3, Math.floor(p * 4)));
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

  return (
    <section ref={ref} id="hikaye" className="story relative bg-espresso-950 text-cream-50" style={{ height: "400vh" }} data-stage="0">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="container-x grid w-full grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-12">
          {/* Metin */}
          <div className="relative z-10 order-2 lg:order-1 lg:col-span-5">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-caramel-300">Çekirdekten fincana</p>
            <div className="relative mt-4 h-44 sm:h-48">
              {stages.map((s, i) => (
                <div key={s.no} className="story-caption absolute inset-0" data-i={i}>
                  <p className="font-display text-sm italic text-cream-200/60">{s.no}</p>
                  <h2 className="mt-2 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">{s.title}</h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-cream-200 sm:text-lg">{s.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex gap-1.5" aria-hidden="true">
                {stages.map((s, i) => (
                  <span key={s.no} className="story-dot h-1 w-8 rounded-full bg-cream-50/20" data-i={i} />
                ))}
              </div>
              <Button href="/kategori/kahve" size="sm" variant="light" className="story-cta group/btn">
                Kahveleri keşfet <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Sahne */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <svg viewBox="0 0 600 640" className="story-scene mx-auto h-[46vh] w-auto max-w-full lg:h-[78vh]" aria-hidden="true">
              <defs>
                <radialGradient id="st-glow" cx="50%" cy="45%" r="50%">
                  <stop offset="0" stopColor="#d9c7a3" stopOpacity="0.25" />
                  <stop offset="1" stopColor="#d9c7a3" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="st-bean" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#8a5a3a" />
                  <stop offset="1" stopColor="#3a2113" />
                </linearGradient>
                <linearGradient id="st-metal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#4a4a4a" />
                  <stop offset="0.5" stopColor="#1f1f1f" />
                  <stop offset="1" stopColor="#0f0f0f" />
                </linearGradient>
                <linearGradient id="st-stream" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#5a2a12" />
                  <stop offset="1" stopColor="#c48a3f" />
                </linearGradient>
                <linearGradient id="st-coffee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#c48a3f" />
                  <stop offset="0.18" stopColor="#5a2a12" />
                  <stop offset="1" stopColor="#2a130a" />
                </linearGradient>
                <clipPath id="st-cup-clip">
                  <path d="M190 420 h220 l-18 150 q-2 20 -22 20 h-140 q-20 0 -22 -20 z" />
                </clipPath>
              </defs>

              <circle cx="300" cy="300" r="280" fill="url(#st-glow)" />

              {/* Çekirdekler */}
              <g className="story-beans">
                {beans.map(([x, y, r], i) => (
                  <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
                    <g className="story-bean" style={{ animationDelay: `${-i * 0.7}s` }}>
                      <ellipse rx="26" ry="38" fill="url(#st-bean)" />
                      <path d="M0 -30 c-10 10 -10 20 0 30 s10 20 0 30" fill="none" stroke="#1a0d07" strokeWidth="4" strokeLinecap="round" />
                    </g>
                  </g>
                ))}
              </g>

              {/* Makine: grup başlığı */}
              <g className="story-machine">
                <rect x="140" y="20" width="320" height="120" rx="18" fill="url(#st-metal)" />
                <rect x="170" y="48" width="260" height="10" rx="5" fill="#2a2a2a" />
                <circle cx="300" cy="100" r="6" fill="#d9c7a3" className="story-led" />
                {/* Portafiltre */}
                <path d="M220 140 h160 v26 q0 14 -14 14 h-132 q-14 0 -14 -14 z" fill="#1a1a1a" />
                <rect x="380" y="146" width="90" height="12" rx="6" fill="#0f0f0f" />
                {/* Çıkış uçları */}
                <path d="M268 180 l-10 22 h16 z" fill="#2a2a2a" />
                <path d="M332 180 l10 22 h-16 z" fill="#2a2a2a" />
                {/* Öğütülmüş kahve (sepette) */}
                <g className="story-grounds">
                  {Array.from({ length: 26 }).map((_, i) => (
                    <circle key={i} cx={238 + ((i * 37) % 124)} cy={150 + ((i * 13) % 16)} r={2 + (i % 3)} fill="#4a2a16" />
                  ))}
                </g>
              </g>

              {/* Akış */}
              <g className="story-streams">
                <rect x="258" y="202" width="7" height="220" rx="3.5" fill="url(#st-stream)" />
                <rect x="335" y="202" width="7" height="220" rx="3.5" fill="url(#st-stream)" />
              </g>

              {/* Fincan */}
              <g className="story-cup">
                <path d="M190 420 h220 l-18 150 q-2 20 -22 20 h-140 q-20 0 -22 -20 z" fill="#f3efe6" />
                <path d="M410 440 q70 0 70 50 q0 50 -70 50 v-20 q45 0 45 -30 q0 -30 -45 -30 z" fill="#e7e1d4" />
                <g clipPath="url(#st-cup-clip)">
                  <rect className="story-liquid" x="170" y="420" width="260" height="180" fill="url(#st-coffee)" />
                </g>
                <ellipse cx="300" cy="420" rx="110" ry="14" fill="#faf7f1" className="story-rim" />
                <rect x="150" y="588" width="300" height="12" rx="6" fill="#1f1f1f" />
                <g className="story-steam" fill="none" stroke="#f3efe6" strokeWidth="4" strokeLinecap="round" opacity="0.5">
                  <path d="M260 380 c-14 -22 14 -34 0 -56" />
                  <path d="M300 370 c-14 -24 14 -36 0 -60" />
                  <path d="M340 380 c-14 -22 14 -34 0 -56" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
