import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/lib/products";
import { GridSkeleton } from "@/components/product/GridSkeleton";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description:
    "Umba Coffee şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri. Kategoriye, etikete ve fiyata göre filtreleyin.",
  alternates: { canonical: "/urunler" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Katalog"
        title="Tüm ürünler"
        description={`${products.length} ürün; şuruplardan kahveye, pürelerden bar tozlarına. Aradığınızı filtreleyin, sepete ekleyin.`}
        crumbs={[{ label: "Ürünler" }]}
      />
      <section className="container-x py-10 sm:py-14">
        <Suspense fallback={<GridSkeleton />}>
          <ProductGrid products={products} />
        </Suspense>
      </section>
    </>
  );
}
