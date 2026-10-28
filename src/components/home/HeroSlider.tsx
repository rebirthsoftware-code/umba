"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type PointerEvent, type KeyboardEvent } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { getProduct, products } from "@/lib/products";
import { site } from "@/lib/site";
import { cn, formatPrice } from "@/lib/format";
import { HeroStage, type StageTheme } from "./HeroStage";

const DURATION = 6500;

interface Slide {
  id: string;
  tab: string;
  eyebrow: string;
  title: { before?: string; highlight: string; after?: string };
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  products: string[];
  image?: { src: string; alt: string; fit?: "contain" | "cover" };
  badge?: { label: string; product: string };
  caption: string;
  tone: "dark" | "light";
  bg: string;
  stage: StageTheme;
  accent: string;
}

const slides: Slide[] = [
  {
    id: "umba",
    tab: "Umba",
    eyebrow: "Kafeler, oteller ve evler için",
    title: { before: "Barınızın", highlight: "lezzet", after: "ortağı." },
    text: `Şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri; tek adresten, kafe standardında. Türkiye'nin her yerine ${site.commerce.deliveryEstimate} içinde teslim.`,
    primary: { label: "Ürünleri keşfet", href: "/urunler" },
    secondary: { label: "Kurumsal fiyat al", href: "/kurumsal" },
    products: [],
    image: { src: "/hero/kahve.webp", alt: "Umba espresso koleksiyonu: Daily, Colombian, Reserve" },
    badge: { label: "Yeni", product: "espresso-reserve" },
    caption: "Umba Coffee · 2026 koleksiyonu",
    tone: "dark",
    bg: "#f6f0e6",
    stage: { panel: "#141414", glow: "rgba(217,199,163,0.35)" },
    accent: "#c9b48a",
  },
  {
    id: "suruplar",
    tab: "Şuruplar",
    eyebrow: "37 aroma · 750 ml",
    title: { highlight: "37 aroma,", after: "tek pompa uzağınızda." },
    text: "Çilekten damla sakızına, tuzlu karamelden mojitoya. Sıcak, soğuk ve soda bazlı içeceklerde çökmeden karışan, premium kalite şuruplar.",
    primary: { label: "Şurupları incele", href: "/kategori/suruplar" },
    secondary: { label: "Kahvenin yolculuğu", href: "/#hikaye" },
    products: [],
    image: { src: "/hero/suruplar.webp", alt: "Umba şurup koleksiyonu" },
    badge: { label: "Yeni", product: "damla-sakizi-surubu" },
    caption: "Şurup koleksiyonu · 37 aroma",
    tone: "dark",
    bg: "#ffffff",
    stage: { panel: "#f2b11c", glow: "rgba(255,255,255,0.5)", captionColor: "rgba(17,17,17,0.7)" },
    accent: "#d99a0b",
  },
  {
    id: "pureler",
    tab: "Püreler",
    eyebrow: "18 çeşit · 1 L pompalı şişe",
    title: { highlight: "Gerçek meyveyle", after: "frozen & smoothie sezonu." },
    text: "Mango, çilek, karpuz, çarkıfelek, karadut… Dondurulmuş meyve stoklamadan, her bardakta aynı renk ve aynı tat. Smoothie, frozen ve limonata bazı.",
    primary: { label: "Püreleri incele", href: "/kategori/pureler" },
    secondary: { label: "Kahvenin yolculuğu", href: "/#hikaye" },
    products: [],
    image: { src: "/hero/pureler.webp", alt: "Umba meyve püresi koleksiyonu" },
    badge: { label: "Çok satan", product: "mango-puresi" },
    caption: "Meyve püreleri · 18 çeşit",
    tone: "dark",
    bg: "#fbe9e3",
    stage: { panel: "#d9484f", glow: "rgba(255,255,255,0.35)" },
    accent: "#d9484f",
  },
  {
    id: "sicak-cikolata",
    tab: "Sıcak Çikolata",
    eyebrow: "Kış menüsü · gerçek kakao",
    title: { before: "Kış menünüzün yıldızı:", highlight: "sıcak çikolata." },
    text: "Kıvamlı, parlak, gerçek kakaolu. Klasik, bitter, beyaz, fındıklı ve karamelli seçenekler; yanında chai latte ve salep ile kış barınız hazır.",
    primary: { label: "Sıcak çikolataları gör", href: "/kategori/sicak-cikolata" },
    secondary: { label: "Bar ürünleri", href: "/kategori/bar-urunleri" },
    products: ["klasik-sicak-cikolata", "findikli-sicak-cikolata", "beyaz-sicak-cikolata", "chai-latte-tozu"],
    badge: { label: "Sezon favorisi", product: "klasik-sicak-cikolata" },
    caption: "Kış koleksiyonu · 2026",
    tone: "light",
    bg: "#0a0a0a",
    stage: { panel: "#2e2e2e", glow: "rgba(217,199,163,0.35)" },
    accent: "#d9c7a3",
  },
  {
    id: "bitki-cayi",
    tab: "Bitki Çayları",
    eyebrow: "Yeni · Ümba Premium Safranbolu",
    title: { before: "Doğal kurutulmuş", highlight: "meyve ve bitki çayları." },
    text: "Kuşburnu, hibiskus, ada çayı, nane limon, orman meyveli, böğürtlen, elma ve yeşil çay. Katkısız, iri kesim; pencereli kilitli poşette taze kalır.",
    primary: { label: "Bitki çaylarını gör", href: "/kategori/bitki-cayi" },
    secondary: { label: "Böğürtlen çayı", href: "/urun/bogurtlen-cayi" },
    products: [],
    image: { src: "/hero/bitki-caylari.webp", alt: "Ümba Premium meyve ve bitki çayı koleksiyonu" },
    badge: { label: "Yeni", product: "bogurtlen-cayi" },
    caption: "Meyve ve bitki çayları · 9 çeşit",
    tone: "dark",
    bg: "#e6efdc",
    stage: { panel: "#3f6b2a", glow: "rgba(255,255,255,0.35)" },
    accent: "#5c8a3c",
  },
];

