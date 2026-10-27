"use client";
import Link from "next/link";

import { useState, type FormEvent } from "react";
import { Loader2, Send, CheckCircle2, AlertCircle, Mail } from "lucide-react";
import { cn } from "@/lib/format";
import { submitForm, formsEnabled, mailtoUrl, whatsappUrl } from "@/lib/forms";
import { site } from "@/lib/site";

const inputCls =
  "h-12 w-full rounded-2xl border border-espresso-900/15 bg-cream-50 px-4 text-sm text-espresso-900 placeholder:text-espresso-600/60 focus:border-caramel-500 focus:outline-none focus:ring-4 focus:ring-caramel-500/15";

type Props = { type: "iletisim" | "kurumsal" };

export function ContactForm({ type }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error" | "mailto">("idle");
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    businessType: "",
    monthlyVolume: "",
    message: "",
    website: "",
  });
  const set = (k: keyof typeof values, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const composeText = () =>
    [
      type === "kurumsal" ? "Kurumsal teklif talebi" : "İletişim formu",
      `Ad: ${values.name}`,
      values.company && `İşletme: ${values.company}`,
      `E-posta: ${values.email}`,
      values.phone && `Telefon: ${values.phone}`,
      values.city && `Şehir: ${values.city}`,
      values.businessType && `İşletme türü: ${values.businessType}`,
      values.monthlyVolume && `Aylık tüketim: ${values.monthlyVolume}`,
      "",
      values.message,
    ]
      .filter((l): l is string => typeof l === "string")
      .join("\n");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (values.website) return; // bal küpü
    setState("loading");
    if (formsEnabled()) {
      const ok = await submitForm({
        subject: type === "kurumsal" ? `Kurumsal teklif talebi · ${values.company || values.name}` : `İletişim formu · ${values.name}`,
        from_name: values.name,
        type,
        ...values,
      });
      setState(ok ? "done" : "error");
      return;
    }
    // Form servisi yoksa e-posta uygulamasını aç
    window.location.href = mailtoUrl(
      type === "kurumsal" ? `Kurumsal teklif talebi – ${values.company || values.name}` : `İletişim – ${values.name}`,
      composeText(),
    );
    setState("mailto");
  };

  if (state === "mailto") {
    return (
      <div className="rounded-3xl bg-cream-200 p-8 text-center">
        <Mail className="mx-auto h-10 w-10 text-caramel-700" />
        <h3 className="mt-3 font-display text-2xl font-semibold text-espresso-900">E-posta uygulamanız açıldı</h3>
        <p className="mt-2 text-sm text-espresso-700">
          Mesajınız hazır; göndermeniz yeterli. Uygulama açılmadıysa WhatsApp üzerinden de iletebilirsiniz.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappUrl(composeText())}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-bold text-white"
          >
            WhatsApp ile gönder
          </a>
          <a href={`mailto:${site.contact.email}`} className="inline-flex h-11 items-center rounded-full border border-espresso-900/20 px-5 text-sm font-semibold">
            {site.contact.email}
          </a>
        </div>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="rounded-3xl bg-leaf-100 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-leaf-500" />
        <h3 className="mt-3 font-display text-2xl font-semibold text-espresso-900">Mesajınız bize ulaştı</h3>
        <p className="mt-2 text-sm text-espresso-700">
          {type === "kurumsal"
            ? "Kurumsal satış ekibimiz 1 iş günü içinde fiyat listesi ve numune bilgisiyle dönüş yapacak."
            : "En kısa sürede size dönüş yapacağız. Teşekkürler!"}
        </p>
      </div>
    );
  }

  const isB2B = type === "kurumsal";

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div className={cn(!isB2B && "sm:col-span-2")}>
        <label htmlFor="c-name" className="mb-1.5 block text-sm font-semibold">Ad Soyad</label>
        <input id="c-name" required className={inputCls} value={values.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
      </div>
      {isB2B && (
        <div>
          <label htmlFor="c-company" className="mb-1.5 block text-sm font-semibold">İşletme adı</label>
          <input id="c-company" required className={inputCls} value={values.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" />
        </div>
      )}
      <div>
        <label htmlFor="c-email" className="mb-1.5 block text-sm font-semibold">E-posta</label>
        <input id="c-email" type="email" required className={inputCls} value={values.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
      </div>
      <div>
        <label htmlFor="c-phone" className="mb-1.5 block text-sm font-semibold">Telefon</label>
        <input id="c-phone" type="tel" className={inputCls} value={values.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="05xx xxx xx xx" />
      </div>
      {isB2B && (
        <>
          <div>
            <label htmlFor="c-city" className="mb-1.5 block text-sm font-semibold">Şehir</label>
            <input id="c-city" className={inputCls} value={values.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div>
            <label htmlFor="c-type" className="mb-1.5 block text-sm font-semibold">İşletme türü</label>
            <select id="c-type" className={inputCls} value={values.businessType} onChange={(e) => set("businessType", e.target.value)}>
              <option value="">Seçin</option>
              <option>Kafe / Kahve dükkânı</option>
              <option>Zincir kafe</option>
              <option>Otel / Restoran</option>
              <option>Pastane / Büfe</option>
              <option>Toptancı / Bayi</option>
              <option>Ofis / Kurum</option>
              <option>Diğer</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="c-vol" className="mb-1.5 block text-sm font-semibold">Tahmini aylık tüketim</label>
            <select id="c-vol" className={inputCls} value={values.monthlyVolume} onChange={(e) => set("monthlyVolume", e.target.value)}>
              <option value="">Seçin</option>
              <option>10 ürüne kadar</option>
              <option>10–50 ürün</option>
              <option>50–200 ürün</option>
              <option>200+ ürün / palet</option>
            </select>
          </div>
        </>
      )}
      <div className="sm:col-span-2">
        <label htmlFor="c-msg" className="mb-1.5 block text-sm font-semibold">
          {isB2B ? "İlgilendiğiniz ürünler ve notlarınız" : "Mesajınız"}
        </label>
        <textarea id="c-msg" required rows={5} className={cn(inputCls, "h-auto py-3")} value={values.message} onChange={(e) => set("message", e.target.value)} />
      </div>
      {/* bal küpü */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} className="hidden" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-espresso-900 px-7 text-sm font-bold text-cream-50 hover:bg-espresso-800 disabled:opacity-60"
        >
          {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isB2B ? "Teklif iste" : "Gönder"}
        </button>
        {state === "error" && (
          <p className="flex items-center gap-1.5 text-sm font-semibold text-berry-500">
            <AlertCircle className="h-4 w-4" /> Gönderilemedi, lütfen tekrar deneyin.
          </p>
        )}
        <p className="text-xs text-espresso-600">
          Formu göndererek <Link href="/kvkk" className="underline">KVKK Aydınlatma Metni</Link>&apos;ni kabul etmiş olursunuz.
        </p>
      </div>
    </form>
  );
}
