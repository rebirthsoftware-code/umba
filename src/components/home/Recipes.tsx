import Link from "next/link";
import { Clock, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getProduct } from "@/lib/products";
import { ProductArt } from "@/components/product/ProductArt";

const recipes = [
  {
    title: "Caramel Macchiato",
    time: "3 dk",
    product: "karamel-surubu",
    topping: "karamel-sosu",
    steps: ["30 ml Karamel Şurubu bardağa", "180 ml buharlanmış süt", "1 shot espresso üstten", "Karamel Sosu ile çizgiler"],
    accent: "#d08f2e",
  },
  {
    title: "Çilekli Frozen",
    time: "2 dk",
    product: "cilek-puresi",
    topping: "limonata-konsantresi",
    steps: ["80 g Çilek Püresi", "40 ml Limonata Konsantresi", "200 g buz", "Blender'da 30 sn"],
    accent: "#d9484f",
  },
  {
    title: "Fındıklı Sıcak Çikolata",
    time: "4 dk",
    product: "klasik-sicak-cikolata",
    topping: "findik-surubu",
    steps: ["30 g Sıcak Çikolata tozu", "180 ml sıcak süt", "15 ml Fındık Şurubu", "Krem şanti ve kakao"],
    accent: "#6b3e26",
  },
];

export function Recipes() {
  return (
    <section className="bg-cream-100 py-16 sm:py-24">
      <div className="container-x">
        <SectionHeading
          eyebrow="Barista tarifleri"
          title="Menünüze bugün ekleyebileceğiniz üç içecek."
          description="Her ürün sayfasında dozaj önerileri var. Burada en çok sorulan üç tarifi bıraktık."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {recipes.map((r) => {
            const p = getProduct(r.product)!;
            const t = getProduct(r.topping)!;
            return (
              <article
                key={r.title}
                className="group relative overflow-hidden rounded-[2rem] border border-espresso-900/5 bg-cream-50 p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-600">
                      <Clock className="h-3.5 w-3.5" /> {r.time}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-semibold text-espresso-900">{r.title}</h3>
                  </div>
                  <div className="relative flex h-24 w-24 shrink-0 items-end justify-center">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full opacity-30 blur-xl"
                      style={{ background: r.accent }}
                    />
                    <ProductArt product={p} className="relative h-full w-auto drop-shadow-lg" />
                  </div>
                </div>
                <ol className="mt-4 space-y-2 text-sm text-espresso-700">
                  {r.steps.map((s, i) => (
                    <li key={s} className="flex gap-3">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-bold text-cream-50"
                        style={{ background: r.accent }}
                      >
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-espresso-900/10 pt-4 text-xs font-semibold">
                  <Link href={`/urun/${p.slug}`} className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 hover:bg-cream-300">
                    {p.name} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                  <Link href={`/urun/${t.slug}`} className="inline-flex items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 hover:bg-cream-300">
                    {t.name} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
