import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories, getCategory } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CategoryVisual } from "@/components/product/CategoryVisual";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { GridSkeleton } from "@/components/product/GridSkeleton";
import Link from "next/link";
import { cn } from "@/lib/format";
import { site } from "@/lib/site";
import { loadPriceOverrides } from "@/server/prices";

export const dynamicParams = false;
export const revalidate = 3600;

/** Google için kategori başlık/açıklamaları (arama niyetine uygun anahtar kelimeler). */
const categorySeo: Record<string, { title: string; description: string }> = {
  suruplar: { title: "Kahve Şurubu ve Aromalı Bar Şurupları (37 Aroma, 750 ml)", description: "Latte, soğuk kahve, soda ve kokteyller için 37 aroma kahve şurubu: karamel, vanilya, fındık, çilek, mojito, cool lime, damla sakızı ve daha fazlası. Premium kalite, 750 ml şişe." },
  soslar: { title: "Dekor Sos: Çikolata, Karamel, Beyaz Çikolata ve Meyveli Soslar", description: "Bardak süsleme ve topping için 10 aroma dekor sos: çikolata, karamel, beyaz çikolata, çilek, frambuaz, blue curaçao. Mocha, frappe, milkshake ve tatlılar için ince uçlu sıkma şişe." },
  pureler: { title: "Meyve Püresi: Smoothie, Frozen ve Limonata Bazı (1 L)", description: "18 çeşit gerçek meyveli püre: mango, çilek, karpuz, çarkıfelek, karadut, yaban mersini, kavun. Smoothie, frozen, soda ve kokteyl için 1 L pompalı şişe." },
  kahve: { title: "Espresso Çekirdek Kahve: Daily, Colombian ve Reserve (1 kg)", description: "Kafeler için espresso çekirdek kahve: dengeli Espresso Daily, %100 Arabica Colombian ve çikolata-fındık notalı Reserve. 1 kg valfli poşet, taze kavrum." },
  "sicak-cikolata": { title: "Sıcak Çikolata ve Salep Tozu (1 kg)", description: "Gerçek kakaolu sıcak çikolata tozları (Classic, Premium, Beyaz, Ümba Premium Safranbolu) ve Classic, Premium, damla sakızlı, çikolatalı, fındıklı salep tozu. Kafe ve otel kış menüsü için 1 kg kutu." },
  "bar-urunleri": { title: "Milkshake Tozu: Vanilya, Karamel, Çikolata (1 kg)", description: "Kafe barı için vanilya, karamel ve çikolata aromalı milkshake tozları. Soğuk sütle blender'da kremamsı milkshake, frappe ve smoothie bazı; 1 kg poşet." },
  "bitki-cayi": { title: "Bitki Çayı ve Meyve Çayı: Kuşburnu, Hibiskus, Ada Çayı, Nane Limon", description: "Safranbolu'da doğal kurutulmuş 9 çeşit meyve ve bitki çayı: kuşburnu, hibiskus, ada çayı, nane limon, orman meyveli, böğürtlen, ıhlamur, yeşil çay. Kilitli pencereli poşet, 100–250 g." },
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">): Promise<Metadata> {
  await loadPriceOverrides();
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const count = getProductsByCategory(category.slug).length;
  const seo = categorySeo[category.slug] ?? { title: category.name, description: category.description };
  return {
    title: seo.title,
    description: `${seo.description} ${count} ürün; kartla veya havaleyle ödeme, 1–3 iş günü teslimat.`,
    alternates: { canonical: `/kategori/${category.slug}` },
    openGraph: { title: `${seo.title} | ${site.name}`, description: seo.description, type: "website" },
  };
}

export default async function CategoryPage({ params }: PageProps<"/kategori/[slug]">) {
  await loadPriceOverrides();
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = getProductsByCategory(category.slug);
  const sample = products[0];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: site.url },
        { "@type": "ListItem", position: 2, name: "Ürünler", item: `${site.url}/urunler` },
        { "@type": "ListItem", position: 3, name: category.name, item: `${site.url}/kategori/${category.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: category.name,
      numberOfItems: products.length,
      itemListElement: products.slice(0, 50).map((p, idx) => ({ "@type": "ListItem", position: idx + 1, name: p.name, url: `${site.url}/urun/${p.slug}` })),
    },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
              <CategoryVisual category={category} sample={sample} className="relative mx-auto h-full w-auto drop-shadow-2xl" />
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
    </>
  );
}
