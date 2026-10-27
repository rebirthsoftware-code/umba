import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-caramel-600">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-espresso-900 sm:text-5xl">Bu sayfa fincanda kalmamış.</h1>
      <p className="mt-4 max-w-md text-espresso-700">Aradığınız sayfa taşınmış veya hiç var olmamış olabilir. Kataloğa dönüp devam edebilirsiniz.</p>
      <div className="mt-8 flex gap-3">
        <Button href="/urunler">Ürünlere git</Button>
        <Button href="/" variant="outline">Ana sayfa</Button>
      </div>
      <Link href="/iletisim" className="mt-6 text-sm font-semibold text-espresso-700 underline underline-offset-4">
        Yardım mı lazım? Bize yazın
      </Link>
    </section>
  );
}
