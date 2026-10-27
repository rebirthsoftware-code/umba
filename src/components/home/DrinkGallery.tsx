import Link from "next/link";
import { getProduct } from "@/lib/products";
import { DrinkArt, type DrinkKind } from "@/components/product/DrinkArt";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const tiles: { slug: string; kind?: DrinkKind; caption: string }[] = [
  { slug: "karamel-surubu", kind: "mug", caption: "Caramel latte" },
  { slug: "mango-puresi", caption: "Mango frozen" },
  { slug: "klasik-sicak-cikolata", caption: "Sıcak çikolata" },
  { slug: "blue-curacao-surubu", caption: "Blue lagoon" },
  { slug: "umba-signature-espresso", caption: "Signature espresso" },
  { slug: "vanilya-frappe-tozu", caption: "Vanilya frappe" },
  { slug: "cilek-surubu", caption: "Çilekli soda" },
  { slug: "matcha-latte-tozu", caption: "Iced matcha" },
];

export function DrinkGallery() {
  return (
    <section className="container-x py-16 sm:py-24">
      <Reveal>
        <SectionHeading
          align="center"
          eyebrow="#umbacoffee"
          title="Bardağınızda Umba."
          description="Menünüzde yer alabilecek içeceklerden bir seçki. Her biri tek tıkla ürün sayfasına gider."
        />
      </Reveal>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t, i) => {
          const p = getProduct(t.slug)!;
          return (
            <Reveal key={t.slug} delay={(i % 4) * 70} direction="scale">
              <Link
                href={`/urun/${p.slug}`}
                className="group relative block aspect-square overflow-hidden rounded-[1.75rem] border border-espresso-900/5"
                style={{ background: `radial-gradient(120% 100% at 50% 110%, ${p.color}66 0%, #f8f1e7 70%)` }}
              >
                <DrinkArt product={p} kind={t.kind} className="absolute left-1/2 top-1/2 h-[78%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-xl transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-rotate-3" />
                <span className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-full bg-cream-50/90 px-3 py-1.5 text-xs font-bold text-espresso-900 opacity-0 backdrop-blur transition-all duration-500 [transform:translateY(8px)] group-hover:opacity-100 group-hover:[transform:translateY(0)]">
                  {t.caption}
                  <span className="text-caramel-700">→</span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
