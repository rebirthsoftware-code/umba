import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Mesafeli Satış Sözleşmesi", alternates: { canonical: "/mesafeli-satis-sozlesmesi" } };

export default function Page() {
  return (
    <LegalPage
      title="Mesafeli Satış Sözleşmesi"
      description="6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca."
    >
      <h2>Madde 1 – Taraflar</h2>
      <p>
        <strong>SATICI:</strong> {site.legal.companyName}
        <br />
        Adres: {site.contact.address}
        <br />
        Telefon: {site.contact.phone} · E-posta: {site.contact.email}
        <br />
        MERSİS No: {site.legal.mersis}
      </p>
      <p>
        <strong>ALICI:</strong> Sipariş formunda ad, soyad, adres, telefon ve e-posta bilgileri yer alan tüketici.
      </p>
      <h2>Madde 2 – Konu</h2>
      <p>
        İşbu sözleşmenin konusu, ALICI&apos;nın SATICI&apos;ya ait {site.url} internet sitesinden elektronik ortamda
        siparişini verdiği, sipariş özetinde nitelikleri ve satış fiyatı belirtilen ürünlerin satışı ve teslimi ile ilgili
        olarak 6502 sayılı Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin
        belirlenmesidir.
      </p>
      <h2>Madde 3 – Sözleşme konusu ürün, fiyat ve teslimat bilgileri</h2>
      <p>
        Ürünlerin cinsi, adedi, boyu, KDV dâhil satış fiyatı, kargo ücreti ve ödeme şekli sipariş özetinde ve sipariş
        onay e-postasında belirtildiği gibidir. {formatPrice(site.commerce.freeShippingThreshold)} ve üzeri siparişlerde kargo
        ücretsizdir; bu tutarın altındaki siparişlerde {formatPrice(site.commerce.shippingFee)} kargo ücreti uygulanır.
      </p>
      <h2>Madde 4 – Teslimat</h2>
      <p>
        Ürünler, ALICI&apos;nın sipariş formunda belirttiği adrese, ödemenin onaylanmasından itibaren en geç 30 gün içinde,
        ortalama {site.commerce.deliveryEstimate} içinde kargo ile teslim edilir. Stok yetersizliği hâlinde SATICI, ALICI&apos;yı
        bilgilendirerek ödemeyi 14 gün içinde iade eder.
      </p>
      <h2>Madde 5 – Ödeme</h2>
      <p>
        Ödeme; kredi/banka kartı veya havale/EFT ile yapılır. Havale/EFT seçilmesi hâlinde
        ödeme 3 iş günü içinde yapılmazsa sipariş iptal edilir.
      </p>
      <h2>Madde 6 – Cayma hakkı</h2>
      <p>
        ALICI, ürünün teslimini takip eden <strong>14 gün</strong> içinde hiçbir gerekçe göstermeksizin cayma hakkını
        kullanabilir. Cayma bildirimi {site.contact.email} adresine veya yazılı olarak SATICI adresine iletilir. Ürün,
        ambalajı açılmamış ve kullanılmamış olarak 10 gün içinde SATICI&apos;nın anlaşmalı kargo firması ile iade edilir; bu
        durumda iade kargo bedeli SATICI&apos;ya aittir.
      </p>
      <h2>Madde 7 – Cayma hakkının kullanılamayacağı ürünler</h2>
      <p>
        Mesafeli Sözleşmeler Yönetmeliği m.15 uyarınca; <strong>çabuk bozulabilen veya son kullanma tarihi geçebilecek
        gıda ürünleri</strong> ile <strong>ambalajı, bandı veya mührü açılmış, hijyen açısından iadeye uygun olmayan
        ürünlerde</strong> cayma hakkı kullanılamaz. Ambalajı açılmamış ürünler bu kapsam dışındadır.
      </p>
      <h2>Madde 8 – Uyuşmazlık</h2>
      <p>
        İşbu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı&apos;nca ilan edilen parasal sınırlar dâhilinde ALICI&apos;nın
        yerleşim yerindeki Tüketici Hakem Heyetleri, bu sınırların üzerinde Tüketici Mahkemeleri yetkilidir.
      </p>
      <h2>Madde 9 – Yürürlük</h2>
      <p>
        ALICI, sitede siparişi onaylamadan önce işbu sözleşmeyi ve Ön Bilgilendirme Formu&apos;nu okuduğunu, anladığını ve
        kabul ettiğini beyan eder. Sözleşme, siparişin onaylandığı tarihte yürürlüğe girer.
      </p>
    </LegalPage>
  );
}
