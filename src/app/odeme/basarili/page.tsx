import type { Metadata } from "next";
import { PaymentResult } from "@/components/checkout/PaymentResult";

export const metadata: Metadata = { title: "Ödeme başarılı", robots: { index: false } };

/* PayTR, sonucu iframe içinde yönlendirirse sayfayı üst pencereye taşı. */
const breakout = "if (window.top !== window.self) { window.top.location.href = window.location.href; }";

export default function PaymentSuccessPage() {
  return (
    <section className="container-x py-12 sm:py-16">
      <script dangerouslySetInnerHTML={{ __html: breakout }} />
      <PaymentResult status="success" />
    </section>
  );
}
