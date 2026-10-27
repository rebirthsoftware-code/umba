import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { products } from "@/lib/products";
import { categories } from "@/lib/categories";

const values = [
  { no: "01", title: "Kendi üretimimiz", text: "Şurup, sos, püre ve tozlar kendi tesisimizde dolduruluyor; kahveler sipariş sonrası küçük partiler hâlinde kavruluyor. Aracı yok." },
  { no: "02", title: "Barista testinden geçmiş reçeteler", text: "Her aroma; sıcak, soğuk ve soda bazlı içeceklerde gerçek bar koşullarında denendi. Çökme, ayrışma, renk kaybı yok." },
  { no: "03", title: "Dürüst içerik", text: "Yapay renklendirici yok, abartılı tatlılık yok. Etikette ne yazıyorsa şişede o var." },
  { no: "04", title: "Hızlı ve güvenli teslimat", text: "14:00'e kadar sipariş aynı gün kargoda. Cam şişeler bölmeli kutularda, 81 ile 1–3 iş gününde." },
];

export function Values() {
  return (
    <section className="border-y border-espresso-900/10 bg-cream-50">
      <div className="container-x grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-caramel-700">Neden Umba?</p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] text-espresso-900 text-balance sm:text-5xl">
              Küçük bir kafeden büyük bir zincire kadar <span className="accent-italic">aynı standart.</span>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-espresso-900/10 pt-6">
              {[
                { to: products.length, suffix: "+", label: "ürün" },
                { to: categories.length, suffix: "", label: "ürün grubu" },
                { to: 81, suffix: "", label: "ile teslimat" },
              ].map((s) => (
                <div key={s.label}>
                  <dd className="font-display text-4xl font-semibold text-espresso-900">
                    <CountUp to={s.to} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-1 text-xs uppercase tracking-wider text-espresso-600">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <ol className="lg:col-span-7">
          {values.map((v, i) => (
            <Reveal as="li" key={v.no} delay={i * 80}>
              <div className="grid gap-3 border-t border-espresso-900/10 py-6 sm:grid-cols-[4rem_1fr] sm:gap-6">
                <span className="font-display text-sm italic text-caramel-700">{v.no}</span>
                <div>
                  <h3 className="font-display text-2xl font-semibold text-espresso-900">{v.title}</h3>
                  <p className="mt-2 max-w-xl leading-relaxed text-espresso-700">{v.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
