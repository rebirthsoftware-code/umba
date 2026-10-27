import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Umba Coffee ile iletişime geçin: telefon, e-posta, WhatsApp ve adres bilgileri.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Size nasıl yardımcı olabiliriz?"
        description="Sipariş, ürün, bayilik veya menü danışmanlığı; hangi konu olursa olsun bir telefon ya da mesaj uzağınızdayız."
        crumbs={[{ label: "İletişim" }]}
      />
      <section className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ul className="space-y-4">
            {[
              { icon: Phone, title: "Telefon", text: site.contact.phone, href: `tel:${site.contact.phoneHref}` },
              {
                icon: MessageCircle,
                title: "WhatsApp",
                text: "Hızlı yanıt için mesaj atın",
                href: `https://wa.me/${site.contact.whatsapp}`,
              },
              { icon: Mail, title: "E-posta", text: site.contact.email, href: `mailto:${site.contact.email}` },
              { icon: MapPin, title: "Adres", text: site.contact.address },
              { icon: Clock, title: "Çalışma saatleri", text: site.contact.workingHours },
            ].map(({ icon: Icon, title, text, href }) => (
              <li key={title} className="flex items-start gap-4 rounded-2xl border border-espresso-900/10 bg-cream-50 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-caramel-500/15 text-caramel-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">{title}</p>
                  {href ? (
                    <a href={href} className="mt-1 block font-semibold text-espresso-900 hover:text-caramel-700" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {text}
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold text-espresso-900">{text}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-[1.5rem] border border-espresso-900/10 bg-cream-100 p-6 sm:p-8 lg:col-span-7">
          <h2 className="font-display text-2xl font-semibold text-espresso-900">Mesaj gönderin</h2>
          <p className="mt-1 text-sm text-espresso-700">Genellikle aynı iş günü içinde yanıtlıyoruz.</p>
          <div className="mt-6">
            <ContactForm type="iletisim" />
          </div>
        </div>
      </section>
    </>
  );
}
