import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedProducts() {
  const products = getFeaturedProducts(8);
  return (
    <section className="bg-cream-100 py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Çok satanlar"
            title="Kafelerin her ay yeniden sipariş ettikleri."
            description="En çok tercih edilen aromalar ve kahveler. Menünüze hızlı bir başlangıç için ideal."
          />
          <Link href="/urunler?etiket=cok-satan" className="group inline-flex items-center gap-1 text-sm font-bold text-espresso-900">
            Tümünü gör
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 80} className="h-full">
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
