import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Sipariş, kargo, ödeme, iade ve ürün kullanımı hakkında sık sorulan sorular.",
  alternates: { canonical: "/sss" },
};

const groups = [
  {
    title: "Sipariş ve ödeme",
    items: [
      { q: "Hangi ödeme yöntemlerini kullanabilirim?", a: "Kredi/banka kartı (PayTR güvencesiyle, 3D Secure) veya Havale/EFT ile ödeme yapabilirsiniz." },
      { q: "Havale yaptım, siparişim ne zaman onaylanır?", a: "Havale/EFT ödemeleri iş günlerinde en geç 1 iş günü içinde kontrol edilir ve onaylanır. Dekontunuzu WhatsApp üzerinden iletirseniz süreç hızlanır." },
      { q: "Kurumsal fatura alabilir miyim?", a: "Evet. Ödeme adımında “Kurumsal” seçeneğini işaretleyip firma unvanı, vergi dairesi ve vergi numaranızı girmeniz yeterli. E-fatura mükellefi iseniz e-fatura düzenlenir." },
      { q: "Minimum sipariş tutarı var mı?", a: "Bireysel siparişlerde minimum tutar yoktur. Kurumsal fiyat listesinden yararlanmak için kurumsal satış ekibimizle görüşebilirsiniz." },
    ],
  },
  {
    title: "Kargo ve teslimat",
    items: [
      { q: "Kargo ücreti ne kadar?", a: `${formatPrice(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir. Altındaki siparişlerde ${formatPrice(site.commerce.shippingFee)} kargo ücreti uygulanır.` },
      { q: "Siparişim ne zaman elime geçer?", a: `Saat 14:00'e kadar onaylanan siparişler aynı gün kargoya verilir; teslimat Türkiye genelinde ortalama ${site.commerce.deliveryEstimate} sürer.` },
      { q: "Cam şişeler kırılmadan gelir mi?", a: "Şişeler kırılmaya karşı bölmeli özel kutularda gönderilir. Nadiren oluşan hasarlarda ürün ücretsiz yenilenir; teslim alırken kargo görevlisine tutanak tutturmanız yeterli." },
    ],
  },
  {
    title: "Ürünler ve kullanım",
    items: [
      { q: "Şuruplar açıldıktan sonra ne kadar dayanır?", a: "Kapağı kapalı ve serin ortamda, açıldıktan sonra 3 ay içinde tüketilmesi önerilir. Buzdolabına koymanıza gerek yoktur." },
      { q: "Pürelerin saklama koşulu nedir?", a: "Açılmamış püreler oda sıcaklığında 12 ay saklanabilir. Açıldıktan sonra buzdolabında (2–6 °C) 15 gün içinde tüketilmelidir." },
      { q: "Bir latte için ne kadar şurup kullanmalıyım?", a: "Standart 300 ml latte için 20–30 ml (2–3 pompa) yeterlidir. Her ürün sayfasında içecek bazlı dozaj önerileri yer alır." },
      { q: "Kahveler çekirdek mi öğütülmüş mü gönderiliyor?", a: "Varsayılan olarak çekirdek gönderilir. Sipariş notuna “espresso / filtre / French press öğütüm” yazmanız hâlinde istediğiniz incelikte öğütüp gönderiyoruz." },
      { q: "Şekersiz ürünleriniz var mı?", a: "Bitter sıcak çikolata düşük şekerli seçeneğimizdir; şekersiz şurup çeşitleri için kurumsal ekibimize yazabilirsiniz." },
    ],
  },
  {
    title: "İade ve değişim",
    items: [
      { q: "Ürünü iade edebilir miyim?", a: "Ambalajı açılmamış ürünleri teslimden itibaren 14 gün içinde iade edebilirsiniz. Gıda ürünü olduğu için ambalajı açılmış ürünlerde cayma hakkı kullanılamaz." },
      { q: "Yanlış ürün geldi, ne yapmalıyım?", a: `Sipariş numaranızla birlikte ${site.contact.email} adresine veya WhatsApp hattımıza yazın; doğru ürünü ücretsiz gönderelim.` },
    ],
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
      g.items.map((i) => ({
        "@type": "Question",
        name: i.q,
        acceptedAnswer: { "@type": "Answer", text: i.a },
      })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Yardım"
        title="Sıkça sorulan sorular"
        description="Aradığınızı bulamazsanız bize yazın; aynı iş günü dönüş yapıyoruz."
        crumbs={[{ label: "SSS" }]}
      />
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-12 lg:grid-cols-12">
        <nav className="lg:col-span-3" aria-label="Konular">
          <ul className="sticky top-28 space-y-1 text-sm">
            {groups.map((g) => (
              <li key={g.title}>
                <a href={`#${g.title.toLowerCase().replace(/\s+/g, "-")}`} className="block rounded-xl px-3 py-2 font-semibold text-espresso-800 hover:bg-cream-200">
                  {g.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-10 lg:col-span-9">
          {groups.map((g) => (
            <div key={g.title} id={g.title.toLowerCase().replace(/\s+/g, "-")} className="scroll-mt-28">
              <h2 className="font-display text-2xl font-semibold text-espresso-900">{g.title}</h2>
              <div className="mt-4 divide-y divide-espresso-900/10 rounded-2xl border border-espresso-900/10 bg-cream-50">
                {g.items.map((i) => (
                  <details key={i.q} className="group px-5 py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-espresso-900">
                      {i.q}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-espresso-900/15 text-lg leading-none transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-espresso-700">{i.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
