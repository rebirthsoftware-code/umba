import { ArrowRight, Building2, Coffee, Hotel, Store } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function B2BBand() {
  return (
    <section className="container-x py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-espresso-900 px-6 py-12 text-cream-50 shadow-lift sm:px-12 lg:px-16 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-caramel-500/30 blur-3xl"
        />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-caramel-300">Kurumsal satış & bayilik</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl lg:text-5xl">
              Kafe, otel ve zincirler için özel fiyat listesi.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-cream-200">
              Aylık tüketiminize göre kademeli fiyatlandırma, 3 kg HoReCa ambalajları, vadeli ödeme ve ücretsiz numune.
              Bölgenizde bayi olmak için de başvurabilirsiniz.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/kurumsal" variant="primary" size="lg">
                Teklif iste <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/iletisim" variant="light" size="lg">
                Bize ulaşın
              </Button>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 lg:col-span-5">
            {[
              { icon: Coffee, label: "Kafeler & Kahve zincirleri" },
              { icon: Hotel, label: "Oteller & Restoranlar" },
              { icon: Store, label: "Pastane & Büfeler" },
              { icon: Building2, label: "Ofis & Toplu tüketim" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="rounded-3xl border border-cream-50/10 bg-cream-50/5 p-5 backdrop-blur">
                <Icon className="h-6 w-6 text-caramel-300" />
                <p className="mt-3 text-sm font-semibold leading-snug">{label}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
