import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = { title: "Çevrimdışı", robots: { index: false } };

export default function OfflinePage() {
  return (
    <section className="container-x flex min-h-[60vh] items-center justify-center py-16">
      <div className="max-w-md text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-200 text-espresso-700">
          <WifiOff className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-espresso-900">İnternet bağlantısı yok</h1>
        <p className="mt-2 text-espresso-700">Bağlantı geldiğinde kaldığınız yerden devam edebilirsiniz. Sepetiniz cihazınızda saklanıyor.</p>
        <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-full bg-espresso-900 px-7 text-sm font-semibold text-cream-50">
          Tekrar dene
        </Link>
      </div>
    </section>
  );
}
