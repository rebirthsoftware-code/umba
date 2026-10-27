import Link from "next/link";
import { ArrowUpRight, Leaf, Package, Truck, MessageCircle, Sparkles } from "lucide-react";
import { Spotlight } from "@/components/ui/Spotlight";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products, getProductsByCategory } from "@/lib/products";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";
import { artLabel } from "@/components/product/ProductArt";

export function Bento() {
  const syrups = getProductsByCategory("suruplar");
  const chips = [...syrups, ...syrups];
  return (
    <section className="container-x py-16 sm:py-24">
      <Reveal>
        <SectionHeading
          eyebrow="Neden Umba?"
          title="Küçük bir kafeden büyük bir zincire kadar aynı standart."
          description="Üretimden teslimata her adımı kendimiz yönetiyoruz; böylece her siparişte aynı tadı ve aynı kıvamı alırsınız."
        />
      </Reveal>

      <div className="mt-10 grid auto-rows-[minmax(10rem,auto)] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Büyük koyu kart: sayılar */}
        <Reveal className="sm:col-span-2 lg:row-span-2" direction="scale">
          <Spotlight className="grain relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-espresso-950 p-7 text-cream-50 shadow-lift lg:p-9">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-caramel-500/25 blur-3xl" />
            <div className="relative">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-caramel-300">Kendi üretimimiz</p>
              <h3 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Aracı yok. <span className="accent-italic text-caramel-300">Reçete bizde,</span> fiyat kontrolü bizde.
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-cream-200/85">
                Şurup, sos, püre ve tozlar kendi tesisimizde dolduruluyor; kahveler sipariş sonrası küçük partiler hâlinde kavruluyor.
              </p>
            </div>
            <dl className="relative mt-8 grid grid-cols-3 gap-4 border-t border-cream-50/10 pt-6">
              {[
                { to: products.length, suffix: "+", label: "ürün" },
                { to: categories.length, suffix: "", label: "ürün grubu" },
                { to: 81, suffix: "", label: "ile teslimat" },
              ].map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wider text-cream-200/70">{s.label}</dt>
                  <dd className="mt-1 font-display text-4xl font-semibold text-caramel-300">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Spotlight>
        </Reveal>

        {/* Aroma şeridi */}
        <Reveal className="sm:col-span-2" delay={80}>
          <Link href="/kategori/suruplar" className="group flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-espresso-900/5 bg-cream-100 p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-caramel-700">{syrups.length} aroma</p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-espresso-900">Şurup duvarı</h3>
              </div>
              <ArrowUpRight className="h-5 w-5 text-espresso-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <div className="-mx-6 mt-4 overflow-hidden">
              <div className="flex w-max animate-marquee gap-3 px-6 group-hover:[animation-play-state:paused]">
                {chips.map((p, i) => (
                  <span key={`${p.slug}-${i}`} className="flex items-center gap-2 rounded-full bg-cream-50 py-1.5 pl-1.5 pr-3 text-xs font-semibold text-espresso-800 ring-1 ring-espresso-900/5">
                    <span className="h-5 w-5 rounded-full" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color2 ?? p.color})` }} />
                    {artLabel(p.name, 18).join(" ")}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Şekersiz */}
        <Reveal delay={140}>
          <Link href="/urunler?etiket=sekersiz" className="group flex h-full flex-col justify-between rounded-[2rem] border border-espresso-900/5 bg-leaf-100 p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
            <Leaf className="h-7 w-7 text-leaf-500 transition-transform duration-500 group-hover:rotate-12" />
            <div>
              <h3 className="font-display text-xl font-semibold text-espresso-900">Şekersiz seçenekler</h3>
              <p className="mt-1 text-sm text-espresso-700">Fit menüler için aynı tat, sıfır ilave şeker.</p>
            </div>
          </Link>
        </Reveal>

        {/* HoReCa */}
        <Reveal delay={200}>
          <Link href="/kurumsal" className="group flex h-full flex-col justify-between rounded-[2rem] border border-espresso-900/5 bg-caramel-500/15 p-6 transition-all hover:-translate-y-1 hover:shadow-lift">
            <Package className="h-7 w-7 text-caramel-700 transition-transform duration-500 group-hover:-rotate-6" />
            <div>
              <h3 className="font-display text-xl font-semibold text-espresso-900">3 kg HoReCa boyları</h3>
              <p className="mt-1 text-sm text-espresso-700">Yoğun barlar için ekonomik ambalaj ve kademeli fiyat.</p>
            </div>
          </Link>
        </Reveal>

        {/* Barista desteği */}
        <Reveal className="sm:col-span-2" delay={260}>
          <a
            href={`https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent("Merhaba, menü ve dozaj konusunda barista desteği almak istiyorum.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full items-center gap-5 rounded-[2rem] border border-espresso-900/5 bg-cream-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-cream-50">
              <MessageCircle className="h-7 w-7" />
              <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-cream-50 bg-leaf-500" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-caramel-700">Barista desteği</p>
              <h3 className="mt-1 font-display text-xl font-semibold text-espresso-900">Menü, dozaj, personel eğitimi: bir mesaj uzağınızda.</h3>
              <p className="mt-1 text-sm text-espresso-700">{site.contact.workingHours} · genellikle dakikalar içinde yanıt.</p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-espresso-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        {/* Teslimat */}
        <Reveal className="sm:col-span-2" delay={320}>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-espresso-900/5 bg-cream-100 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-caramel-700">Teslimat</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-espresso-900">14:00&apos;e kadar sipariş, aynı gün kargo.</h3>
              </div>
              <Sparkles className="h-5 w-5 text-caramel-600" />
            </div>
            <div className="mt-5">
              <div className="relative h-px bg-espresso-900/15">
                <span className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-espresso-900" />
                <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-espresso-900/40" />
                <span className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-caramel-500" />
                <span className="absolute top-1/2 -translate-y-1/2 animate-marquee-truck">
                  <Truck className="h-6 w-6 -translate-y-3 text-espresso-900" />
                </span>
              </div>
              <div className="mt-3 flex justify-between text-[0.7rem] font-semibold uppercase tracking-wider text-espresso-600">
                <span>Umba deposu</span>
                <span>Kargo</span>
                <span>{site.commerce.deliveryEstimate}</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
