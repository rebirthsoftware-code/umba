"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Save, Search, RotateCcw, Percent, Check, AlertCircle, Truck } from "lucide-react";
import { admin, type PriceRow } from "@/lib/api";
import { categories } from "@/lib/categories";
import { formatPrice, cn } from "@/lib/format";
import { normalizePrice, normalizeAmount } from "@/lib/prices";

/**
 * Yönetim → Fiyatlar: tüm ürün/varyant fiyatları tek tablodan düzenlenir.
 * Kaydedilen fiyatlar veritabanına yazılır; mağaza sayfaları anında yenilenir.
 */
export function PricesPanel({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [rows, setRows] = useState<PriceRow[] | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [category, setCategory] = useState("");
  const [q, setQ] = useState("");
  const [pct, setPct] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    setBusy(true);
    const res = await admin.prices(token);
    if (res.status !== "success") {
      setMsg({ tone: "err", text: res.reason ?? "Fiyatlar alınamadı" });
      if (res.reason === "Yetkisiz") onUnauthorized();
    } else {
      setRows(res.rows);
      setDraft({});
    }
    setBusy(false);
  }, [token, onUnauthorized]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const needle = q.trim().toLocaleLowerCase("tr-TR");
    return rows.filter((r) => (!category || r.category === category) && (!needle || `${r.name} ${r.label} ${r.sku}`.toLocaleLowerCase("tr-TR").includes(needle)));
  }, [rows, category, q]);

  const dirty = useMemo(() => {
    if (!rows) return [];
    const bySku = new Map(rows.map((r) => [r.sku, r]));
    const out: { sku: string; price: number | null }[] = [];
    for (const [sku, val] of Object.entries(draft)) {
      const row = bySku.get(sku);
      if (!row) continue;
      if (val === "") {
        if (row.overridden) out.push({ sku, price: null });
        continue;
      }
      const n = normalizePrice(val);
      if (n !== null && n !== row.price) out.push({ sku, price: n });
    }
    return out;
  }, [draft, rows]);

  const invalidCount = useMemo(() => Object.values(draft).filter((v) => v !== "" && normalizePrice(v) === null).length, [draft]);

  const applyPct = () => {
    const p = Number(pct.replace(",", "."));
    if (!Number.isFinite(p) || p === 0) return;
    const next = { ...draft };
    for (const r of visible) {
      const cur = normalizePrice(draft[r.sku] ?? "") ?? r.price;
      // 0,10 ₺ hassasiyetine yuvarla
      next[r.sku] = (Math.round((cur * (1 + p / 100)) * 10) / 10).toFixed(2);
    }
    setDraft(next);
  };

  const save = async () => {
    if (!dirty.length) return;
    setBusy(true);
    setMsg(null);
    const res = await admin.savePrices(token, dirty);
    if (res.status !== "success") {
      setMsg({ tone: "err", text: res.reason ?? "Kaydedilemedi" });
      if (res.reason === "Yetkisiz") onUnauthorized();
    } else {
      setRows(res.rows);
      setDraft({});
      setMsg({ tone: "ok", text: `${res.saved} fiyat güncellendi${res.reset ? `, ${res.reset} fiyat katalog değerine döndü` : ""}. Mağaza sayfaları yenilendi.` });
    }
    setBusy(false);
  };

  const overriddenCount = rows?.filter((r) => r.overridden).length ?? 0;

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {[{ slug: "", name: "Tümü" }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setCategory(c.slug)}
              className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", category === c.slug ? "border-espresso-900 bg-espresso-900 text-cream-50" : "border-espresso-900/15 hover:border-espresso-900")}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-600" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün adı veya SKU…" className="h-10 w-full rounded-full border border-espresso-900/10 bg-cream-50 pl-10 pr-4 text-sm focus:border-espresso-900 focus:outline-none" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-espresso-900/10 bg-cream-100 p-3 text-sm">
        <span className="flex items-center gap-1.5 font-semibold"><Percent className="h-4 w-4" /> Listedeki {visible.length} ürüne toplu oran uygula</span>
        <input value={pct} onChange={(e) => setPct(e.target.value)} inputMode="decimal" placeholder="örn. 10 veya -5" className="h-9 w-32 rounded-lg border border-espresso-900/10 bg-cream-50 px-3 text-sm focus:border-espresso-900 focus:outline-none" />
        <button type="button" onClick={applyPct} className="h-9 rounded-full border border-espresso-900/15 px-4 text-xs font-bold hover:bg-cream-200">Uygula</button>
        <button type="button" onClick={() => setDraft({})} disabled={!Object.keys(draft).length} className="h-9 rounded-full px-3 text-xs font-semibold text-espresso-700 underline underline-offset-4 disabled:opacity-40">Taslağı temizle</button>
        <span className="ml-auto text-xs text-espresso-600">{overriddenCount} üründe özel fiyat tanımlı</span>
      </div>

      {msg && (
        <p role="status" className={cn("mt-4 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold", msg.tone === "ok" ? "bg-leaf-500/10 text-leaf-500" : "bg-berry-500/10 text-berry-500")}>
          {msg.tone === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {msg.text}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl border border-espresso-900/10 bg-cream-50">
        <table className="w-full text-sm">
          <thead className="bg-cream-100 text-left text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">
            <tr>
              <th className="px-4 py-3">Ürün</th>
              <th className="hidden px-4 py-3 md:table-cell">SKU</th>
              <th className="hidden px-4 py-3 text-right sm:table-cell">Katalog</th>
              <th className="px-4 py-3 text-right">Satış fiyatı (₺)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-espresso-900/10">
            {!rows && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-espresso-600"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr>
            )}
            {rows && visible.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-10 text-center text-espresso-600">Sonuç yok.</td></tr>
            )}
            {visible.map((r) => {
              const val = draft[r.sku];
              const editing = val !== undefined;
              const bad = editing && val !== "" && normalizePrice(val) === null;
              return (
                <tr key={r.sku} className={cn(editing && "bg-caramel-300/10")}>
                  <td className="px-4 py-2.5">
                    <p className="font-semibold text-espresso-900">{r.name}</p>
                    <p className="text-xs text-espresso-600">{r.label}{r.overridden && <span className="ml-2 rounded-full bg-espresso-900 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-cream-50">özel</span>}</p>
                  </td>
                  <td className="hidden px-4 py-2.5 font-mono text-xs text-espresso-600 md:table-cell">{r.sku}</td>
                  <td className="hidden px-4 py-2.5 text-right tabular-nums text-espresso-600 sm:table-cell">{formatPrice(r.basePrice)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      <input
                        value={editing ? val : r.price.toFixed(2)}
                        onChange={(e) => setDraft((d) => ({ ...d, [r.sku]: e.target.value }))}
                        inputMode="decimal"
                        aria-label={`${r.name} ${r.label} fiyatı`}
                        className={cn("h-9 w-28 rounded-lg border bg-cream-50 px-3 text-right text-sm tabular-nums focus:outline-none", bad ? "border-berry-500" : "border-espresso-900/10 focus:border-espresso-900")}
                      />
                      {r.overridden && (
                        <button type="button" title="Katalog fiyatına dön" onClick={() => setDraft((d) => ({ ...d, [r.sku]: "" }))} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-espresso-900/15 hover:bg-cream-200">
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-0 mt-4 flex items-center justify-between gap-3 rounded-2xl border border-espresso-900/10 bg-cream-50/95 p-3 backdrop-blur">
        <p className="text-sm text-espresso-700">
          {dirty.length ? <strong>{dirty.length} değişiklik</strong> : "Değişiklik yok"}
          {invalidCount > 0 && <span className="ml-2 text-berry-500">{invalidCount} geçersiz değer</span>}
        </p>
        <button type="button" onClick={() => void save()} disabled={busy || !dirty.length || invalidCount > 0} className="inline-flex h-11 items-center gap-2 rounded-full bg-espresso-900 px-5 text-sm font-bold text-cream-50 disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Fiyatları kaydet
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Kargo ayarları ------------------------------ */
export function ShippingCard({ token, onUnauthorized }: { token: string; onUnauthorized: () => void }) {
  const [fee, setFee] = useState("");
  const [limit, setLimit] = useState("");
  const [saved, setSaved] = useState<{ shippingFee: number; freeShippingThreshold: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    const t = window.setTimeout(async () => {
      const res = await admin.settings(token);
      if (!alive) return;
      if (res.status !== "success") {
        setMsg({ tone: "err", text: res.reason ?? "Ayarlar alınamadı" });
        if (res.reason === "Yetkisiz") onUnauthorized();
        return;
      }
      setSaved(res.commerce);
      setFee(res.commerce.shippingFee.toFixed(2));
      setLimit(res.commerce.freeShippingThreshold.toFixed(2));
    }, 0);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [token, onUnauthorized]);

  const feeN = normalizeAmount(fee);
  const limitN = normalizeAmount(limit);
  const valid = feeN !== null && limitN !== null;
  const dirty = saved !== null && valid && (feeN !== saved.shippingFee || limitN !== saved.freeShippingThreshold);

  const save = async () => {
    if (!valid || !dirty) return;
    setBusy(true);
    setMsg(null);
    const res = await admin.saveSettings(token, { shippingFee: feeN, freeShippingThreshold: limitN });
    if (res.status !== "success") {
      setMsg({ tone: "err", text: res.reason ?? "Kaydedilemedi" });
      if (res.reason === "Yetkisiz") onUnauthorized();
    } else {
      setSaved(res.commerce);
      setMsg({ tone: "ok", text: "Kargo ayarları kaydedildi; mağaza sayfaları yenilendi." });
    }
    setBusy(false);
  };

  return (
    <div className="mt-6 rounded-2xl border border-espresso-900/10 bg-cream-50 p-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="mr-auto">
          <p className="flex items-center gap-2 font-display text-xl font-semibold text-espresso-900"><Truck className="h-5 w-5" /> Kargo</p>
          <p className="mt-1 text-xs text-espresso-600">Ücretsiz kargo limitinin altındaki siparişlere kargo ücreti eklenir. Limit 0 ise her sipariş ücretsiz kargo.</p>
        </div>
        <label className="block">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">Kargo ücreti (₺)</span>
          <input value={fee} onChange={(e) => setFee(e.target.value)} inputMode="decimal" disabled={!saved} className={cn("mt-1 h-10 w-36 rounded-lg border bg-cream-50 px-3 text-right text-sm tabular-nums focus:outline-none", feeN === null ? "border-berry-500" : "border-espresso-900/10 focus:border-espresso-900")} />
        </label>
        <label className="block">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">Ücretsiz kargo limiti (₺)</span>
          <input value={limit} onChange={(e) => setLimit(e.target.value)} inputMode="decimal" disabled={!saved} className={cn("mt-1 h-10 w-36 rounded-lg border bg-cream-50 px-3 text-right text-sm tabular-nums focus:outline-none", limitN === null ? "border-berry-500" : "border-espresso-900/10 focus:border-espresso-900")} />
        </label>
        <button type="button" onClick={() => void save()} disabled={busy || !dirty} className="inline-flex h-10 items-center gap-2 rounded-full bg-espresso-900 px-5 text-sm font-bold text-cream-50 disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Kaydet
        </button>
      </div>
      {saved && (
        <p className="mt-3 text-xs text-espresso-600">Şu an: {formatPrice(saved.freeShippingThreshold)} ve üzeri ücretsiz, altında {formatPrice(saved.shippingFee)}.</p>
      )}
      {msg && (
        <p role="status" className={cn("mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold", msg.tone === "ok" ? "bg-leaf-500/10 text-leaf-500" : "bg-berry-500/10 text-berry-500")}>
          {msg.tone === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {msg.text}
        </p>
      )}
    </div>
  );
}
