"use client";

import { useCallback, useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2, Search, RefreshCw, LogOut, Truck, ExternalLink, ChevronLeft, ChevronRight, Phone, Mail, MapPin, CreditCard, AlertCircle, Save, X } from "lucide-react";
import { admin, apiEnabled, orderStatuses, statusLabels, statusTone, carriers, type ApiOrder, type OrderStatus } from "@/lib/api";
import { paymentLabels } from "@/lib/order";
import { formatPrice, formatDate, cn } from "@/lib/format";
import { OrderTimeline } from "@/components/order/OrderTracking";
import { site } from "@/lib/site";
import Link from "next/link";
import { LogoImage } from "@/components/ui/Logo";
import { InstallButton } from "@/components/pwa/InstallButton";
import { PushToggle } from "@/components/pwa/PushToggle";
import { PricesPanel, ShippingCard } from "./PricesPanel";

/* ------------------------------ Oturum deposu ------------------------------ */
const KEY = "umba:admin";
const listeners = new Set<() => void>();
const session = {
  read: () => {
    try {
      return window.sessionStorage.getItem(KEY) ?? "";
    } catch {
      return "";
    }
  },
  write: (v: string) => {
    try {
      if (v) window.sessionStorage.setItem(KEY, v);
      else window.sessionStorage.removeItem(KEY);
    } catch {
      /* yoksay */
    }
    for (const l of listeners) l();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};
function useToken() {
  return useSyncExternalStore(session.subscribe, session.read, () => "");
}

/* İş akışına göre bir sonraki mantıklı adımlar */
const nextSteps: Partial<Record<OrderStatus, OrderStatus[]>> = {
  "odeme-bekliyor": ["onaylandi", "iptal"],
  beklemede: ["onaylandi", "iptal"],
  onaylandi: ["hazirlaniyor", "kargolandi", "iptal"],
  hazirlaniyor: ["kargolandi", "iptal"],
  kargolandi: ["teslim-edildi"],
  "teslim-edildi": [],
  iptal: ["onaylandi"],
  "odeme-basarisiz": ["onaylandi", "iptal"],
};

const filters: { value: string; label: string }[] = [
  { value: "", label: "Tümü" },
  { value: "beklemede", label: "Havale bekleyen" },
  { value: "onaylandi", label: "Onaylı" },
  { value: "hazirlaniyor", label: "Hazırlanan" },
  { value: "kargolandi", label: "Kargoda" },
  { value: "teslim-edildi", label: "Teslim" },
  { value: "odeme-bekliyor", label: "Ödeme bekleyen" },
  { value: "iptal", label: "İptal" },
];

export function AdminPanel() {
  const token = useToken();
  const params = useSearchParams();
  const initialNo = params.get("no");

  if (!apiEnabled()) {
    return (
      <section className="container-x py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-espresso-900/10 bg-cream-100 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-espresso-600" />
          <h1 className="mt-3 font-display text-2xl font-semibold">Sipariş API&rsquo;si tanımlı değil</h1>
          <p className="mt-2 text-sm text-espresso-700">
            Yönetim paneli için önce <code className="rounded bg-cream-200 px-1">api/</code> klasöründeki Worker&rsquo;ı yayınlayıp GitHub Variables&rsquo;a <code className="rounded bg-cream-200 px-1">NEXT_PUBLIC_API_URL</code> ekleyin. Bkz. README.
          </p>
        </div>
      </section>
    );
  }
  return token ? <Dashboard token={token} initialNo={initialNo} /> : <Login />;
}

/* --------------------------------- Giriş ---------------------------------- */
function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await admin.login(password);
    if (res.status === "success") session.write(password);
    else setError(res.reason ?? "Giriş başarısız");
    setLoading(false);
  };
  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl border border-espresso-900/10 bg-cream-50 p-8 shadow-lift">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso-900 text-cream-50">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-espresso-900">Umba Yönetim</h1>
        <p className="mt-1 text-sm text-espresso-600">{site.name} · siparişler</p>
        <label className="mt-6 block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Şifre</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus className="mt-2 h-12 w-full rounded-xl border border-espresso-900/10 bg-cream-100 px-4 text-sm focus:border-espresso-900 focus:outline-none" />
        </label>
        {error && <p role="alert" className="mt-3 text-sm font-semibold text-berry-500">{error}</p>}
        <button type="submit" disabled={loading} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-espresso-900 text-sm font-bold text-cream-50 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Giriş yap
        </button>
        <div className="mt-4 flex justify-center">
          <InstallButton label="Paneli uygulama olarak yükle" className="h-9 text-xs" />
        </div>
      </form>
    </section>
  );
}

