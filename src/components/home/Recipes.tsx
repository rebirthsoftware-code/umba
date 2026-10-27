import Link from "next/link";
import { Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getProduct } from "@/lib/products";
import { DrinkArt, type DrinkKind } from "@/components/product/DrinkArt";

const recipes: { title: string; time: string; product: string; topping: string; kind: DrinkKind; steps: string[] }[] = [
  { title: "Salted Caramel Macchiato", time: "3 dk", product: "tuzlu-karamel-surubu", topping: "karamel-sosu", kind: "mug", steps: ["30 ml Tuzlu Karamel Şurubu bardağa", "180 ml buharlanmış süt", "1 shot espresso üstten", "Karamel Sosu ile çizgiler"] },
  { title: "Çilekli Frozen", time: "2 dk", product: "cilek-puresi", topping: "limonata-konsantresi", kind: "glass", steps: ["80 g Çilek Püresi", "40 ml Limonata Konsantresi", "200 g buz", "Blender'da 30 sn"] },
  { title: "Fındıklı Sıcak Çikolata", time: "4 dk", product: "klasik-sicak-cikolata", topping: "findik-surubu", kind: "mug", steps: ["30 g Sıcak Çikolata tozu", "180 ml sıcak süt", "15 ml Fındık Şurubu", "Krem şanti ve kakao"] },
];

export function Recipes() {
  return (
    <section id="tarifler" className="scroll-mt-24 border-t border-espresso-900/10 py-20 sm:py-28">
      <div className="container-x">
        <Reveal>
          <SectionHeading eyebrow="Barista tarifleri" title="Menünüze bugün ekleyebileceğiniz üç içecek." description="Her ürün sayfasında dozaj önerileri var. Burada en çok sorulan üç tarifi bıraktık." />
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[1.75rem] border border-espresso-900/10 bg-espresso-900/10 lg:grid-cols-3">
          {recipes.map((r, i) => {
            const p = getProduct(r.product)!;
            const t = getProduct(r.topping)!;
            return (
              <Reveal key={r.title} delay={i * 90} className="h-full">
                <article className="group flex h-full flex-col bg-cream-50 p-6 transition-colors duration-500 hover:bg-cream-100">
                  <div className="flex h-44 items-center justify-center rounded-xl bg-cream-100 transition-colors group-hover:bg-cream-200">
                    <DrinkArt product={p} kind={r.kind} className="h-[86%] w-auto drop-shadow-md transition-transform duration-700 group-hover:-translate-y-1" />
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <h3 className="font-display text-2xl font-semibold text-espresso-900">{r.title}</h3>
                    <span className="inline-flex items-center gap-1 text-xs text-espresso-600">
                      <Clock className="h-3.5 w-3.5" /> {r.time}
                    </span>
                  </div>
                  <ol className="mt-4 space-y-1.5 text-sm text-espresso-700">
                    {r.steps.map((s, j) => (
                      <li key={s} className="flex gap-3">
                        <span className="w-4 shrink-0 font-display italic text-caramel-700">{j + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t border-espresso-900/10 pt-4 text-xs font-semibold">
                    <Link href={`/urun/${p.slug}`} className="text-espresso-900 underline underline-offset-4">
                      {p.name}
                    </Link>
                    <Link href={`/urun/${t.slug}`} className="text-espresso-900 underline underline-offset-4">
                      {t.name}
                    </Link>
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
