"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2, XCircle, MessageCircle, Printer } from "lucide-react";
import { useLastOrder, updateLastOrder } from "@/lib/last-order";
import { cartStore } from "@/lib/cart-store";
import { orderToText } from "@/lib/order";
import { formatPrice } from "@/lib/format";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { site } from "@/lib/site";
import { apiEnabled } from "@/lib/api";

export function PaymentResult({ status }: { status: "success" | "failed" }) {
  const order = useLastOrder();

  // Başarılı ödemede sepeti temizle ve sipariş durumunu güncelle (dış sistem senkronu)
  useEffect(() => {
    if (status !== "success") return;
    cartStore.clear();
    updateLastOrder({ status: "odendi", delivered: true });
  }, [status]);

  if (status === "failed") {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-berry-500/10 text-berry-500">
          <XCircle className="h-10 w-10" />
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-espresso-900">Ödeme tamamlanamadı</h1>
        <p className="mt-3 text-espresso-700">
          Kartınızdan tahsilat yapılmadı. Sepetiniz korunuyor; tekrar deneyebilir veya Havale/EFT ile ödeyebilirsiniz.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/odeme" className="inline-flex h-12 items-center rounded-full bg-caramel-500 px-7 text-sm font-bold text-espresso-950 hover:bg-caramel-400">
            Tekrar dene
          </Link>
          <WhatsAppLink
            text={`Merhaba, ${order?.orderNo ?? ""} numaralı siparişimde kart ödemesi tamamlanamadı, yardımcı olur musunuz?`}
            className="inline-flex h-12 items-center gap-2 rounded-full border border-espresso-900/20 px-6 text-sm font-semibold hover:bg-cream-200"
          >
            <MessageCircle className="h-4 w-4" /> Destek al
          </WhatsAppLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-100 text-leaf-500">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-espresso-900">Ödemeniz alındı, teşekkürler!</h1>
        {order ? (
          <p className="mt-3 text-espresso-700">
            Sipariş numaranız: <span className="font-mono text-lg font-bold text-espresso-900">{order.orderNo}</span> ·{" "}
            <span className="font-semibold">{formatPrice(order.totals.total)}</span> kartınızdan tahsil edildi.
          </p>
        ) : (
          <p className="mt-3 text-espresso-700">Siparişiniz hazırlanıyor. Onay e-postası kısa süre içinde gelecek.</p>
        )}
        <p className="mt-1 text-sm text-espresso-600">Siparişiniz {site.commerce.deliveryEstimate} içinde kargoya verilir.</p>
        {apiEnabled() && order && (
          <Link href={`/siparis-takip?no=${encodeURIComponent(order.orderNo)}`} className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">
            Sipariş durumunu takip et
          </Link>
        )}
      </div>

      {order && (
        <div className="mt-8 rounded-2xl border border-espresso-900/10 bg-cream-50 p-6">
          <h2 className="font-display text-xl font-semibold text-espresso-900">Sipariş detayı</h2>
          <ul className="mt-4 divide-y divide-espresso-900/10">
            {order.lines.map((l) => (
              <li key={`${l.productSlug}-${l.variantId}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-semibold text-espresso-900">{l.name}</p>
                  <p className="text-xs text-espresso-600">
                    {l.variantLabel} × {l.quantity}
                  </p>
                </div>
                <p className="font-bold tabular-nums">{formatPrice(l.lineTotal)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-espresso-900/10 pt-4 text-sm text-espresso-800">
            <span className="font-semibold">Teslimat:</span> {order.customer.fullName}, {order.customer.address}, {order.customer.district} /{" "}
            {order.customer.city}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <WhatsAppLink
          text={order ? `Merhaba, ${order.orderNo} numaralı siparişimin ödemesini tamamladım.\n\n${orderToText(order)}` : "Merhaba, siparişim hakkında bilgi almak istiyorum."}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white hover:brightness-95"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp ile yazın
        </WhatsAppLink>
        <button type="button" onClick={() => window.print()} className="inline-flex h-12 items-center gap-2 rounded-full border border-espresso-900/20 px-6 text-sm font-semibold hover:bg-cream-200">
          <Printer className="h-4 w-4" /> Yazdır
        </button>
        <Link href="/urunler" className="inline-flex h-12 items-center rounded-full bg-espresso-900 px-6 text-sm font-semibold text-cream-50 hover:bg-espresso-800">
          Alışverişe devam et
        </Link>
      </div>
    </div>
  );
}
