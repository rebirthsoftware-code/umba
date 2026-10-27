import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Ödeme",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <section className="container-x py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Sepet", href: "/sepet" }, { label: "Ödeme" }]} />
      <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-espresso-900 sm:text-5xl">Ödeme</h1>
      <p className="mt-2 text-espresso-700">Teslimat bilgilerinizi girin ve ödeme yönteminizi seçin.</p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </section>
  );
}
