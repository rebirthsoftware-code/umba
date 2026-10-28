"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2, Lock, FlaskConical } from "lucide-react";
import type { OrderRecord } from "@/lib/order";
import { completeDemoPayment } from "@/lib/api";
import { formatPrice } from "@/lib/format";

/**
 * Demo kart ödemesi: PayTR anahtarları girilene kadar ödeme akışını simüle eder.
 * Kart bilgisi hiçbir yere gönderilmez; yalnızca sipariş "ödendi" olarak işaretlenir.
 */
export function DemoCardForm({ order }: { order: OrderRecord }) {
  const router = useRouter();
  const [card, setCard] = useState("4355 0840 0000 0016");
  const [name, setName] = useState(order.customer.fullName);
  const [exp, setExp] = useState("12/30");
  const [cvv, setCvv] = useState("000");
  const [busy, setBusy] = useState<"ok" | "fail" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (approve: boolean) => {
    setBusy(approve ? "ok" : "fail");
    setError(null);
    const res = await completeDemoPayment(order.orderNo, approve);
    if (res.status !== "success") {
      setError(res.reason ?? "Ödeme tamamlanamadı");
      setBusy(null);
      return;
    }
    router.push(approve ? `/odeme/basarili?no=${encodeURIComponent(order.orderNo)}` : `/odeme/basarisiz?no=${encodeURIComponent(order.orderNo)}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submit(true);
  };

  const fmtCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const fmtExp = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/, "$1/");

  return (
    <div className="overflow-hidden rounded-2xl border border-espresso-900/10 bg-cream-50 shadow-card">
      <div className="flex items-center justify-between border-b border-espresso-900/10 bg-cream-100 px-5 py-3 text-xs font-semibold text-espresso-700">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-leaf-500" /> Güvenli kart ödemesi
        </span>
        <span className="font-mono">{order.orderNo}</span>
      </div>
      <div className="flex items-start gap-3 bg-caramel-300/30 px-5 py-3 text-xs text-espresso-800">
        <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <span className="font-bold">DEMO MODU.</span> PayTR sanal POS henüz bağlanmadı; bu ekran ödeme akışını simüle eder. Kart bilgileri hiçbir yere gönderilmez, kartınızdan para çekilmez. Sipariş yine sisteme düşer ve yönetim panelinde TEST etiketiyle görünür.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 p-5 sm:p-6">
        <div className="rounded-2xl bg-espresso-900 p-5 text-cream-50 shadow-lift">
          <div className="flex items-center justify-between">
            <CreditCard className="h-6 w-6 opacity-80" />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] opacity-70">Demo kart</span>
          </div>
          <p className="mt-6 font-mono text-xl tracking-[0.12em]">{card || "•••• •••• •••• ••••"}</p>
          <div className="mt-3 flex justify-between text-xs uppercase opacity-80">
            <span className="truncate">{name || "AD SOYAD"}</span>
            <span>{exp || "AA/YY"}</span>
          </div>
        </div>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Kart numarası</span>
          <input value={card} onChange={(e) => setCard(fmtCard(e.target.value))} inputMode="numeric" autoComplete="off" required className="mt-2 h-12 w-full rounded-xl border border-espresso-900/10 bg-cream-100 px-4 font-mono text-sm focus:border-espresso-900 focus:outline-none" />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Kart üzerindeki ad</span>
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" required className="mt-2 h-12 w-full rounded-xl border border-espresso-900/10 bg-cream-100 px-4 text-sm focus:border-espresso-900 focus:outline-none" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Son kullanma</span>
            <input value={exp} onChange={(e) => setExp(fmtExp(e.target.value))} placeholder="AA/YY" inputMode="numeric" autoComplete="off" required className="mt-2 h-12 w-full rounded-xl border border-espresso-900/10 bg-cream-100 px-4 font-mono text-sm focus:border-espresso-900 focus:outline-none" />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">CVV</span>
            <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" autoComplete="off" required className="mt-2 h-12 w-full rounded-xl border border-espresso-900/10 bg-cream-100 px-4 font-mono text-sm focus:border-espresso-900 focus:outline-none" />
          </label>
        </div>
        {error && <p role="alert" className="rounded-xl bg-berry-500/10 px-4 py-3 text-sm font-semibold text-berry-500">{error}</p>}
        <button type="submit" disabled={busy !== null} className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-espresso-900 text-base font-bold text-cream-50 hover:bg-espresso-800 disabled:opacity-60">
          {busy === "ok" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />} {formatPrice(order.totals.total)} öde (demo)
        </button>
        <button type="button" disabled={busy !== null} onClick={() => void submit(false)} className="inline-flex h-10 w-full items-center justify-center rounded-full text-xs font-semibold text-espresso-600 underline underline-offset-4 disabled:opacity-60">
          {busy === "fail" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Başarısız ödemeyi simüle et"}
        </button>
      </form>
    </div>
  );
}
