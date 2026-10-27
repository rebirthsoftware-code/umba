"use client";

import Link from "next/link";
import Script from "next/script";
import { ShieldCheck, ExternalLink, Lock } from "lucide-react";
import { useLastOrder } from "@/lib/last-order";
import { paytrIframeUrl } from "@/lib/paytr";
import { formatPrice } from "@/lib/format";

declare global {
  interface Window {
    iFrameResize?: (options: Record<string, unknown>, selector: string) => void;
  }
}

export function PaytrFrame() {
  const order = useLastOrder();
  const token = order?.paytr?.token;

  if (!order || !token) {
    return (
      <div className="mx-auto max-w-lg rounded-[1.5rem] border border-dashed border-espresso-900/15 p-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-espresso-900">Ödeme oturumu bulunamadı</h2>
        <p className="mt-2 text-sm text-espresso-600">Ödeme sayfasının süresi dolmuş olabilir. Lütfen ödeme adımına geri dönün.</p>
        <Link href="/odeme" className="mt-6 inline-flex h-12 items-center rounded-full bg-espresso-900 px-7 text-sm font-semibold text-cream-50">
          Ödeme adımına dön
        </Link>
      </div>
    );
  }

  const url = paytrIframeUrl(token);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="overflow-hidden rounded-2xl border border-espresso-900/10 bg-cream-50 shadow-card">
          <div className="flex items-center justify-between border-b border-espresso-900/10 bg-cream-100 px-5 py-3 text-xs font-semibold text-espresso-700">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-leaf-500" /> PayTR güvenli ödeme · 3D Secure
            </span>
            <span className="font-mono">{order.orderNo}</span>
          </div>
          <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="afterInteractive" onLoad={() => window.iFrameResize?.({}, "#paytriframe")} />
          <iframe
            src={url}
            id="paytriframe"
            title="PayTR güvenli ödeme"
            frameBorder="0"
            scrolling="no"
            className="min-h-[560px] w-full"
            allow="payment"
          />
        </div>
        <p className="mt-3 text-xs text-espresso-600">
          Ödeme penceresi açılmadıysa{" "}
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-caramel-700 underline underline-offset-2">
            yeni sekmede açın <ExternalLink className="h-3 w-3" />
          </a>
          .
        </p>
      </div>
      <aside className="lg:col-span-4">
        <div className="sticky top-28 rounded-2xl border border-espresso-900/10 bg-cream-100 p-6">
          <h2 className="font-display text-xl font-semibold text-espresso-900">Sipariş özeti</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {order.lines.map((l) => (
              <li key={`${l.productSlug}-${l.variantId}`} className="flex justify-between gap-3">
                <span className="text-espresso-800">
                  {l.name} <span className="text-espresso-600">({l.variantLabel}) × {l.quantity}</span>
                </span>
                <span className="font-semibold tabular-nums">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t border-espresso-900/10 pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-espresso-700">Kargo</dt>
              <dd className="tabular-nums">{order.totals.shipping ? formatPrice(order.totals.shipping) : "Ücretsiz"}</dd>
            </div>
            <div className="flex justify-between text-base font-bold">
              <dt>Toplam</dt>
              <dd className="tabular-nums">{formatPrice(order.totals.total)}</dd>
            </div>
          </dl>
          <p className="mt-4 flex items-start gap-2 text-xs text-espresso-600">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf-500" />
            Kart bilgileriniz Umba sunucularına ulaşmaz; ödeme PayTR&apos;nin güvenli sayfasında tamamlanır.
          </p>
        </div>
      </aside>
    </div>
  );
}
