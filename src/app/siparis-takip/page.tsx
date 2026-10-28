import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { OrderTracking } from "@/components/order/OrderTracking";

export const metadata: Metadata = {
  title: "Sipariş takip",
  description: "Sipariş numaranız ve telefonunuzla siparişinizin durumunu ve kargo takibini görüntüleyin.",
};

export default function OrderTrackingPage() {
  return (
    <>
      <PageHero eyebrow="Sipariş takip" title="Siparişiniz nerede?" description="Sipariş numaranızı ve siparişte kullandığınız telefon numarasını girin; durumu, kargo firmasını ve takip numarasını görün." crumbs={[{ label: "Sipariş takip" }]} />
      <section className="container-x py-12">
        <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-cream-200" />}>
          <OrderTracking />
        </Suspense>
      </section>
    </>
  );
}
