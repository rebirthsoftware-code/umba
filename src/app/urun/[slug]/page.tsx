import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Plus, ArrowUpRight } from "lucide-react";
import { products, getProduct, getRelatedProducts, getBundlePartner } from "@/lib/products";
import { categoryMap } from "@/lib/categories";
import { site } from "@/lib/site";
import { getCategory } from "@/lib/categories";
import { formatPrice } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { TagBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ProductStage } from "@/components/product/ProductStage";
import { ProductRail } from "@/components/product/ProductRail";
import { AddToCartPanel } from "@/components/product/AddToCartPanel";
import { StickyBuyBar } from "@/components/product/StickyBuyBar";
import { Bundle } from "@/components/product/Bundle";
import { RecentlyViewed, TrackView } from "@/components/product/RecentlyViewed";
import { loadPriceOverrides } from "@/server/prices";

export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/urun/[slug]">): Promise<Metadata> {
  await loadPriceOverrides();
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const cat = getCategory(product.category);
  const price = formatPrice(product.variants[0].price);
  return {
    title: `${product.name} | ${cat?.name ?? ""} · ${product.variants[0].label} · ${price}`,
    description: `${product.name}: ${product.short} ${product.description}`.slice(0, 155) + " Kartla veya havaleyle ödeme, 1–3 iş günü teslimat.",
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: { title: `${product.name} | ${site.name}`, description: product.short, type: "website" },
  };
}

function Section({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="acc group border-t border-espresso-900/10" open={open}>
      <summary className="flex items-center justify-between py-4 text-[15px] font-semibold text-espresso-900">
        {title}
        <Plus className="acc-icon h-4 w-4 text-espresso-600 transition-transform" />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-espresso-700">{children}</div>
    </details>
  );
}

export default async function ProductPage({ params }: PageProps<"/urun/[slug]">) {
  await loadPriceOverrides();
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
        <Breadcrumbs items={[{ label: "Ürünler", href: "/urunler" }, { label: category.name, href: `/kategori/${category.slug}` }, { label: product.name }]} />
      </div>

      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-8 lg:grid-cols-12 lg:gap-16 lg:py-12">
        {/* Görsel */}
        <div className="lg:col-span-6">
          <div className="lg:sticky lg:top-28">
            <div className="relative">
              <ProductStage product={product} />
              {product.tags.length > 0 && (
                <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-1.5">
                  {product.tags.slice(0, 2).map((t) => (
                    <TagBadge key={t} tag={t} />
                  ))}
                </div>
              )}
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-espresso-700 sm:grid-cols-2">
              {product.highlights.slice(0, 4).map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-caramel-600" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bilgi */}
        <div className="lg:col-span-6">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-caramel-700">
            <Link href={`/kategori/${category.slug}`} className="hover:underline">
              {category.name}
            </Link>
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.04] text-espresso-900 text-balance sm:text-[3.25rem]">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-espresso-700">{product.short}</p>
          <p className="mt-3 max-w-prose leading-relaxed text-espresso-700">{product.description}</p>

          <div className="mt-8" id="buy-panel">
            <AddToCartPanel product={product} />
          </div>

          <div className="mt-8 border-b border-espresso-900/10">
            <Section title="Kullanım önerisi" open>
              <ul className="space-y-1.5">
                {product.usage.map((u) => (
                  <li key={u} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-caramel-500" />
                    {u}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Ürün bilgileri">
              <dl className="space-y-1.5">
                {product.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[7rem_1fr] gap-3">
                    <dt className="font-semibold text-espresso-900">{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[7rem_1fr] gap-3">
                  <dt className="font-semibold text-espresso-900">Boylar</dt>
                  <dd>{product.variants.map((v) => `${v.label} (${formatPrice(v.price)})`).join(" · ")}</dd>
                </div>
              </dl>
            </Section>
            <Section title="Teslimat ve iade">
              <p>14:00&apos;e kadar onaylanan siparişler aynı gün kargoya verilir; Türkiye genelinde {site.commerce.deliveryEstimate} içinde teslim edilir.</p>
              <p className="mt-2">
                {formatPrice(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir. Ambalajı açılmamış ürünlerde 14 gün içinde cayma hakkınız vardır.{" "}
                <Link href="/iptal-ve-iade" className="font-semibold text-espresso-900 underline underline-offset-4">
                  Ayrıntılar
                </Link>
              </p>
            </Section>
          </div>

          {bundle && (
            <div className="mt-8">
              <Bundle product={product} partner={bundle.partner} reason={bundle.reason} />
            </div>
          )}

          <Link href="/kurumsal" className="group mt-8 flex items-center justify-between border-t border-espresso-900/10 py-4 text-sm">
            <span>
              <span className="font-semibold text-espresso-900">İşletme misiniz?</span>{" "}
              <span className="text-espresso-600">Toplu alımda kademeli fiyat ve HoReCa ambalajları.</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-espresso-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x border-t border-espresso-900/10 py-14">
          <Reveal className="flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl font-semibold text-espresso-900">Bunlarla iyi gider</h2>
            <Link href={`/kategori/${category.slug}`} className="text-sm font-semibold text-espresso-900 underline underline-offset-4">
              Tüm {category.name.toLocaleLowerCase("tr")}
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
