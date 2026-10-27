import { Factory, FlaskConical, Truck, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const reasons = [
  {
    icon: Factory,
    title: "Kendi üretimimiz",
    text: "Şurup, sos, püre ve tozlar kendi tesisimizde; kahveler küçük partiler hâlinde kavruluyor. Aracı yok, fiyat ve kalite kontrolü bizde.",
  },
  {
    icon: FlaskConical,
    title: "Barista testinden geçmiş reçeteler",
    text: "Her aroma; sıcak, soğuk ve soda bazlı içeceklerde gerçek bar koşullarında denendi. Çökme, ayrışma, renk kaybı yok.",
  },
  {
    icon: Truck,
    title: "Hızlı ve güvenli teslimat",
    text: "Siparişler aynı gün hazırlanır, 81 ile 1–3 iş gününde ulaşır. Cam şişeler kırılmaya karşı özel kutularda gönderilir.",
  },
  {
    icon: Users,
    title: "İşletmeye özel destek",
    text: "Menü geliştirme, dozaj tabloları ve personel eğitimi için barista ekibimiz bir telefon uzağınızda.",
  },
];

export function WhyUmba() {
  return (
    <section className="container-x py-16 sm:py-24">
      <Reveal>
      <SectionHeading
        align="center"
        eyebrow="Neden Umba?"
        title="Küçük bir kafeden büyük bir zincire kadar aynı standart."
        description="Üretimden teslimata her adımı kendimiz yönetiyoruz; böylece her siparişte aynı tadı ve aynı kıvamı alıyorsunuz."
      />
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reasons.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 90} className="h-full">
            <div className="group h-full rounded-3xl border border-espresso-900/5 bg-cream-50 p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-caramel-500/15 text-caramel-700 transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-espresso-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-espresso-700">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
