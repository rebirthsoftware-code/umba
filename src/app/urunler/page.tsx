import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/lib/products";
import { GridSkeleton } from "@/components/product/GridSkeleton";

export const metadata: Metadata = {
  title: "Tüm Ürünler | Kahve Şurubu, Püre, Sos, Espresso, Sıcak Çikolata",
  description:
    "Kafe ve barlar için 90'dan fazla ürün: 37 aroma kahve şurubu, 18 meyve püresi, dekor soslar, espresso çekirdek kahve, sıcak çikolata, frappe ve chai tozları, bitki çayları. Kategori ve fiyata göre filtreleyin, kartla ödeyin.",
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
