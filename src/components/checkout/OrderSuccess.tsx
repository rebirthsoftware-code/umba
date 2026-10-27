"use client";

import Link from "next/link";
import { useState } from "react";
import { useLastOrder } from "@/lib/last-order";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Copy, Mail, MessageCircle, Printer, Send } from "lucide-react";
import { paymentLabels, orderToText } from "@/lib/order";
import { formatPrice, formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { mailtoUrl } from "@/lib/forms";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export function OrderSuccess() {
  const params = useSearchParams();
  const no = params.get("no");
  const stored = useLastOrder();
  const order = stored && (!no || stored.orderNo === no) ? stored : null;
  const [copied, setCopied] = useState(false);

  const orderNo = order?.orderNo ?? no ?? "";
  const text = order ? orderToText(order) : `Merhaba, ${orderNo} numaralı siparişim hakkında bilgi almak istiyorum.`;
  const waText = (order?.delivered && order.paymentMethod === "havale" ? `Merhaba, ${orderNo} numaralı siparişim için havale dekontunu iletiyorum.` : text);
  const mailHref = mailtoUrl(`Sipariş ${orderNo}`, text);

  const copyIban = async () => {
    try {
      await navigator.clipboard.writeText(site.bank.iban.replace(/\s/g, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* yoksay */
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf-100 text-leaf-500">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-espresso-900">
          {order?.delivered ? "Siparişiniz alındı!" : "Siparişiniz hazır!"}
        </h1>
        <p className="mt-3 text-espresso-700">
          Sipariş numaranız: <span className="font-mono text-lg font-bold text-espresso-900">{orderNo || "—"}</span>
        </p>
        {order && (
          <p className="mt-1 text-sm text-espresso-600">
            {formatDate(order.createdAt)} · {paymentLabels[order.paymentMethod]}
          </p>
        )}
      </div>

      {order && !order.delivered && (
        <div className="mt-8 rounded-2xl border-2 border-caramel-500 bg-caramel-500/10 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-caramel-700">Son adım</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-espresso-900">Siparişinizi bize iletin</h2>
          <p className="mt-2 text-sm leading-relaxed text-espresso-700">
            Sipariş özetiniz hazır mesaj olarak hazırlandı. Aşağıdaki butona basın, açılan mesajı göndermeniz yeterli.
            Siparişiniz bize ulaştığında {site.commerce.deliveryEstimate} içinde kargoya verilir.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <WhatsAppLink text={waText} className="inline-flex h-13 items-center gap-2 rounded-full bg-[#25D366] px-7 text-base font-bold text-white hover:brightness-95">
              <MessageCircle className="h-5 w-5" /> WhatsApp ile gönder
            </WhatsAppLink>
            <a
              href={mailHref}
              className="inline-flex h-13 items-center gap-2 rounded-full border border-espresso-900/20 bg-cream-50 px-6 text-sm font-semibold hover:bg-cream-200"
            >
              <Mail className="h-4 w-4" /> E-posta ile gönder
            </a>
          </div>
        </div>
      )}

      {order?.paymentMethod === "havale" && (
        <div className="mt-8 rounded-2xl border border-caramel-500/40 bg-cream-100 p-6">
          <h2 className="font-display text-xl font-semibold text-espresso-900">Havale / EFT bilgileri</h2>
          <p className="mt-2 text-sm text-espresso-700">
            Aşağıdaki hesaba <strong>{formatPrice(order.totals.total)}</strong> tutarını, açıklama kısmına{" "}
            <strong>{order.orderNo}</strong> yazarak gönderin. Ödeme onaylandığında siparişiniz kargoya verilir.
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Banka</dt>
              <dd className="font-semibold text-espresso-900">{site.bank.bankName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Hesap sahibi</dt>
              <dd className="font-semibold text-espresso-900">{site.bank.holder}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-espresso-600">IBAN</dt>
              <dd className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-base font-bold text-espresso-900">{site.bank.iban}</span>
                <button
                  type="button"
                  onClick={copyIban}
                  className="inline-flex h-8 items-center gap-1 rounded-full border border-espresso-900/15 bg-cream-50 px-3 text-xs font-semibold hover:border-espresso-900"
                >
                  <Copy className="h-3.5 w-3.5" /> {copied ? "Kopyalandı" : "Kopyala"}
                </button>
              </dd>
            </div>
          </dl>
        </div>
      )}

      {order?.paymentMethod === "kapida" && order.delivered && (
        <div className="mt-8 rounded-2xl border border-espresso-900/10 bg-cream-100 p-6 text-sm text-espresso-700">
          Siparişiniz hazırlanıyor. Kargo görevlisine <strong>{formatPrice(order.totals.total)}</strong> tutarını nakit veya kart ile
          ödeyebilirsiniz.
        </div>
      )}

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
          <dl className="mt-4 space-y-1.5 border-t border-espresso-900/10 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-espresso-700">Ara toplam</dt>
              <dd className="tabular-nums">{formatPrice(order.totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-espresso-700">Kargo</dt>
              <dd className="tabular-nums">{order.totals.shipping ? formatPrice(order.totals.shipping) : "Ücretsiz"}</dd>
            </div>
            {order.totals.codFee > 0 && (
              <div className="flex justify-between">
                <dt className="text-espresso-700">Kapıda ödeme bedeli</dt>
                <dd className="tabular-nums">{formatPrice(order.totals.codFee)}</dd>
              </div>
            )}
            <div className="flex justify-between text-base font-bold">
              <dt>Toplam</dt>
              <dd className="tabular-nums">{formatPrice(order.totals.total)}</dd>
            </div>
          </dl>
          <div className="mt-4 grid gap-4 border-t border-espresso-900/10 pt-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Teslimat adresi</p>
              <p className="mt-1 text-espresso-800">
                {order.customer.fullName}
                <br />
                {order.customer.address}
                <br />
                {order.customer.district} / {order.customer.city} {order.customer.postalCode}
                <br />
                {order.customer.phone}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-espresso-600">Fatura</p>
              <p className="mt-1 text-espresso-800">
                {order.customer.invoiceType === "kurumsal"
                  ? `${order.customer.companyName} · ${order.customer.taxOffice} · ${order.customer.taxNo}`
                  : "Bireysel fatura"}
                <br />
                {order.customer.email}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {order?.delivered && (
          <WhatsAppLink text={waText} placement="top" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-sm font-bold text-white hover:brightness-95">
            <Send className="h-4 w-4" />
            {order.paymentMethod === "havale" ? "WhatsApp ile dekont gönder" : "WhatsApp ile yazın"}
          </WhatsAppLink>
        )}
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-12 items-center gap-2 rounded-full border border-espresso-900/20 px-6 text-sm font-semibold hover:bg-cream-200"
        >
          <Printer className="h-4 w-4" /> Yazdır
        </button>
        <Link href="/urunler" className="inline-flex h-12 items-center rounded-full bg-espresso-900 px-6 text-sm font-semibold text-cream-50 hover:bg-espresso-800">
          Alışverişe devam et
        </Link>
      </div>
      <p className="mt-6 text-center text-xs text-espresso-600">
        Sorularınız için {site.contact.phone} · {site.contact.email}
      </p>
    </div>
  );
}
