import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories, getCategory } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductArt } from "@/components/product/ProductArt";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridSkeleton } from "@/components/product/GridSkeleton";
import Link from "next/link";
import { cn } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/kategori/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/kategori/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = getProductsByCategory(category.slug);
  const sample = products[0];

  return (
    <>
      <section
        className="relative overflow-hidden border-b border-espresso-900/5"
        style={{ background: `linear-gradient(135deg, ${category.colorSoft} 0%, #fdfaf5 60%)` }}
      >
        <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-8 py-10 sm:py-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Breadcrumbs items={[{ label: "Ürünler", href: "/urunler" }, { label: category.name }]} />
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em]" style={{ color: category.color }}>
              {products.length} ürün
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-espresso-900 sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-espresso-700">{category.description}</p>
            <nav aria-label="Kategoriler" className="scrollbar-none mt-6 flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/kategori/${c.slug}`}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    c.slug === category.slug
                      ? "border-espresso-900 bg-espresso-900 text-cream-50"
                      : "border-espresso-900/15 bg-cream-50/70 text-espresso-800 hover:border-espresso-900",
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
          {sample && (
            <div className="relative hidden h-56 lg:col-span-4 lg:block">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                style={{ background: category.color }}
              />
              <ProductArt product={sample} className="relative mx-auto h-full w-auto drop-shadow-2xl" />
            </div>
          )}
        </div>
      </section>
      <section className="container-x py-10 sm:py-14">
        <Suspense fallback={<GridSkeleton />}>
          <ProductGrid products={products} lockedCategory={category.slug} />
        </Suspense>
      </section>
    </>
  );
}
