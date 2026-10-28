import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProductVisual } from "@/components/product/ProductVisual";
import { getProduct, products } from "@/lib/products";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Umba Coffee'nin hikâyesi: kafeler için şurup, sos, püre, kahve ve sıcak çikolata üreten bir Türk markası.",
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  { title: "Tutarlılık", text: "Bir kafenin en büyük düşmanı her gün değişen tattır. Reçetelerimiz partiden partiye aynı sonucu verir." },
  { title: "Dürüst içerik", text: "Yapay renklendirici yok, abartılı tatlılık yok. Etikette ne yazıyorsa şişede o var." },
  { title: "Baristayla birlikte", text: "Her yeni ürün, sahada çalışan baristalarla denenir; bar hızına ve dozaja göre ayarlanır." },
  { title: "Erişilebilir fiyat", text: "Üreticiyiz; aracı olmadan doğrudan satıyoruz. Kalite ile fiyat arasında seçim yapmak zorunda kalmayın." },
];

export default function AboutPage() {
  const a = getProduct("espresso-reserve")!;
  const b = getProduct("tuzlu-karamel-surubu")!;
  const c = getProduct("mango-puresi")!;

  return (
    <>
      <PageHero
        eyebrow="Hakkımızda"
        title="Bir kafenin barında ne eksikse, onu üretmek için kurulduk."
        description="Umba Coffee; şurup, sos, püre, kahve, sıcak çikolata ve bar ürünlerini tek çatı altında üreten, Türkiye'nin dört bir yanındaki işletmelere ve evlere ulaşan bir lezzet markasıdır."
        crumbs={[{ label: "Hakkımızda" }]}
      />

      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-12 py-16 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow="Hikâyemiz" title="Önce bir kafe, sonra bir üretici." />
          <div className="mt-6 space-y-4 leading-relaxed text-espresso-700">
            <p>
              Umba, kendi kafesinde beğendiği şurubu bulamayan bir barista ekibinin mutfağında doğdu. İlk reçeteler karamel ve
              vanilyaydı; müşterilerden gelen “bunu nereden aldınız?” sorusu, küçük mutfağı bir üretim tesisine dönüştürdü.
            </p>
            <p>
              Bugün {products.length}&apos;den fazla ürünle {categories.length} ürün grubunda üretim yapıyoruz. Kahvelerimizi
              küçük partiler hâlinde kavuruyor, şurup ve soslarımızı kendi tesisimizde dolduruyor, pürelerimizi sezonunda alınan
              meyvelerle hazırlıyoruz.
            </p>
            <p>
              Amacımız değişmedi: Bir kafenin barında ne eksikse, onu kafe standardında ve dürüst fiyatla üretmek.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/urunler">Ürünleri inceleyin</Button>
            <Button href="/kurumsal" variant="outline">Kurumsal işbirliği</Button>
          </div>
        </div>
        <div className="relative lg:col-span-6">
          <div className="relative mx-auto aspect-[5/4] max-w-lg overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-cream-100 to-cream-300 shadow-lift">
            <div className="absolute inset-0 bg-grain opacity-70" />
            <ProductVisual product={b} className="absolute bottom-6 left-[8%] h-[70%] w-auto drop-shadow-2xl" />
            <ProductVisual product={a} className="absolute bottom-10 left-[36%] h-[76%] w-auto drop-shadow-2xl" />
            <ProductVisual product={c} className="absolute bottom-6 right-[6%] h-[68%] w-auto drop-shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="bg-cream-100 py-16">
        <div className="container-x">
          <SectionHeading align="center" eyebrow="Değerlerimiz" title="Dört şeye söz veriyoruz." />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="rounded-2xl border border-espresso-900/5 bg-cream-50 p-6 shadow-card">
                <span className="font-display text-4xl font-semibold text-caramel-500">0{i + 1}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-espresso-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-espresso-700">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-6 rounded-[1.75rem] bg-espresso-900 p-8 text-cream-50 sm:grid-cols-3 sm:p-12">
          {[
            { k: `${products.length}+`, v: "ürün" },
            { k: `${categories.length}`, v: "ürün grubu" },
            { k: "81", v: "ile teslimat" },
          ].map((s) => (
            <div key={s.v} className="text-center sm:text-left">
              <p className="font-display text-5xl font-semibold text-caramel-300">{s.k}</p>
              <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cream-200">{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
