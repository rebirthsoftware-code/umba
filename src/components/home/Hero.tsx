import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { getProduct, products } from "@/lib/products";
import { site } from "@/lib/site";
import { HeroStage } from "./HeroStage";

export function Hero() {
  const a = getProduct("karamel-surubu")!;
  const b = getProduct("cilek-puresi")!;
  const c = getProduct("klasik-sicak-cikolata")!;
  const d = getProduct("umba-signature-espresso")!;

  return (
    <section className="relative overflow-hidden bg-grain">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-caramel-400/20 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-berry-500/10 blur-3xl" />
      <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <Reveal>
            <Pill>
              <Sparkles className="h-3.5 w-3.5 text-caramel-600" />
              Kafeler, oteller ve evler için
            </Pill>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-espresso-900 text-balance sm:text-6xl lg:text-7xl">
              Barınızın
              <br />
              <span className="relative inline-block text-caramel-600">
                lezzet
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 14"
                  className="absolute -bottom-1 left-0 h-3 w-full text-caramel-400"
                  preserveAspectRatio="none"
                >
                  <path d="M2 10 C 50 2, 150 2, 198 10" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              ortağı.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-espresso-700 text-pretty">
              Şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri; tek adresten, kafe standardında. Türkiye&apos;nin her
              yerine {site.commerce.deliveryEstimate} içinde teslim.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/urunler" size="lg" className="group">
                Ürünleri keşfet <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button href="/kurumsal" size="lg" variant="outline">
                Kurumsal fiyat al
              </Button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-espresso-900/10 pt-6">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Ürün</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-espresso-900">
                  <CountUp to={products.length} suffix="+" />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Teslimat</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-espresso-900">
                  <CountUp to={81} suffix=" il" />
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Kargo bedava</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-espresso-900">
                  <CountUp to={site.commerce.freeShippingThreshold} prefix="₺" suffix="+" />
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal direction="scale" delay={120} className="relative lg:col-span-6">
          <HeroStage featured={a} others={[b, c, d]} />
        </Reveal>
      </div>
    </section>
  );
}
