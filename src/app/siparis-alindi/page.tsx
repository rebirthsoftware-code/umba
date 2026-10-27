import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = {
  title: "Siparişiniz alındı",
  robots: { index: false },
};

export default function OrderSuccessPage() {
  return (
    <section className="container-x py-12 sm:py-16">
      <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-cream-200" />}>
        <OrderSuccess />
      </Suspense>
    </section>
  );
}
