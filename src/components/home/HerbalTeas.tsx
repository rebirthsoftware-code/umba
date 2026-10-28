import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Sun, Snowflake, Clock } from "lucide-react";
import { getProductsByCategory } from "@/lib/products";
import { ProductRail } from "@/components/product/ProductRail";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { assetUrl } from "@/lib/assets";

const points = [
  { icon: Leaf, title: "Katkısız", text: "Doğal kurutulmuş meyve ve bitki; aroma, renklendirici yok." },
  { icon: Sun, title: "Sıcak", text: "1 tatlı kaşığı, 90 °C su, 5–7 dakika demleme." },
  { icon: Snowflake, title: "Buzlu", text: "Demleyip soğutun; buz, limon ve bir tutam şurupla." },
  { icon: Clock, title: "24 ay", text: "Kilitli, pencereli poşette aromasını korur." },
];

export function HerbalTeas() {
  const teas = getProductsByCategory("bitki-cayi");
  return (
    <section id="bitki-caylari" className="relative overflow-hidden bg-[#eef3e6] py-20 text-espresso-900 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50% 60% at 85% 20%, rgba(92,138,60,0.18) 0%, transparent 70%), radial-gradient(40% 50% at 10% 90%, rgba(201,180,138,0.25) 0%, transparent 70%)" }}
      />
      <div className="container-x relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal direction="left" className="lg:col-span-5">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#5c8a3c]/10 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#3f6b2a]">
            <Leaf className="h-3.5 w-3.5" /> Yeni kategori
          </p>
          <h2 className="mt-5 font-display text-[2.4rem] font-semibold leading-[1.02] text-balance sm:text-5xl lg:text-[3.4rem]">
            Bitki çayları: <span className="text-[#3f6b2a]">{teas.length} çeşit</span>, hepsi doğal.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-espresso-700 sm:text-lg">
            Kuşburnu, hibiskus, ada çayı, nane limon, orman meyveli, böğürtlen… Safranbolu&rsquo;da kurutulan iri kesim meyve ve bitkiler; demlik ve bardak demlemeye uygun. Kış menüsünde sıcak, yazın buzlu çay olarak.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
            {points.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cream-50 text-[#3f6b2a] shadow-card">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-espresso-600">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/kategori/bitki-cayi" size="lg" variant="primary" className="group/btn">
              Çayları incele <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
            <Button href="/kurumsal" size="lg" variant="outline">
              Kafeler için toplu fiyat
            </Button>
          </div>
        </Reveal>

        <Reveal direction="scale" delay={120} className="lg:col-span-7">
          <Link href="/kategori/bitki-cayi" className="group relative block">
            <div aria-hidden="true" className="absolute inset-x-10 bottom-6 top-16 rounded-[2rem] bg-[#3f6b2a] shadow-lift transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-1" />
            <Image
              src={assetUrl("/hero/bitki-caylari.webp")}
              alt="Umba bitki çayı koleksiyonu"
              width={1100}
              height={1144}
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="relative mx-auto h-auto w-[92%] drop-shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:scale-[1.02]"
            />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-espresso-900/10 bg-cream-50/95 px-4 py-2 text-xs font-bold shadow-card backdrop-blur sm:left-auto sm:right-8 sm:translate-x-0">
              100 g ve 250 g poşet
            </span>
          </Link>
        </Reveal>
      </div>

      <Reveal className="container-x relative mt-16" delay={160}>
        <div className="mb-5 flex items-end justify-between gap-4">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[#3f6b2a]">Tüm çeşitler</p>
          <Link href="/kategori/bitki-cayi" className="text-sm font-semibold underline underline-offset-4">
            Kategoriye git
          </Link>
        </div>
        <ProductRail products={teas} ariaLabel="Bitki çayları" />
      </Reveal>
    </section>
  );
}
