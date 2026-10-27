import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Droplets, Package, ArrowUpRight, RotateCcw, Plus } from "lucide-react";
import { products, getProduct, getRelatedProducts, getBundlePartner } from "@/lib/products";
import { categoryMap } from "@/lib/categories";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TagBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductRail } from "@/components/product/ProductRail";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { Bundle } from "@/components/product/Bundle";
import { RecentlyViewed, TrackView } from "@/components/product/RecentlyViewed";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/urun/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.short} ${product.description}`.slice(0, 160),
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: { title: `${product.name} | ${site.name}`, description: product.short, type: "website" },
  };
}

export default async function ProductPage({ params }: PageProps<"/urun/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = categoryMap[product.category];
  const related = getRelatedProducts(product, 8);
  const bundle = getBundlePartner(product);
  const lowest = Math.min(...product.variants.map((v) => v.price));
  const highest = Math.max(...product.variants.map((v) => v.price));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.variants[0].sku,
    brand: { "@type": "Brand", name: site.name },
    category: category.name,
    url: `${site.url}/urun/${product.slug}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: lowest,
      highPrice: highest,
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.inStock) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackView slug={product.slug} />
      <div className="container-x pt-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { label: "Ürünler", href: "/urunler" },
            { label: category.name, href: `/kategori/${category.slug}` },
            { label: product.name },
          ]}
        />
      </div>

      <section className="container-x grid gap-10 py-8 lg:grid-cols-12 lg:gap-14">
        {/* Galeri */}
        <div className="lg:col-span-6">
          <div className="relative">
            <ProductGallery product={product} />
            {product.tags.length > 0 && (
              <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {product.highlights.slice(0, 4).map((h) => (
              <div key={h} className="rounded-2xl bg-cream-100 p-3 text-xs font-semibold leading-snug text-espresso-800">
                <Check className="mb-1.5 h-4 w-4 text-leaf-500" />
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Bilgi */}
        <div className="lg:col-span-6">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-caramel-700">
            <Link href={`/kategori/${category.slug}`} className="hover:underline">
              {category.name}
            </Link>
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-espresso-900 text-balance sm:text-5xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-espresso-700">{product.short}</p>
          <p className="mt-3 leading-relaxed text-espresso-700">{product.description}</p>

          <div className="mt-6" id="buy-panel">
            <AddToCartPanel product={product} />
          </div>

          {/* Detaylar (akordeon) */}
          <div className="mt-6 divide-y divide-espresso-900/10 rounded-3xl border border-espresso-900/10 bg-cream-50">
            <details className="acc group px-5" open>
              <summary className="flex items-center justify-between py-4 font-display text-lg font-semibold text-espresso-900">
                <span className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-caramel-600" /> Kullanım önerisi
                </span>
                <Plus className="acc-icon h-5 w-5 text-espresso-600 transition-transform" />
              </summary>
              <ul className="space-y-2 pb-5 text-sm text-espresso-700">
                {product.usage.map((u) => (
                  <li key={u} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caramel-500" />
                    {u}
                  </li>
                ))}
              </ul>
            </details>
            <details className="acc group px-5">
              <summary className="flex items-center justify-between py-4 font-display text-lg font-semibold text-espresso-900">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-caramel-600" /> Ürün bilgileri
                </span>
                <Plus className="acc-icon h-5 w-5 text-espresso-600 transition-transform" />
              </summary>
              <dl className="space-y-2 pb-5 text-sm">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[6.5rem_1fr] gap-2">
                    <dt className="font-semibold text-espresso-900">{s.label}</dt>
                    <dd className="text-espresso-700">{s.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[6.5rem_1fr] gap-2">
                  <dt className="font-semibold text-espresso-900">Boylar</dt>
                  <dd className="text-espresso-700">{product.variants.map((v) => `${v.label} (${formatPrice(v.price)})`).join(" · ")}</dd>
                </div>
              </dl>
            </details>
            <details className="acc group px-5">
              <summary className="flex items-center justify-between py-4 font-display text-lg font-semibold text-espresso-900">
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-caramel-600" /> Teslimat ve iade
                </span>
                <Plus className="acc-icon h-5 w-5 text-espresso-600 transition-transform" />
              </summary>
              <div className="space-y-2 pb-5 text-sm text-espresso-700">
                <p>14:00&apos;e kadar onaylanan siparişler aynı gün kargoya verilir; Türkiye genelinde {site.commerce.deliveryEstimate} içinde teslim edilir.</p>
                <p>{formatPrice(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir. Ambalajı açılmamış ürünlerde 14 gün içinde cayma hakkınız vardır.</p>
                <p>
                  Ayrıntılar: <Link href="/teslimat-ve-kargo" className="font-semibold underline underline-offset-2">Teslimat ve Kargo</Link> ·{" "}
                  <Link href="/iptal-ve-iade" className="font-semibold underline underline-offset-2">İptal ve İade</Link>
                </p>
              </div>
            </details>
          </div>

          {bundle && (
            <div className="mt-6">
              <Bundle product={product} partner={bundle.partner} reason={bundle.reason} />
            </div>
          )}

          <div className="mt-6 rounded-3xl bg-espresso-900 p-5 text-cream-50">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-caramel-300">İşletme misiniz?</p>
            <p className="mt-1 text-sm leading-relaxed text-cream-200">Toplu alımlarda kademeli fiyat ve HoReCa ambalajları için kurumsal ekibimizle görüşün.</p>
            <Link href="/kurumsal" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-caramel-300 hover:text-caramel-200">
              Teklif iste <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-12">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-espresso-900">Bunlarla iyi gider</h2>
            <Link href={`/kategori/${category.slug}`} className="text-sm font-bold text-espresso-900 hover:underline">
              Tüm {category.name.toLocaleLowerCase("tr")} →
            </Link>
          </Reveal>
          <div className="mt-8">
            <ProductRail products={related} ariaLabel="İlgili ürünler" />
          </div>
        </section>
      )}

      <RecentlyViewed exclude={product.slug} />
      <StickyBuyBar product={product} targetId="buy-panel" />
    </>
  );
}
