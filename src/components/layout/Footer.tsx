import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { Logo, LogoImage } from "@/components/ui/Logo";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { CopyrightYear } from "./CopyrightYear";

const help = [
  { href: "/sss", label: "Sıkça Sorulan Sorular" },
  { href: "/teslimat-ve-kargo", label: "Teslimat ve Kargo" },
  { href: "/iptal-ve-iade", label: "İptal ve İade Koşulları" },
  { href: "/mesafeli-satis-sozlesmesi", label: "Mesafeli Satış Sözleşmesi" },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni" },
  { href: "/gizlilik-politikasi", label: "Gizlilik ve Çerez Politikası" },
];

const corporate = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/kurumsal", label: "Kurumsal Satış & Bayilik" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/urunler", label: "Tüm Ürünler" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-espresso-950 text-cream-200">
      {/* Bülten şeridi */}
      <div className="border-b border-cream-50/10">
        <div className="container-x flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-caramel-400">Umba Bülten</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-cream-50 sm:text-3xl">
              Yeni aromalar, tarifler ve kampanyalar e-postanızda.
            </h2>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="container-x grid grid-cols-[minmax(0,1fr)] gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream-200/80">{site.description}</p>
          <div className="mt-6 flex items-center gap-3">
            {site.social.instagram && (
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 text-cream-100 transition-colors hover:border-caramel-400 hover:text-caramel-300"
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
            )}
            {site.social.facebook && (
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 text-cream-100 transition-colors hover:border-caramel-400 hover:text-caramel-300"
              >
                <FacebookIcon className="h-4.5 w-4.5" />
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-cream-50">Ürünler</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/kategori/${c.slug}`} className="text-cream-200/80 transition-colors hover:text-caramel-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-cream-50">Kurumsal</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {corporate.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream-200/80 transition-colors hover:text-caramel-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-cream-50">Yardım</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {help.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream-200/80 transition-colors hover:text-caramel-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-cream-50">İletişim</h3>
          <ul className="mt-4 space-y-3 text-sm text-cream-200/80">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
              <a href={`tel:${site.contact.phoneHref}`} className="hover:text-caramel-300">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
              <a href={`mailto:${site.contact.email}`} className="break-all hover:text-caramel-300">
                {site.contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
              <span>{site.contact.address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-caramel-400" />
              <span>{site.contact.workingHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div aria-hidden="true" className="container-x select-none overflow-hidden pb-2">
        <LogoImage tone="light" className="mx-auto h-auto w-full max-w-3xl opacity-[0.07]" />
      </div>

      <div className="border-t border-cream-50/10">
        <div className="container-x flex flex-col items-start gap-4 py-6 text-xs text-cream-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CopyrightYear /> {site.legal.companyName}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2">
            {site.commerce.cardPaymentsEnabled && (
              <span className="rounded-md border border-cream-50/15 px-2 py-1 font-semibold">Kredi Kartı · PayTR</span>
            )}
            <span className="rounded-md border border-cream-50/15 px-2 py-1 font-semibold">Havale / EFT</span>
            <span className="rounded-md border border-cream-50/15 px-2 py-1 font-semibold">Kapıda Ödeme</span>
            <span className="rounded-md border border-cream-50/15 px-2 py-1 font-semibold">256-bit SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
