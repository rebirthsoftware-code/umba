"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, PackageCheck, Truck, ExternalLink, AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { apiEnabled, trackOrder, statusLabels, statusTone, progressSteps, type ApiOrder, type OrderStatus } from "@/lib/api";
import { paymentLabels } from "@/lib/order";
import { formatPrice, formatDate, cn } from "@/lib/format";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { site } from "@/lib/site";

const stepIndex: Partial<Record<OrderStatus, number>> = { onaylandi: 0, hazirlaniyor: 1, kargolandi: 2, "teslim-edildi": 3 };

export function OrderProgress({ status }: { status: OrderStatus }) {
  const idx = stepIndex[status] ?? -1;
  const dead = status === "iptal" || status === "odeme-basarisiz";
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Sipariş ilerlemesi">
      {progressSteps.map((s, i) => {
        const done = !dead && i <= idx;
        const current = !dead && i === idx;
        return (
          <li key={s.key} className="min-w-0">
            <span className={cn("block h-1.5 rounded-full transition-colors", done ? "bg-espresso-900" : "bg-espresso-900/10")} />
            <span className={cn("mt-2 block truncate text-[0.7rem] font-bold uppercase tracking-[0.14em]", done ? "text-espresso-900" : "text-espresso-600/60", current && "underline underline-offset-4")}>
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderTimeline({ order }: { order: ApiOrder }) {
  return (
    <ol className="space-y-4">
      {[...order.events].reverse().map((e, i) => {
        const Icon = e.type === "cargo" ? Truck : e.status === "iptal" || e.status === "odeme-basarisiz" ? XCircle : e.type === "payment" || e.status === "teslim-edildi" ? CheckCircle2 : Clock;
        return (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-200 text-espresso-700">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-espresso-900">{e.status ? statusLabels[e.status] : e.type === "note" ? "Not" : "Güncelleme"}</p>
              {e.message && <p className="text-sm text-espresso-700">{e.message}</p>}
              <p className="text-xs text-espresso-600">{formatDate(e.at)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function OrderTracking() {
  const params = useSearchParams();
  const [no, setNo] = useState(params.get("no") ?? "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<ApiOrder | null>(null);

  if (!apiEnabled()) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-espresso-900/10 bg-cream-100 p-8 text-center">
        <p className="font-display text-2xl font-semibold text-espresso-900">Sipariş takibi için bize yazın</p>
        <p className="mt-2 text-sm text-espresso-700">Sipariş numaranızla WhatsApp üzerinden anında bilgi alabilirsiniz.</p>
        <WhatsAppLink text="Merhaba, siparişimin durumunu öğrenmek istiyorum. Sipariş no: " className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white">
          WhatsApp ile sor
        </WhatsAppLink>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);
    const res = await trackOrder(no, phone);
    if (res.status !== "success" || !res.order) setError(res.reason ?? "Sipariş bulunamadı");
    else setOrder(res.order);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={onSubmit} className="grid grid-cols-[minmax(0,1fr)] gap-3 rounded-2xl border border-espresso-900/10 bg-cream-100 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Sipariş numarası</span>
          <input
            value={no}
            onChange={(e) => setNo(e.target.value.toUpperCase())}
            placeholder="UMB-261028-AB12"
            required
            autoComplete="off"
            className="mt-2 h-12 w-full rounded-xl border border-espresso-900/10 bg-cream-50 px-4 font-mono text-sm uppercase focus:border-espresso-900 focus:outline-none"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Siparişteki telefon</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xx xxx xx xx"
            required
            inputMode="tel"
            autoComplete="tel"
            className="mt-2 h-12 w-full rounded-xl border border-espresso-900/10 bg-cream-50 px-4 text-sm focus:border-espresso-900 focus:outline-none"
          />
        </label>
        <button type="submit" disabled={loading} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-espresso-900 px-6 text-sm font-bold text-cream-50 disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Sorgula
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-berry-500/10 px-4 py-3 text-sm font-semibold text-berry-500">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      {order && (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-espresso-900/10 bg-cream-50 p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Sipariş</p>
                <p className="mt-1 font-mono text-lg font-bold text-espresso-900">{order.orderNo}</p>
                <p className="text-sm text-espresso-600">{formatDate(order.createdAt)} · {paymentLabels[order.paymentMethod]}</p>
              </div>
              <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", statusTone[order.status])}>{statusLabels[order.status]}</span>
            </div>
            <div className="mt-6">
              <OrderProgress status={order.status} />
            </div>
            {order.status === "beklemede" && (
              <p className="mt-5 rounded-xl bg-caramel-300/30 px-4 py-3 text-sm text-espresso-800">
                Havale/EFT ödemeniz bekleniyor. Dekontu WhatsApp&rsquo;tan iletirseniz siparişinizi hemen onaylıyoruz. IBAN: <span className="font-mono font-semibold">{site.bank.iban}</span>
              </p>
            )}
            {(order.trackingNo || order.trackingUrl) && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-espresso-900 px-4 py-3 text-cream-50">
                <p className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  <span className="font-semibold">{order.carrierName ?? "Kargo"}</span>
                  {order.trackingNo && <span className="font-mono">{order.trackingNo}</span>}
                </p>
                {order.trackingUrl && (
                  <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-cream-50 px-3 py-1.5 text-xs font-bold text-espresso-900">
                    Kargoyu takip et <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-espresso-900/10 bg-cream-50 p-6">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-espresso-900">
                <PackageCheck className="h-5 w-5" /> Ürünler
              </h2>
              <ul className="mt-4 divide-y divide-espresso-900/10 text-sm">
                {order.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-3 py-2">
                    <span className="min-w-0">
                      {l.name} <span className="text-espresso-600">× {l.quantity}</span>
                    </span>
                    <span className="font-semibold">{formatPrice(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-3 space-y-1 border-t border-espresso-900/10 pt-3 text-sm">
                <div className="flex justify-between"><dt>Kargo</dt><dd>{order.totals.shipping ? formatPrice(order.totals.shipping) : "Ücretsiz"}</dd></div>
                {order.totals.codFee > 0 && <div className="flex justify-between"><dt>Kapıda ödeme</dt><dd>{formatPrice(order.totals.codFee)}</dd></div>}
                <div className="flex justify-between text-base font-bold"><dt>Toplam</dt><dd>{formatPrice(order.totals.total)}</dd></div>
              </dl>
            </div>
            <div className="rounded-2xl border border-espresso-900/10 bg-cream-50 p-6">
              <h2 className="font-display text-xl font-semibold text-espresso-900">Sipariş geçmişi</h2>
              <div className="mt-4">
                <OrderTimeline order={order} />
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-espresso-600">
            Sorunuz mu var?{" "}
            <WhatsAppLink text={`Merhaba, ${order.orderNo} numaralı siparişim hakkında bilgi almak istiyorum.`} className="font-semibold text-espresso-900 underline underline-offset-4">
              WhatsApp&rsquo;tan yazın
            </WhatsAppLink>
          </p>
        </div>
      )}
    </div>
  );
}
