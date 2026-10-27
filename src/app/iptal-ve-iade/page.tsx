import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "İptal ve İade Koşulları", alternates: { canonical: "/iptal-ve-iade" } };

export default function Page() {
  return (
    <LegalPage title="İptal ve İade Koşulları" description="Sipariş iptali, cayma hakkı ve hasarlı ürün süreçleri.">
      <h2>Sipariş iptali</h2>
      <p>
        Kargoya verilmemiş siparişlerinizi {site.contact.phone} numaralı telefondan veya {site.contact.email} adresinden
        ücretsiz iptal edebilirsiniz. Havale ile ödenen tutar 3 iş günü içinde aynı hesaba iade edilir.
      </p>
      <h2>Cayma hakkı ve iade</h2>
      <ol>
        <li>Ürün teslim tarihinden itibaren 14 gün içinde bize ulaşın; sipariş numaranızı ve iade etmek istediğiniz ürünü belirtin.</li>
        <li>Size ileteceğimiz iade kodu ile ürünü anlaşmalı kargo firmasına ücretsiz teslim edin.</li>
        <li>Ürün depomuza ulaşıp kontrol edildikten sonra 14 gün içinde ödeme iadesi yapılır.</li>
      </ol>
      <h2>İade edilemeyen ürünler</h2>
      <ul>
        <li>Ambalajı, mührü veya kapağı açılmış gıda ürünleri (şurup, sos, püre, kahve, toz içecekler),</li>
        <li>Son kullanma tarihi geçmiş veya uygun koşullarda saklanmamış ürünler,</li>
        <li>Müşteri talebiyle özel olarak hazırlanmış (ör. özel öğütüm) kahveler.</li>
      </ul>
      <h2>Hasarlı veya hatalı ürün</h2>
      <p>
        Kargoda hasar gören ürünler için paketi teslim alırken kargo görevlisine tutanak tutturun ve 48 saat içinde fotoğrafla
        birlikte bize bildirin. Hasarlı veya yanlış gönderilen ürünler ücretsiz olarak yenisiyle değiştirilir.
      </p>
      <h2>Kurumsal siparişler</h2>
      <p>Kurumsal (faturalı) siparişlerde iade süreci, sözleşmede aksi belirtilmedikçe yukarıdaki koşullara tabidir.</p>
    </LegalPage>
  );
}
