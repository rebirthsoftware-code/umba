import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductVisual } from "@/components/product/ProductVisual";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function CategoryGrid() {
  return (
    <section className="container-x py-20 sm:py-28">
      <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Ürün grupları" title="Barınızda ne eksikse, burada." description="Yedi ürün grubu, tek tedarikçi. Menünüzü tamamlayacak her şeyi aynı siparişte alın." />
        <Link href="/urunler" className="text-sm font-semibold text-espresso-900 underline underline-offset-4">
          Tüm ürünler
        </Link>
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-espresso-900/10 bg-espresso-900/10 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => {
          const list = getProductsByCategory(c.slug);
          const sample = list[0];
          return (
            <Reveal key={c.slug} delay={i * 60} className="h-full">
              <Link href={`/kategori/${c.slug}`} className="group relative flex h-full min-h-[16rem] flex-col justify-between overflow-hidden bg-cream-50 p-6 transition-colors duration-500 hover:bg-cream-100">
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(180deg, transparent, ${c.color}1a)` }} />
                <div className="relative">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-caramel-700">{list.length} ürün</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-espresso-900">{c.name}</h3>
                  <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-espresso-600">{c.tagline}</p>
                </div>
                <div className="relative flex items-end justify-between">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-espresso-900">
                    İncele
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  {sample && <ProductVisual product={sample} className="h-28 w-auto drop-shadow-md transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:-rotate-3" />}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
