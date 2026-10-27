import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductArt } from "@/components/product/ProductArt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function CategoryGrid() {
  return (
    <section className="container-x py-16 sm:py-24">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Ürün grupları"
          title="Barınızda ne eksikse, burada."
          description="Altı ürün grubu, tek tedarikçi. Menünüzü tamamlayacak her şeyi aynı siparişte alın."
        />
        <Link href="/urunler" className="group inline-flex items-center gap-1 text-sm font-bold text-espresso-900">
          Tüm ürünler
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => {
          const sample = getProductsByCategory(c.slug)[0];
          const count = getProductsByCategory(c.slug).length;
          return (
            <Reveal key={c.slug} delay={i * 70} className="h-full">
            <Link
              href={`/kategori/${c.slug}`}
              className="group relative flex h-full min-h-[15rem] overflow-hidden rounded-[2rem] border border-espresso-900/5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              style={{
                background: `linear-gradient(135deg, ${c.colorSoft} 0%, #fdfaf5 70%)`,
              }}
            >
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.2em]" style={{ color: c.color }}>
                    {count} ürün
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-espresso-900">{c.name}</h3>
                  <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-espresso-700">{c.tagline}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-espresso-900">
                  İncele
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
              <div className="relative w-[38%] shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-1/3 rounded-full opacity-40 blur-2xl"
                  style={{ background: c.color }}
                />
                {sample && (
                  <ProductArt
                    product={sample}
                    className="absolute bottom-3 right-3 h-[88%] w-auto drop-shadow-xl transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105"
                  />
                )}
              </div>
            </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
