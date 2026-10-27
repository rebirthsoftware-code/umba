import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/LegalPage";
import { site } from "@/lib/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Teslimat ve Kargo", alternates: { canonical: "/teslimat-ve-kargo" } };

export default function Page() {
  return (
    <LegalPage title="Teslimat ve Kargo" description="Kargo ücretleri, teslimat süreleri ve paketleme hakkında.">
      <h2>Kargo ücreti</h2>
      <table>
        <thead>
          <tr><th>Sepet tutarı</th><th>Kargo ücreti</th></tr>
        </thead>
        <tbody>
          <tr><td>{formatPrice(site.commerce.freeShippingThreshold)} ve üzeri</td><td><strong>Ücretsiz</strong></td></tr>
          <tr><td>{formatPrice(site.commerce.freeShippingThreshold)} altı</td><td>{formatPrice(site.commerce.shippingFee)}</td></tr>
        </tbody>
      </table>
      <h2>Teslimat süresi</h2>
      <p>
        Saat 14:00&apos;e kadar onaylanan siparişler aynı gün kargoya verilir. Türkiye genelinde teslimat ortalama{" "}
        {site.commerce.deliveryEstimate} sürer. Yoğun dönemlerde ve kampanya günlerinde süre uzayabilir.
      </p>
      <h2>Paketleme</h2>
      <p>
        Cam şişe şuruplar kırılmaya karşı özel bölmeli kutularda, püreler soğuk zincir gerektirmeyen ambalajlarında gönderilir.
        Kahveler sipariş sonrası kavrulur ve tek yönlü valfli poşetlerde paketlenir.
      </p>
      <h2>Kurumsal ve toplu teslimat</h2>
      <p>
        Palet bazlı ve düzenli teslimatlar için <a href="/kurumsal">kurumsal satış</a> ekibimizle iletişime geçin; İstanbul
        içi kendi araçlarımızla teslimat yapılabilmektedir.
      </p>
    </LegalPage>
  );
}
