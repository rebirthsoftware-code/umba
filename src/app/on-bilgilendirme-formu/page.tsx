import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Ön Bilgilendirme Formu", alternates: { canonical: "/on-bilgilendirme-formu" } };

export default function Page() {
  return (
    <LegalPage title="Ön Bilgilendirme Formu" description="Siparişinizi onaylamadan önce bilmeniz gerekenler.">
      <h2>Satıcı bilgileri</h2>
      <p>
        {site.legal.companyName} · {site.contact.address} · {site.contact.phone} · {site.contact.email}
      </p>
      <h2>Ürün ve fiyat</h2>
      <p>
        Sipariş özetinde gösterilen ürünler, boyları, adetleri ve KDV dâhil fiyatları geçerlidir. Fiyatlar Türk Lirası
        cinsindendir ve sipariş anındaki fiyatlar esas alınır.
      </p>
      <h2>Kargo ve teslimat</h2>
      <ul>
        <li>{formatPrice(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo ücretsizdir.</li>
        <li>Altındaki siparişlerde kargo ücreti {formatPrice(site.commerce.shippingFee)}&apos;dir.</li>
        <li>Siparişler ödeme onayından sonra ortalama {site.commerce.deliveryEstimate} içinde teslim edilir.</li>
      </ul>
      <h2>Ödeme</h2>
      <p>
        Kredi/banka kartı veya Havale/EFT ile ödeme yapılabilir.
      </p>
      <h2>Cayma hakkı</h2>
      <p>
        Teslimden itibaren 14 gün içinde ambalajı açılmamış ürünler için cayma hakkınız vardır. Ayrıntılar için{" "}
        <Link href="/iptal-ve-iade">İptal ve İade Koşulları</Link> sayfasına bakın.
      </p>
      <h2>Şikâyet ve uyuşmazlık</h2>
      <p>
        Şikâyetlerinizi {site.contact.email} adresine iletebilir; çözüm sağlanamazsa Tüketici Hakem Heyetleri ve Tüketici
        Mahkemelerine başvurabilirsiniz.
      </p>
    </LegalPage>
  );
}
