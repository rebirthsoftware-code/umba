import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductRail } from "@/components/product/ProductRail";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedProducts() {
  const products = getFeaturedProducts(12);
  return (
    <section className="border-t border-espresso-900/10 py-20 sm:py-28">
      <div className="container-x">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Çok satanlar"
            title="Kafelerin her ay yeniden sipariş ettikleri."
            description="En çok tercih edilen aromalar ve kahveler. Kartın üzerine gelin, bardaktaki hâlini görün."
          />
          <Link href="/urunler?etiket=cok-satan" className="text-sm font-semibold text-espresso-900 underline underline-offset-4">
            Tümünü gör
          </Link>
        </Reveal>
        <Reveal className="mt-10" delay={120}>
          <ProductRail products={products} ariaLabel="Çok satan ürünler" />
        </Reveal>
      </div>
    </section>
  );
}
