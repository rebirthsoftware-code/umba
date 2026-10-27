import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Badge";
import { ProductArt } from "@/components/product/ProductArt";
import { getProduct } from "@/lib/products";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export function Hero() {
  const a = getProduct("karamel-surubu")!;
  const b = getProduct("cilek-puresi")!;
  const c = getProduct("klasik-sicak-cikolata")!;
  const d = getProduct("umba-signature-espresso")!;

  return (
    <section className="relative overflow-hidden bg-grain">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-caramel-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-32 h-[26rem] w-[26rem] rounded-full bg-berry-500/10 blur-3xl"
      />
      <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-12 lg:py-24">
        <div className="animate-fade-up lg:col-span-6">
          <Pill>
            <Sparkles className="h-3.5 w-3.5 text-caramel-600" />
            Kafeler, oteller ve evler için
          </Pill>
          <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-espresso-900 text-balance sm:text-6xl lg:text-7xl">
            Barınızın
            <br />
            <span className="text-caramel-600">lezzet</span> ortağı.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-espresso-700 text-pretty">
            Şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri; tek adresten, kafe standardında.
            Türkiye&apos;nin her yerine {site.commerce.deliveryEstimate} içinde teslim.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/urunler" size="lg">
              Ürünleri keşfet <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/kurumsal" size="lg" variant="outline">
              Kurumsal fiyat al
            </Button>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-espresso-900/10 pt-6">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Ürün</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-espresso-900">50+</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Teslimat</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-espresso-900">81 il</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Kargo bedava</dt>
              <dd className="mt-1 font-display text-2xl font-semibold text-espresso-900">
                {formatPrice(site.commerce.freeShippingThreshold).replace(",00", "")}+
              </dd>
            </div>
          </dl>
        </div>

        {/* Ürün sahnesi */}
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-6 top-10 rounded-[3rem] bg-gradient-to-br from-espresso-900 via-espresso-800 to-espresso-950 shadow-lift"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-8 bottom-6 top-10 rounded-[3rem] opacity-60"
              style={{
                background:
                  "radial-gradient(60% 50% at 70% 20%, rgba(226,168,75,0.35) 0%, transparent 60%), radial-gradient(50% 40% at 20% 90%, rgba(217,72,79,0.25) 0%, transparent 60%)",
              }}
            />
            <p className="absolute left-14 top-16 font-display text-sm italic text-cream-200/70">Umba Coffee · 2026 koleksiyonu</p>

            <div className="absolute bottom-10 left-[6%] w-[30%] animate-float" style={{ animationDelay: "0s" }}>
              <ProductArt product={b} className="w-full drop-shadow-2xl" />
            </div>
            <div className="absolute bottom-16 left-[30%] z-10 w-[34%] animate-float" style={{ animationDelay: "-2s" }}>
              <ProductArt product={a} className="w-full drop-shadow-2xl" />
            </div>
            <div className="absolute bottom-12 left-[56%] w-[30%] animate-float" style={{ animationDelay: "-4s" }}>
              <ProductArt product={c} className="w-full drop-shadow-2xl" />
            </div>
            <div className="absolute bottom-8 right-[2%] hidden w-[22%] animate-float sm:block" style={{ animationDelay: "-1s" }}>
              <ProductArt product={d} className="w-full drop-shadow-2xl" />
            </div>

            <div className="absolute -bottom-2 right-4 rounded-2xl border border-espresso-900/10 bg-cream-50/95 px-4 py-3 shadow-card backdrop-blur sm:right-10">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-caramel-700">Çok satan</p>
              <p className="mt-0.5 text-sm font-bold text-espresso-900">{a.name}</p>
              <p className="text-xs text-espresso-600">{formatPrice(a.variants[0].price)} · {a.variants[0].label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
