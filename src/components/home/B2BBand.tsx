import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Spotlight } from "@/components/ui/Spotlight";

export function B2BBand() {
  return (
    <section className="container-x pb-24 pt-4 sm:pb-32">
      <Reveal direction="scale">
        <Spotlight className="grain relative overflow-hidden rounded-[1.75rem] bg-espresso-950 px-6 py-14 text-cream-50 sm:px-12 lg:px-16 lg:py-20">
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-caramel-300">Kurumsal satış & bayilik</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-balance sm:text-5xl lg:text-6xl">
                Kafe, otel ve zincirler için <span className="accent-italic text-caramel-300">özel fiyat listesi.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-cream-200/85">
                Aylık tüketiminize göre kademeli fiyatlandırma, 3 kg HoReCa ambalajları, vadeli ödeme ve ücretsiz numune. Bölgenizde bayi olmak için de başvurabilirsiniz.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <Button href="/kurumsal" variant="accent" size="lg">
                Teklif iste <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/iletisim" variant="light" size="lg">
                Bize ulaşın
              </Button>
            </div>
          </div>
        </Spotlight>
      </Reveal>
    </section>
  );
}
