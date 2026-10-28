"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "./CartProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/format";
import { site } from "@/lib/site";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";

export function CartPageContent() {
  const { lines, totals, setQuantity, remove, clear, hydrated } = useCart();

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-cream-200" aria-busy="true" />;
  }

  if (lines.length === 0) {
    const suggestions = getFeaturedProducts(4);
    return (
      <div>
        <div className="mx-auto max-w-lg rounded-[1.5rem] border border-dashed border-espresso-900/15 p-10 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream-200 text-espresso-600">
            <ShoppingBag className="h-9 w-9" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-semibold text-espresso-900">Sepetiniz boş</h2>
          <p className="mt-2 text-sm text-espresso-600">Aşağıdaki çok satanlardan başlayabilir veya kataloğu inceleyebilirsiniz.</p>
          <Link
            href="/urunler"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-espresso-900 px-7 text-sm font-semibold text-cream-50 hover:bg-espresso-800"
          >
            Ürünleri keşfet <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <h3 className="mt-14 font-display text-2xl font-semibold text-espresso-900">Çok satanlar</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    );
  }

  const progress = Math.min(100, (totals.subtotal / site.commerce.freeShippingThreshold) * 100);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="rounded-2xl border border-espresso-900/10 bg-cream-50">
          <div className="flex items-center justify-between border-b border-espresso-900/10 px-5 py-4">
            <p className="text-sm font-semibold text-espresso-900">{totals.itemCount} ürün</p>
            <button type="button" onClick={clear} className="text-xs font-semibold text-espresso-600 hover:text-berry-500">
              Sepeti boşalt
            </button>
          </div>
          <ul className="divide-y divide-espresso-900/10">
            {lines.map((line) => (
              <li key={`${line.productSlug}-${line.variantId}`} className="flex gap-4 p-5 sm:gap-6">
                <Link href={`/urun/${line.product.slug}`} className="shrink-0">
                  <ProductImage product={line.product} sizeLabel={line.variant.label} className="h-32 w-24 rounded-2xl sm:h-36 sm:w-28" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/urun/${line.product.slug}`} className="font-display text-lg font-semibold leading-tight text-espresso-900 hover:text-caramel-700">
                        {line.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-espresso-600">
                        {line.variant.label} · <span className="font-mono text-xs">{line.variant.sku}</span>
                      </p>
                      <p className="mt-1 text-sm text-espresso-700">Birim: {formatPrice(line.variant.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.productSlug, line.variantId)}
                      aria-label="Ürünü kaldır"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-espresso-600 hover:bg-cream-200 hover:text-berry-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex h-10 items-center rounded-full border border-espresso-900/15">
                      <button
                        type="button"
                        aria-label="Azalt"
                        onClick={() => setQuantity(line.productSlug, line.variantId, line.quantity - 1)}
                        className="inline-flex h-full w-10 items-center justify-center rounded-l-full hover:bg-cream-200"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-bold tabular-nums">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label="Artır"
                        onClick={() => setQuantity(line.productSlug, line.variantId, line.quantity + 1)}
                        className="inline-flex h-full w-10 items-center justify-center rounded-r-full hover:bg-cream-200"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-base font-bold tabular-nums text-espresso-900">{formatPrice(line.lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Link href="/urunler" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-espresso-900 hover:underline">
          ← Alışverişe devam et
        </Link>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-28 rounded-2xl border border-espresso-900/10 bg-cream-100 p-6">
          <h2 className="font-display text-xl font-semibold text-espresso-900">Sipariş özeti</h2>
          <div className="mt-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-espresso-700">
              <Truck className="h-4 w-4 text-caramel-600" />
              {totals.shipping === 0
                ? "Kargonuz ücretsiz!"
                : `Ücretsiz kargo için ${formatPrice(totals.freeShippingRemaining)} daha ekleyin.`}
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-300">
              <div className="h-full rounded-full bg-caramel-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-espresso-700">Ara toplam</dt>
              <dd className="font-semibold tabular-nums">{formatPrice(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-espresso-700">Kargo</dt>
              <dd className="font-semibold tabular-nums">{totals.shipping === 0 ? "Ücretsiz" : formatPrice(totals.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-espresso-900/10 pt-3 text-base">
              <dt className="font-bold text-espresso-900">Toplam</dt>
              <dd className="font-bold tabular-nums text-espresso-900">{formatPrice(totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-espresso-600">Fiyatlara KDV dahildir.</p>
          <Link
            href="/odeme"
            className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-espresso-900 text-base font-bold text-cream-50 hover:bg-espresso-800"
          >
            Ödemeye geç <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-xs text-espresso-600">Kredi kartı · Havale/EFT · 256-bit SSL</p>
        </div>
      </aside>
    </div>
  );
}
