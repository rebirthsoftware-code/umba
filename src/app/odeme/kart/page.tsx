import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PaytrFrame } from "@/components/checkout/PaytrFrame";

export const metadata: Metadata = { title: "Kart ile ödeme", robots: { index: false } };

export default function CardPaymentPage() {
  return (
    <section className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Sepet", href: "/sepet" }, { label: "Ödeme", href: "/odeme" }, { label: "Kart ile ödeme" }]} />
      <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-espresso-900 sm:text-5xl">Kart ile ödeme</h1>
      <p className="mt-2 text-espresso-700">Kart bilgilerinizi PayTR&apos;nin güvenli ödeme penceresine girin.</p>
      <div className="mt-8">
        <PaytrFrame />
      </div>
    </section>
  );
}
