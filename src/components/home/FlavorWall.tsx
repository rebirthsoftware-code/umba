import Link from "next/link";
import { getProductsByCategory } from "@/lib/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { artLabel } from "@/components/product/ProductArt";
import { Reveal } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";

export function FlavorWall() {
  const syrups = getProductsByCategory("suruplar");
  return (
    <Spotlight as="section" className="grain relative overflow-hidden bg-espresso-950 py-20 text-cream-50 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(40% 50% at 10% 10%, rgba(226,168,75,0.35) 0%, transparent 60%), radial-gradient(40% 50% at 90% 90%, rgba(217,72,79,0.25) 0%, transparent 60%)",
        }}
      />
      <div className="container-x relative grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12 lg:items-center">
        <Reveal direction="left" className="lg:col-span-5">
          <SectionHeading
            tone="light"
            eyebrow="Şurup duvarı"
            title={`${syrups.length} aroma, tek pompa uzağınızda.`}
            description="Klasiklerden sezonluklara, şekersiz seçeneklere kadar. Her şurup; sıcak, soğuk ve soda bazlı içeceklerde test edildi."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/kategori/suruplar" variant="primary">
              Şurupları incele
            </Button>
            <Button href="/urunler?etiket=sekersiz" variant="light">
              Şekersiz seçenekler
            </Button>
          </div>
        </Reveal>
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:col-span-7 lg:grid-cols-6">
          {syrups.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 35} direction="scale">
              <Link
                href={`/urun/${p.slug}`}
                className="group flex flex-col items-center gap-2 text-center"
                title={p.name}
              >
                <span
                  className="block aspect-square w-full rounded-2xl ring-1 ring-cream-50/10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, #ffffff55 0%, ${p.color} 35%, ${p.color2 ?? p.color} 100%)`,
                    boxShadow: `0 12px 24px -12px ${p.color}`,
                  }}
                />
                <span className="text-[0.7rem] font-semibold leading-tight text-cream-200 group-hover:text-cream-50">
                  {artLabel(p.name, 16).join(" ")}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </Spotlight>
  );
}
