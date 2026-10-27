import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedProducts() {
  const products = getFeaturedProducts(12);
  return (
    <section className="bg-cream-100 py-16 sm:py-24">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Çok satanlar"
            title="Kafelerin her ay yeniden sipariş ettikleri."
            description="En çok tercih edilen aromalar ve kahveler. Kartın üzerine gelin, bardaktaki hâlini görün."
          />
          <Link href="/urunler?etiket=cok-satan" className="group inline-flex items-center gap-1 text-sm font-bold text-espresso-900">
            Tümünü gör
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <Reveal className="mt-10" delay={120}>
          <ProductRail products={products} ariaLabel="Çok satan ürünler" />
        </Reveal>
      </div>
    </section>
  );
}
