import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Gizlilik ve Çerez Politikası", alternates: { canonical: "/gizlilik-politikasi" } };

export default function Page() {
  return (
    <LegalPage title="Gizlilik ve Çerez Politikası" description="Verilerinizi nasıl koruduğumuz ve çerezleri nasıl kullandığımız.">
      <h2>Gizlilik</h2>
      <p>
        {site.legal.companyName}, sitemizi ziyaret eden ve alışveriş yapan kullanıcıların gizliliğine önem verir. Toplanan
        kişisel veriler yalnızca <Link href="/kvkk">KVKK Aydınlatma Metni</Link>&apos;nde belirtilen amaçlarla işlenir; üçüncü
        kişilere satılmaz ve pazarlama amacıyla paylaşılmaz.
      </p>
      <h2>Güvenlik</h2>
      <p>
        Sitemizdeki tüm veri iletişimi SSL (TLS) ile şifrelenir. Ödeme kartı bilgileri sunucularımızda saklanmaz; kart
        ödemeleri lisanslı ödeme kuruluşlarının güvenli sayfaları üzerinden gerçekleştirilir.
      </p>
      <h2>Çerezler</h2>
      <p>Sitemizde aşağıdaki çerez türleri kullanılmaktadır:</p>
      <table>
        <thead>
          <tr><th>Tür</th><th>Amaç</th><th>Süre</th></tr>
        </thead>
        <tbody>
          <tr><td>Zorunlu (yerel depolama)</td><td>Sepet içeriğinin tarayıcınızda tutulması, oturum güvenliği</td><td>Tarayıcıda siz silene kadar</td></tr>
          <tr><td>Performans / analitik</td><td>Site kullanımına ilişkin anonim istatistikler (etkinleştirilmişse)</td><td>En fazla 13 ay</td></tr>
          <tr><td>Pazarlama</td><td>Yalnızca açık rızanız ile, kampanya ölçümü</td><td>En fazla 13 ay</td></tr>
        </tbody>
      </table>
      <p>
        Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezlerin engellenmesi hâlinde sepet
        ve sipariş işlevleri çalışmayabilir.
      </p>
      <h2>Üçüncü taraf bağlantılar</h2>
      <p>
        Sitemizde yer alan sosyal medya ve WhatsApp bağlantıları üçüncü taraf platformlara yönlendirir. Bu platformların
        gizlilik uygulamalarından Umba sorumlu değildir.
      </p>
      <h2>İletişim</h2>
      <p>
        Gizlilik ile ilgili sorularınız için <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> adresine
        yazabilirsiniz.
      </p>
    </LegalPage>
  );
}