const noop = () => () => {};
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
void noop;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const reduced = useReducedMotion();
  const paused = hovering || userPaused || reduced;
  const startX = useRef<number | null>(null);
  const n = slides.length;

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % n), DURATION);
    return () => window.clearTimeout(t);
  }, [index, paused, n]);

  const onPointerDown = (e: PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Öne çıkanlar"
      className="relative overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (startX.current = null)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{ touchAction: "pan-y" }}
    >
      {/* Slaytlar (aynı grid hücresinde üst üste) */}
      <div className="grid">
        {slides.map((s, i) => {
          const active = i === index;
          const light = s.tone === "light";
          const items = s.products.map((slug) => getProduct(slug)!).filter(Boolean);
          const badgeProduct = s.badge ? getProduct(s.badge.product) : undefined;
          const stagger = (k: number) => ({ transitionDelay: active ? `${140 + k * 90}ms` : "0ms" });
          const reveal = cn(
            "transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            active ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          );
          return (
            <div
              key={s.id}
              aria-hidden={!active}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}: ${s.tab}`}
              className={cn(
                "relative [grid-area:1/1] transition-[opacity,visibility] duration-700",
                active ? "visible z-10 opacity-100" : "invisible z-0 opacity-0",
              )}
              style={{ background: s.bg }}
            >

              <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-12 lg:grid-cols-12 lg:py-20">
                <div className="lg:col-span-6">
                  <p
                    className={cn(
                      reveal,
                      "inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.22em]",
                      light ? "text-caramel-300" : "text-caramel-700",
                    )}
                    style={stagger(0)}
                  >
                    <Sparkles className="h-3.5 w-3.5" style={{ color: s.accent }} />
                    {s.eyebrow}
                  </p>
                  <h1
                    className={cn(
                      reveal,
                      "mt-6 font-display text-[2.75rem] font-semibold leading-[1.0] text-balance sm:text-6xl lg:text-[4.75rem]",
                      light ? "text-cream-50" : "text-espresso-900",
                    )}
                    style={stagger(1)}
                  >
                    {s.title.before && (
                      <>
                        {s.title.before}
                        <br />
                      </>
                    )}
                    <span className="relative inline-block" style={{ color: s.accent }}>
                      {s.title.highlight}
                      <svg aria-hidden="true" viewBox="0 0 200 14" className="absolute -bottom-1 left-0 h-3 w-full" preserveAspectRatio="none" style={{ color: s.accent, opacity: 0.6 }}>
                        <path
                          d="M2 10 C 50 2, 150 2, 198 10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 220,
                            strokeDashoffset: active ? 0 : 220,
                            transition: "stroke-dashoffset 1s ease 600ms",
                          }}
                        />
                      </svg>
                    </span>
                    {s.title.after && <> {s.title.after}</>}
                  </h1>
                  <p
                    className={cn(reveal, "mt-6 max-w-xl text-lg leading-relaxed text-pretty", light ? "text-cream-200" : "text-espresso-700")}
                    style={stagger(2)}
                  >
                    {s.text}
                  </p>
                  <div className={cn(reveal, "mt-8 flex flex-wrap items-center gap-3")} style={stagger(3)}>
                    <Magnetic>
                      <Button href={s.primary.href} size="lg" variant={light ? "accent" : "primary"} className="group/btn">
                        {s.primary.label} <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Magnetic>
                    {s.secondary && (
                      <Button href={s.secondary.href} size="lg" variant={light ? "light" : "outline"}>
                        {s.secondary.label}
                      </Button>
                    )}
                  </div>
                  {i === 0 && (
                    <dl className={cn(reveal, "mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-espresso-900/10 pt-6")} style={stagger(4)}>
                      {[
                        { k: `${products.length}+`, v: "Ürün" },
                        { k: "81 il", v: "Teslimat" },
                        { k: `${formatPrice(site.commerce.freeShippingThreshold).replace(",00", "")}+`, v: "Kargo bedava" },
                      ].map((st) => (
                        <div key={st.v}>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">{st.v}</dt>
                          <dd className="mt-1 font-display text-2xl font-semibold text-espresso-900">{st.k}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
                <div className="lg:col-span-6">
                  <HeroStage
                    products={items}
                    image={s.image}
                    theme={s.stage}
                    caption={s.caption}
                    badge={badgeProduct && s.badge ? { label: s.badge.label, product: badgeProduct } : undefined}
                    active={active}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kontroller */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
        <div className="container-x flex items-end justify-between gap-4 pb-4">
          <div className="pointer-events-auto flex flex-1 gap-2 overflow-x-auto scrollbar-none sm:max-w-xl" role="tablist" aria-label="Slaytlar">
            {slides.map((s, i) => {
              const active = i === index;
              const light = slides[index].tone === "light";
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`${i + 1}. slayt: ${s.tab}`}
                  onClick={() => go(i)}
                  className={cn(
                    "group/tab flex min-w-[6rem] flex-1 flex-col gap-1.5 rounded-xl px-2 py-1.5 text-left text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors",
                    light ? "text-cream-200/70 hover:text-cream-50" : "text-espresso-600 hover:text-espresso-900",
                    active && (light ? "text-cream-50" : "text-espresso-900"),
                  )}
                >
                  <span className="truncate">{s.tab}</span>
                  <span className={cn("block h-1 w-full overflow-hidden rounded-full", light ? "bg-cream-50/20" : "bg-espresso-900/10")}>
                    {active ? (
                      <span
                        key={`${index}-${paused}`}
                        className="slide-progress block h-full w-full rounded-full"
                        data-paused={paused}
                        style={{ background: slides[index].accent, "--duration": `${DURATION}ms` } as React.CSSProperties}
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUserPaused((p) => !p)}
              aria-label={userPaused ? "Otomatik oynatmayı başlat" : "Otomatik oynatmayı durdur"}
              className={cn(
                "hidden h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition-colors sm:inline-flex",
                slides[index].tone === "light" ? "border-cream-50/20 text-cream-50 hover:bg-cream-50/10" : "border-espresso-900/15 text-espresso-900 hover:bg-cream-50",
              )}
            >
              {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label="Önceki slayt"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition-colors",
                slides[index].tone === "light" ? "border-cream-50/20 text-cream-50 hover:bg-cream-50/10" : "border-espresso-900/15 text-espresso-900 hover:bg-cream-50",
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Sonraki slayt"
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition-colors",
                slides[index].tone === "light" ? "border-cream-50/20 text-cream-50 hover:bg-cream-50/10" : "border-espresso-900/15 text-espresso-900 hover:bg-cream-50",
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {index + 1}. slayt: {slides[index].tab}
      </p>
    </section>
  );
}
