import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "KVKK Aydınlatma Metni", alternates: { canonical: "/kvkk" } };

export default function Page() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla bilgilendirme."
    >
      <h2>1. Veri sorumlusu</h2>
      <p>
        <strong>{site.legal.companyName}</strong> (“Umba”) olarak, {site.url} alan adlı internet sitemiz üzerinden
        topladığımız kişisel verilerinizi 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve ilgili mevzuata uygun
        şekilde işlemekteyiz.
      </p>
      <h2>2. İşlenen kişisel veriler</h2>
      <ul>
        <li><strong>Kimlik bilgileri:</strong> ad, soyad</li>
        <li><strong>İletişim bilgileri:</strong> e-posta adresi, telefon numarası, teslimat ve fatura adresi</li>
        <li><strong>Müşteri işlem bilgileri:</strong> sipariş geçmişi, sepet içeriği, ödeme yöntemi tercihi, fatura bilgileri (kurumsal müşteriler için vergi dairesi ve vergi numarası)</li>
        <li><strong>İşlem güvenliği bilgileri:</strong> IP adresi, tarayıcı bilgisi, çerez verileri</li>
        <li><strong>Pazarlama bilgileri:</strong> bülten aboneliği tercihi (yalnızca açık rızanız ile)</li>
      </ul>
      <h2>3. İşleme amaçları ve hukuki sebepler</h2>
      <table>
        <thead>
          <tr><th>Amaç</th><th>Hukuki sebep (KVKK m.5)</th></tr>
        </thead>
        <tbody>
          <tr><td>Siparişin alınması, hazırlanması ve teslimi</td><td>Sözleşmenin kurulması ve ifası (m.5/2-c)</td></tr>
          <tr><td>Fatura düzenlenmesi ve mali kayıtların tutulması</td><td>Kanuni yükümlülük (m.5/2-ç)</td></tr>
          <tr><td>Müşteri taleplerinin ve şikâyetlerin yanıtlanması</td><td>Meşru menfaat (m.5/2-f)</td></tr>
          <tr><td>Site güvenliğinin sağlanması ve kötüye kullanımın önlenmesi</td><td>Meşru menfaat (m.5/2-f)</td></tr>
          <tr><td>Kampanya ve bülten gönderimi</td><td>Açık rıza (m.5/1)</td></tr>
        </tbody>
      </table>
      <h2>4. Verilerin aktarılması</h2>
      <p>
        Kişisel verileriniz; siparişinizin teslimi için kargo şirketlerine, ödeme işlemleri için bankalara ve ödeme kuruluşlarına,
        yasal yükümlülüklerimiz kapsamında yetkili kamu kurum ve kuruluşlarına, sunucu ve e-posta altyapısı sağlayan hizmet
        sağlayıcılarımıza, yalnızca ilgili amaçla sınırlı olarak aktarılabilir.
      </p>
      <h2>5. Toplama yöntemi</h2>
      <p>
        Verileriniz; sipariş, iletişim ve bülten formları aracılığıyla elektronik ortamda, telefon ve e-posta yoluyla ise sözlü
        veya yazılı olarak toplanmaktadır.
      </p>
      <h2>6. Saklama süresi</h2>
      <p>
        Sipariş ve fatura verileri Vergi Usul Kanunu ve Türk Ticaret Kanunu gereği 10 yıl; iletişim formu verileri 2 yıl; bülten
        aboneliği verileri aboneliğiniz sona erene kadar saklanır.
      </p>
      <h2>7. Haklarınız (KVKK m.11)</h2>
      <ul>
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
        <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
        <li>KVKK m.7 çerçevesinde silinmesini veya yok edilmesini isteme,</li>
        <li>Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
        <li>Münhasıran otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
        <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
      </ul>
      <p>
        Başvurularınızı <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> adresine veya{" "}
        {site.contact.address} adresine yazılı olarak iletebilirsiniz. Başvurular en geç 30 gün içinde yanıtlanır.
      </p>
    </LegalPage>
  );
}
