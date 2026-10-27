import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Sepetim",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <>
      <PageHero title="Sepetiniz" crumbs={[{ label: "Sepet" }]} />
      <section className="container-x py-10 sm:py-14">
        <CartPageContent />
      </section>
    </>
  );
}
