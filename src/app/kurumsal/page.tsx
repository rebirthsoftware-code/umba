import type { Metadata } from "next";
import { BadgePercent, Package, Truck, GraduationCap, FileText, Handshake, Check } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kurumsal Satış & Bayilik",
  description:
    "Kafe, otel, restoran ve zincirler için Umba Coffee kurumsal fiyat listesi, HoReCa ambalajları, numune ve bayilik başvurusu.",
  alternates: { canonical: "/kurumsal" },
};

const perks = [
  { icon: BadgePercent, title: "Kademeli fiyatlandırma", text: "Aylık tüketiminize göre liste fiyatının %15–35 altında kurumsal fiyatlar." },
  { icon: Package, title: "HoReCa ambalajları", text: "3 kg sos ve toz ambalajları, 750 ml şurup ve koli bazlı sipariş seçenekleri." },
  { icon: Truck, title: "Düzenli teslimat", text: "Haftalık veya aylık planlı teslimat; İstanbul içi kendi araçlarımızla." },
  { icon: GraduationCap, title: "Barista eğitimi", text: "Yeni menü için personel eğitimi, dozaj tabloları ve tarif kartları." },
  { icon: FileText, title: "Vadeli ödeme", text: "Onaylı kurumsal müşterilere 30 güne kadar vade ve e-fatura." },
  { icon: Handshake, title: "Bayilik", text: "Bölgenizde Umba bayisi olun; stok, pazarlama ve eğitim desteği bizden." },
];

const steps = [
  "Aşağıdaki formu doldurun veya bizi arayın.",
  "1 iş günü içinde kurumsal fiyat listesi ve ücretsiz numune planı iletiyoruz.",
  "Numuneleri deneyin, menünüze uygun ürünleri birlikte seçelim.",
  "İlk siparişinizde kurulum desteği ve tarif kartları ile başlayın.",
];

export default function B2BPage() {
  return (
    <>
      <PageHero
        eyebrow="Kurumsal satış & bayilik"
        title="İşletmeniz için tek tedarikçi, tek fatura."
        description="Kafeler, oteller, restoranlar ve zincirler için özel fiyatlar, HoReCa ambalajları ve barista desteği. Bölgesel bayilik başvuruları da bu sayfadan."
        crumbs={[{ label: "Kurumsal" }]}
      />

      <section className="container-x py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-espresso-900/5 bg-cream-50 p-6 shadow-card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-caramel-500/15 text-caramel-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-espresso-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-espresso-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-espresso-950 py-14 text-cream-50">
        <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHeading tone="light" eyebrow="Nasıl çalışır?" title="Dört adımda kurumsal müşteri olun." />
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-4 rounded-2xl border border-cream-50/10 bg-cream-50/5 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-caramel-500 font-display text-lg font-semibold text-espresso-950">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-cream-200">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow="Teklif formu"
            title="Fiyat listesi ve numune isteyin."
            description="Formu doldurun; kurumsal satış ekibimiz 1 iş günü içinde dönüş yapsın."
          />
          <ul className="mt-6 space-y-2 text-sm text-espresso-700">
            {["Ücretsiz numune seti (6 ürüne kadar)", "Menü ve dozaj danışmanlığı", "Özel etiketli (private label) üretim seçeneği"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-leaf-500" /> {t}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-espresso-700">
            Telefonla ulaşmak isterseniz: <a href={`tel:${site.contact.phoneHref}`} className="font-bold text-espresso-900">{site.contact.phone}</a>
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-espresso-900/10 bg-cream-100 p-6 sm:p-8 lg:col-span-7">
          <ContactForm type="kurumsal" />
        </div>
      </section>
    </>
  );
}