/* ---------------------------------- Panel --------------------------------- */
function Dashboard({ token, initialNo }: { token: string; initialNo: string | null }) {
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<{ orders: ApiOrder[]; pages: number; total: number } | null>(null);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof admin.stats>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(initialNo);
  const [view, setView] = useState<"orders" | "prices">("orders");
  const logout = useCallback(() => session.write(""), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [list, st] = await Promise.all([admin.list(token, { status, q, page }), admin.stats(token)]);
    if (list.status !== "success") {
      setError(list.reason ?? "Liste alınamadı");
      if (list.reason === "Yetkisiz") session.write("");
    } else setData({ orders: list.orders, pages: list.pages, total: list.total });
    if (st.status === "success") setStats(st);
    setLoading(false);
  }, [token, status, q, page]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const count = (s: OrderStatus) => stats?.byStatus.find((b) => b.status === s)?.n ?? 0;

  return (
    <section className="container-x py-6 sm:py-8">
      <AdminBar token={token} onRefresh={() => void load()} loading={loading} />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-espresso-600">Yönetim</p>
          <h1 className="font-display text-3xl font-semibold text-espresso-900">{view === "orders" ? "Siparişler" : "Fiyatlar"}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" className="inline-flex rounded-full border border-espresso-900/15 p-1 text-xs font-bold">
            {([["orders", "Siparişler"], ["prices", "Fiyatlar"]] as const).map(([k, label]) => (
              <button key={k} type="button" role="tab" aria-selected={view === k} onClick={() => setView(k)} className={cn("rounded-full px-3.5 py-1.5 transition-colors", view === k ? "bg-espresso-900 text-cream-50" : "hover:bg-cream-200")}>
                {label}
              </button>
            ))}
          </div>
          <PushToggle token={token} />
        </div>
      </div>

      {view === "prices" && (<>
        <ShippingCard token={token} onUnauthorized={logout} />
        <PricesPanel token={token} onUnauthorized={logout} />
      </>)}

      {view === "orders" && (<>

      {/* Özet kartları */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { k: "Bugün", v: `${stats?.today.n ?? 0} sipariş`, s: formatPrice(stats?.today.sum ?? 0) },
          { k: "Bu ay", v: `${stats?.month.n ?? 0} sipariş`, s: formatPrice(stats?.month.sum ?? 0) },
          { k: "İşlem bekleyen", v: `${count("beklemede") + count("onaylandi")}`, s: "havale + onaylı" },
          { k: "Hazırlanan / kargoda", v: `${count("hazirlaniyor")} / ${count("kargolandi")}`, s: "sipariş" },
        ].map((c) => (
          <div key={c.k} className="rounded-2xl border border-espresso-900/10 bg-cream-50 p-4">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">{c.k}</p>
            <p className="mt-1 font-display text-2xl font-semibold text-espresso-900">{c.v}</p>
            <p className="text-xs text-espresso-600">{c.s}</p>
          </div>
        ))}
      </div>

      {/* Filtre + arama */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", status === f.value ? "border-espresso-900 bg-espresso-900 text-cream-50" : "border-espresso-900/15 hover:border-espresso-900")}
            >
              {f.label}
              {f.value && <span className="ml-1.5 opacity-70">{count(f.value as OrderStatus)}</span>}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            void load();
          }}
          className="relative lg:w-80"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-600" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Sipariş no, ad, e-posta, takip no…" className="h-10 w-full rounded-full border border-espresso-900/10 bg-cream-50 pl-10 pr-4 text-sm focus:border-espresso-900 focus:outline-none" />
        </form>
      </div>

      {error && <p role="alert" className="mt-4 rounded-xl bg-berry-500/10 px-4 py-3 text-sm font-semibold text-berry-500">{error}</p>}

      {/* Liste */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-espresso-900/10 bg-cream-50">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">
            <tr>
              <th className="px-4 py-3">Sipariş</th>
              <th className="hidden px-4 py-3 md:table-cell">Müşteri</th>
              <th className="hidden px-4 py-3 lg:table-cell">Ödeme</th>
              <th className="px-4 py-3 text-right">Tutar</th>
              <th className="px-4 py-3">Durum</th>
              <th className="hidden px-4 py-3 lg:table-cell">Kargo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso-900/10">
            {data?.orders.map((o) => (
              <tr key={o.orderNo} onClick={() => setSelected(o.orderNo)} className="cursor-pointer transition-colors hover:bg-cream-100">
                <td className="px-4 py-3">
                  <p className="font-mono font-bold text-espresso-900">{o.orderNo}</p>
                  <p className="text-xs text-espresso-600">{formatDate(o.createdAt)}{o.testMode && <span className="ml-1 rounded bg-caramel-300/60 px-1 text-[0.6rem] font-bold">TEST</span>}</p>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <p className="font-semibold">{o.customer.fullName}</p>
                  <p className="text-xs text-espresso-600">{o.customer.city} · {o.customer.phone}</p>
                </td>
                <td className="hidden px-4 py-3 text-xs lg:table-cell">
                  {paymentLabels[o.paymentMethod]}
                  <span className={cn("ml-1 rounded px-1 font-bold", o.paymentStatus === "odendi" ? "bg-leaf-100 text-leaf-500" : o.paymentStatus === "basarisiz" ? "bg-berry-500/10 text-berry-500" : "bg-cream-200")}>{o.paymentStatus}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatPrice(o.totals.total)}</td>
                <td className="px-4 py-3">
                  <span className={cn("whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold", statusTone[o.status])}>{statusLabels[o.status]}</span>
                </td>
                <td className="hidden px-4 py-3 text-xs lg:table-cell">{o.trackingNo ? `${o.carrierName ?? ""} ${o.trackingNo}` : "—"}</td>
              </tr>
            ))}
            {data && data.orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-espresso-600">Bu filtrede sipariş yok.</td>
              </tr>
            )}
            {!data && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-espresso-600"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td>
              </tr>
            )}
          </tbody>
        </table>
        {data && data.pages > 1 && (
          <div className="flex items-center justify-between border-t border-espresso-900/10 px-4 py-3 text-sm">
            <span className="text-espresso-600">{data.total} sipariş · sayfa {page} / {data.pages}</span>
            <div className="flex gap-2">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-espresso-900/15 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              <button type="button" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-espresso-900/15 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>

      </>)}

      {selected && (
        <OrderDrawer
          token={token}
          orderNo={selected}
          onClose={() => setSelected(null)}
          onChanged={() => void load()}
        />
      )}
    </section>
  );
}

