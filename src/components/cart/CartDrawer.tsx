"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2, Truck, BadgePercent } from "lucide-react";
import { useCart } from "./CartProvider";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice, cn } from "@/lib/format";
import { site } from "@/lib/site";
import { discountMessage, computeDiscount, formatPct } from "@/lib/discount";
import { getFeaturedProducts } from "@/lib/products";
import { ProductVisual } from "@/components/product/ProductVisual";

export function CartDrawer() {
  const { isOpen, close, lines, totals, setQuantity, remove, add } = useCart();
  const inCart = new Set(lines.map((l) => l.product.slug));
  const suggestions = getFeaturedProducts(12).filter((p) => !inCart.has(p.slug)).slice(0, 3);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  const progress = Math.min(100, (totals.subtotal / site.commerce.freeShippingThreshold) * 100);

  return (
    <div className={cn("fixed inset-0 z-50", isOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!isOpen}>
      <div
        className={cn(
          "absolute inset-0 bg-espresso-950/50 backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream-50 shadow-lift transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Sepetiniz"
      >
        <div className="flex items-center justify-between border-b border-espresso-900/10 px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-espresso-900">
            Sepetiniz{" "}
            {totals.itemCount > 0 && <span className="text-base font-normal text-espresso-600">({totals.itemCount} ürün)</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Sepeti kapat"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-200 text-espresso-600">
              <ShoppingBag className="h-9 w-9" />
            </span>
            <p className="font-display text-xl font-semibold text-espresso-900">Sepetiniz boş</p>
            <p className="text-sm text-espresso-600">Şuruplardan kahveye, barınız için ihtiyacınız olan her şey burada.</p>
            <button
              type="button"
              onClick={close}
              className="mt-2 inline-flex h-11 items-center rounded-full bg-espresso-900 px-6 text-sm font-semibold text-cream-50 hover:bg-espresso-800"
            >
              Alışverişe başla
            </button>
          </div>
        ) : (
          <>
            <div className="border-b border-espresso-900/10 px-5 py-3">
              <p className="flex items-center gap-2 text-xs font-semibold text-espresso-700">
                <Truck className="h-4 w-4 text-caramel-600" />
                {totals.shipping === 0
                  ? "Tebrikler! Kargonuz ücretsiz."
                  : `Ücretsiz kargo için ${formatPrice(totals.freeShippingRemaining)} daha ekleyin.`}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-200">
                <div className="h-full rounded-full bg-caramel-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              {discountMessage(totals.subtotal) && (
                <p className="mt-2 flex items-start gap-2 text-xs font-semibold text-leaf-500">
                  <BadgePercent className="mt-0.5 h-4 w-4 shrink-0" />
                  {discountMessage(totals.subtotal)}
                </p>
              )}
            </div>

            <ul className="flex-1 divide-y divide-espresso-900/10 overflow-y-auto px-5">
              {lines.map((line) => (
                <li key={`${line.productSlug}-${line.variantId}`} className="flex gap-4 py-4">
                  <Link href={`/urun/${line.product.slug}`} onClick={close} className="shrink-0">
                    <ProductImage product={line.product} sizeLabel={line.variant.label} className="h-24 w-20 rounded-2xl" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/urun/${line.product.slug}`}
                          onClick={close}
                          className="line-clamp-2 text-sm font-bold leading-snug text-espresso-900 hover:text-caramel-700"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-espresso-600">{line.variant.label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.productSlug, line.variantId)}
                        aria-label="Ürünü kaldır"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-espresso-600 hover:bg-cream-200 hover:text-berry-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="inline-flex h-9 items-center rounded-full border border-espresso-900/15">
                        <button
                          type="button"
                          aria-label="Azalt"
                          onClick={() => setQuantity(line.productSlug, line.variantId, line.quantity - 1)}
                          className="inline-flex h-full w-9 items-center justify-center rounded-l-full hover:bg-cream-200"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold tabular-nums">{line.quantity}</span>
                        <button
                          type="button"
                          aria-label="Artır"
                          onClick={() => setQuantity(line.productSlug, line.variantId, line.quantity + 1)}
                          className="inline-flex h-full w-9 items-center justify-center rounded-r-full hover:bg-cream-200"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold tabular-nums text-espresso-900">{formatPrice(line.lineTotal)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {suggestions.length > 0 && (
              <div className="border-t border-espresso-900/10 px-5 py-3">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-espresso-600">Bunlarla iyi gider</p>
                <ul className="scrollbar-none -mx-5 mt-2 flex gap-2 overflow-x-auto px-5">
                  {suggestions.map((p) => (
                    <li key={p.slug} className="flex w-44 shrink-0 items-center gap-2 rounded-2xl border border-espresso-900/10 bg-cream-50 p-2">
                      <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg bg-cream-100">
                        <ProductVisual product={p} className="h-[84%] w-auto" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-bold text-espresso-900">{p.name}</span>
                        <span className="block text-[0.7rem] text-espresso-600">{formatPrice(p.variants[0].price)}</span>
                      </span>
                      <button
                        type="button"
                        aria-label={`${p.name} sepete ekle`}
                        onClick={() => add({ productSlug: p.slug, variantId: p.variants[0].id, quantity: 1 }, { silent: true })}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-espresso-900/15 hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-espresso-900/10 bg-cream-100 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-espresso-700">Ara toplam</span>
                <span className="font-bold tabular-nums text-espresso-900">{formatPrice(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-leaf-500">Sepet indirimi ({formatPct(computeDiscount(totals.subtotal).pct)})</span>
                  <span className="font-semibold tabular-nums text-leaf-500">-{formatPrice(totals.discount)}</span>
                </div>
              )}
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="text-espresso-700">Kargo</span>
                <span className="font-semibold tabular-nums text-espresso-900">
                  {totals.shipping === 0 ? "Ücretsiz" : formatPrice(totals.shipping)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-espresso-900/10 pt-2 text-base">
                <span className="font-semibold text-espresso-900">Toplam</span>
                <span className="font-bold tabular-nums text-espresso-900">{formatPrice(totals.total)}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href="/sepet"
                  onClick={close}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-espresso-900/20 text-sm font-semibold text-espresso-900 hover:bg-cream-200"
                >
                  Sepete git
                </Link>
                <Link
                  href="/odeme"
                  onClick={close}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-espresso-900 text-sm font-bold text-cream-50 hover:bg-espresso-800"
                >
                  Ödemeye geç
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