/* ------------------------------ Üst çubuk ---------------------------------- */
function AdminBar({ token, onRefresh, loading }: { token: string; onRefresh: () => void; loading: boolean }) {
  void token;
  return (
    <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between gap-3 border-b border-espresso-900/10 bg-cream-50/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/yonetim" className="inline-flex items-center gap-2">
          <LogoImage tone="dark" className="h-7 w-auto" />
          <span className="rounded-full bg-espresso-900 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-cream-50">Yönetim</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <InstallButton label="Uygulama olarak yükle" className="hidden sm:inline-flex" />
        <button type="button" onClick={onRefresh} className="inline-flex h-10 items-center gap-2 rounded-full border border-espresso-900/15 px-3 text-sm font-semibold hover:bg-cream-200 sm:px-4">
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> <span className="hidden sm:inline">Yenile</span>
        </button>
        <Link href="/" className="hidden h-10 items-center rounded-full border border-espresso-900/15 px-4 text-sm font-semibold hover:bg-cream-200 lg:inline-flex">
          Mağaza
        </Link>
        <button type="button" onClick={() => session.write("")} className="inline-flex h-10 items-center gap-2 rounded-full border border-espresso-900/15 px-3 text-sm font-semibold hover:bg-cream-200 sm:px-4">
          <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Çıkış</span>
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Sipariş detayı ----------------------------- */
function OrderDrawer({ token, orderNo, onClose, onChanged }: { token: string; orderNo: string; onClose: () => void; onChanged: () => void }) {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [carrier, setCarrier] = useState("yurtici");
  const [trackingNo, setTrackingNo] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [note, setNote] = useState("");
  const [loadedFor, setLoadedFor] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await admin.get(token, orderNo);
    if (res.status === "success" && res.order) setOrder(res.order);
    else setError(res.reason ?? "Sipariş yüklenemedi");
  }, [token, orderNo]);

  useEffect(() => {
    const t = window.setTimeout(() => void refresh(), 0);
    return () => window.clearTimeout(t);
  }, [refresh]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Form alanlarını sipariş ilk yüklendiğinde doldur (render sırasında, effect'siz)
  if (order && loadedFor !== order.orderNo) {
    setLoadedFor(order.orderNo);
    setCarrier(order.carrier ?? "yurtici");
    setTrackingNo(order.trackingNo ?? "");
    setTrackingUrl(order.carrier ? "" : (order.trackingUrl ?? ""));
    setNote(order.adminNote ?? "");
  }

  const patch = async (p: Parameters<typeof admin.update>[2]) => {
    setBusy(true);
    setError(null);
    const res = await admin.update(token, orderNo, p);
    if (res.status === "success" && res.order) {
      setOrder(res.order);
      onChanged();
    } else setError(res.reason ?? "Güncellenemedi");
    setBusy(false);
  };

  const c = order?.customer;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-espresso-950/50" onClick={onClose} />
      <aside role="dialog" aria-modal="true" aria-label={`Sipariş ${orderNo}`} className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-y-auto bg-cream-50 shadow-lift">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-espresso-900/10 bg-cream-50/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="font-mono text-lg font-bold text-espresso-900">{orderNo}</p>
            {order && <p className="text-xs text-espresso-600">{formatDate(order.createdAt)} · {paymentLabels[order.paymentMethod]}{order.testMode ? " · TEST" : ""}</p>}
          </div>
          <div className="flex items-center gap-2">
            {order && <span className={cn("rounded-full px-3 py-1.5 text-xs font-bold", statusTone[order.status])}>{statusLabels[order.status]}</span>}
            <button type="button" onClick={onClose} aria-label="Kapat" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200"><X className="h-5 w-5" /></button>
          </div>
        </div>

        {!order ? (
          <div className="flex flex-1 items-center justify-center p-10">{error ? <p className="text-berry-500">{error}</p> : <Loader2 className="h-6 w-6 animate-spin" />}</div>
        ) : (
          <div className="space-y-6 p-6">
            {error && <p role="alert" className="rounded-xl bg-berry-500/10 px-4 py-3 text-sm font-semibold text-berry-500">{error}</p>}

            {/* Durum */}
            <div className="rounded-2xl border border-espresso-900/10 p-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">Durumu güncelle</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(nextSteps[order.status] ?? []).map((s) => (
                  <button key={s} type="button" disabled={busy} onClick={() => void patch({ status: s })} className={cn("rounded-full px-4 py-2 text-sm font-bold transition-colors disabled:opacity-50", s === "iptal" ? "border border-berry-500/40 text-berry-500 hover:bg-berry-500/10" : "bg-espresso-900 text-cream-50 hover:bg-espresso-800")}>
                    {s === "onaylandi" && order.paymentMethod === "havale" && order.paymentStatus !== "odendi" ? "Havale geldi, onayla" : statusLabels[s]}
                  </button>
                ))}
                <details className="ml-auto">
                  <summary className="cursor-pointer rounded-full border border-espresso-900/15 px-3 py-2 text-xs font-semibold">Diğer</summary>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {orderStatuses.filter((s) => s !== order.status).map((s) => (
                      <button key={s} type="button" disabled={busy} onClick={() => void patch({ status: s })} className="rounded-full border border-espresso-900/15 px-2.5 py-1 text-xs font-semibold hover:bg-cream-200">{statusLabels[s]}</button>
                    ))}
                  </div>
                </details>
              </div>
            </div>

            {/* Kargo */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void patch({ carrier, trackingNo, trackingUrl: carrier === "diger" ? trackingUrl : "" });
              }}
              className="rounded-2xl border border-espresso-900/10 p-5"
            >
              <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600"><Truck className="h-3.5 w-3.5" /> Kargo bilgisi</p>
              <div className="mt-3 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-[10rem_1fr_auto]">
                <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="h-11 rounded-xl border border-espresso-900/10 bg-cream-100 px-3 text-sm">
                  {Object.entries(carriers).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="Takip numarası" className="h-11 rounded-xl border border-espresso-900/10 bg-cream-100 px-3 font-mono text-sm" />
                <button type="submit" disabled={busy} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-espresso-900 px-4 text-sm font-bold text-cream-50 disabled:opacity-50"><Save className="h-4 w-4" /> Kaydet</button>
              </div>
              {carrier === "diger" && <input value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} placeholder="Takip bağlantısı (https://…)" className="mt-3 h-11 w-full rounded-xl border border-espresso-900/10 bg-cream-100 px-3 text-sm" />}
              <p className="mt-2 text-xs text-espresso-600">Takip numarası girince durum otomatik &ldquo;Kargoya verildi&rdquo; olur; müşteri takip sayfasında kargo bağlantısını görür.</p>
              {order.trackingUrl && (
                <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4">Kargo takip sayfası <ExternalLink className="h-3 w-3" /></a>
              )}
            </form>

            {/* Müşteri + ürünler */}
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-espresso-900/10 p-5 text-sm">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">Müşteri</p>
                <p className="mt-2 font-bold">{c?.fullName}</p>
                <p className="mt-1 flex items-center gap-2"><Phone className="h-3.5 w-3.5" /><a href={`tel:${c?.phone}`} className="underline underline-offset-2">{c?.phone}</a></p>
                <p className="mt-1 flex items-center gap-2"><Mail className="h-3.5 w-3.5" /><a href={`mailto:${c?.email}`} className="truncate underline underline-offset-2">{c?.email}</a></p>
                <p className="mt-1 flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span>{c?.address}, {c?.district} / {c?.city} {c?.postalCode}</span></p>
                {c?.invoiceType === "kurumsal" && <p className="mt-2 text-xs">Fatura: {c.companyName} · {c.taxOffice} · VKN {c.taxNo}</p>}
                {c?.note && <p className="mt-2 rounded-lg bg-caramel-300/30 px-3 py-2 text-xs">Müşteri notu: {c.note}</p>}
                <a href={`https://wa.me/${(c?.phone ?? "").replace(/\D/g, "").replace(/^0/, "90")}?text=${encodeURIComponent(`Merhaba ${c?.fullName}, ${orderNo} numaralı Umba siparişiniz hakkında: `)}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex h-9 items-center rounded-full bg-[#25D366] px-3 text-xs font-bold text-white">WhatsApp&rsquo;tan yaz</a>
              </div>
              <div className="rounded-2xl border border-espresso-900/10 p-5 text-sm">
                <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600"><CreditCard className="h-3.5 w-3.5" /> Ödeme</p>
                <p className="mt-2">{paymentLabels[order.paymentMethod]} · <span className="font-bold">{order.paymentStatus}</span>{order.paidAmount ? ` · ${formatPrice(order.paidAmount)} tahsil edildi` : ""}</p>
                <ul className="mt-3 divide-y divide-espresso-900/10">
                  {order.lines.map((l, i) => (
                    <li key={i} className="flex justify-between gap-2 py-1.5"><span>{l.name} <span className="text-espresso-600">× {l.quantity}</span></span><span className="font-semibold">{formatPrice(l.lineTotal)}</span></li>
                  ))}
                </ul>
                <dl className="mt-2 border-t border-espresso-900/10 pt-2 text-xs">
                  <div className="flex justify-between"><dt>Kargo</dt><dd>{formatPrice(order.totals.shipping)}</dd></div>
                  {order.totals.discount > 0 && <div className="flex justify-between text-leaf-500"><dt>Sepet indirimi</dt><dd>-{formatPrice(order.totals.discount)}</dd></div>}
                  <div className="flex justify-between text-sm font-bold"><dt>Toplam</dt><dd>{formatPrice(order.totals.total)}</dd></div>
                </dl>
              </div>
            </div>

            {/* Not */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void patch({ adminNote: note });
              }}
              className="rounded-2xl border border-espresso-900/10 p-5"
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">İç not (müşteri görmez)</p>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-espresso-900/10 bg-cream-100 px-3 py-2 text-sm" />
              <button type="submit" disabled={busy} className="mt-2 inline-flex h-9 items-center gap-2 rounded-full border border-espresso-900/15 px-3 text-xs font-bold hover:bg-cream-200 disabled:opacity-50"><Save className="h-3.5 w-3.5" /> Notu kaydet</button>
            </form>

            <div className="rounded-2xl border border-espresso-900/10 p-5">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">Geçmiş</p>
              <div className="mt-3"><OrderTimeline order={order} /></div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
