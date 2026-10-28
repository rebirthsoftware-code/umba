"use client";

import Link from "next/link";
import { useEffect, type CSSProperties } from "react";
import { ArrowUpRight, Phone, Search, X, MessageCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { WhatsAppLink } from "@/components/ui/WhatsAppLink";
import { CategoryVisual } from "@/components/product/CategoryVisual";
import { categories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { site } from "@/lib/site";
import { cn } from "@/lib/format";

const links = [
  { href: "/kurumsal", label: "Kurumsal & Bayilik", hint: "İşletmelere özel fiyat" },
  { href: "/hakkimizda", label: "Hakkımızda", hint: "Hikâyemiz ve değerlerimiz" },
  { href: "/iletisim", label: "İletişim", hint: "Bize ulaşın" },
  { href: "/siparis-takip", label: "Sipariş Takip", hint: "Siparişiniz nerede?" },
  { href: "/sss", label: "Sıkça Sorulan Sorular", hint: "Kargo, iade, kullanım" },
];

export function MobileMenu({ open, onClose, onSearch }: { open: boolean; onClose: () => void; onSearch: () => void }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  let i = 0;
  const item = (): CSSProperties => ({ "--i": i++ } as CSSProperties);

  return (
    <div
      className={cn("fixed inset-0 z-50 lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        className="menu-panel absolute inset-0 overflow-y-auto overscroll-contain bg-espresso-950 text-cream-50"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Menü"
      >
        {/* Işıltılar */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-caramel-500/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-berry-500/20 blur-3xl" />

        <div className="relative flex min-h-full flex-col px-5 pb-8 pt-4">
          {/* Üst çubuk */}
          <div className="menu-item flex items-center justify-between" style={item()}>
            <Logo tone="light" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Menüyü kapat"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream-50/15 text-cream-50 transition-colors hover:bg-cream-50/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Arama */}
          <button
            type="button"
            onClick={onSearch}
            style={item()}
            className="menu-item mt-6 flex h-13 items-center gap-3 rounded-full border border-cream-50/15 bg-cream-50/5 px-5 text-left text-sm text-cream-200 backdrop-blur transition-colors hover:border-caramel-400"
          >
            <Search className="h-4.5 w-4.5 text-caramel-300" />
            <span className="flex-1">Ürün, aroma veya kategori ara…</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>

          {/* Ürünler */}
          <Link
            href="/urunler"
            style={item()}
            className="menu-item mt-7 flex items-end justify-between border-b border-cream-50/10 pb-3"
          >
            <span>
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.25em] text-caramel-300">Katalog</span>
              <span className="mt-1 block font-display text-3xl font-semibold leading-none">Tüm ürünler</span>
            </span>
            <ArrowUpRight className="mb-1 h-6 w-6 text-caramel-300" />
          </Link>

          <ul className="mt-4 grid grid-cols-2 gap-2.5">
            {categories.map((c) => {
              const list = getProductsByCategory(c.slug);
              return (
                <li key={c.slug} className="menu-item" style={item()}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className="group relative flex h-24 items-end overflow-hidden rounded-2xl border border-cream-50/10 p-3 transition-transform active:scale-[0.98]"
                    style={{ background: `linear-gradient(135deg, ${c.color}cc 0%, ${c.color}55 100%)` }}
                  >
                    <span className="relative z-10">
                      <span className="block text-sm font-bold leading-tight">{c.name}</span>
                      <span className="block text-[0.7rem] text-cream-50/80">{list.length} ürün</span>
                    </span>
                    <CategoryVisual
                      category={c}
                      sample={list[0]}
                      className={cn(
                        "absolute -top-1 w-auto opacity-90 drop-shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105",
                        c.imageLandscape ? "-right-4 h-[80%] max-w-[62%] object-contain object-right" : "-right-2 h-[115%]",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Kurumsal bağlantılar */}
          <ul className="mt-7 divide-y divide-cream-50/10 border-y border-cream-50/10">
            {links.map((l, idx) => (
              <li key={l.href} className="menu-item" style={item()}>
                <Link href={l.href} className="group flex items-center gap-4 py-3.5">
                  <span className="font-display text-sm italic text-caramel-300">0{idx + 1}</span>
                  <span className="flex-1">
                    <span className="block text-lg font-semibold leading-tight">{l.label}</span>
                    <span className="block text-xs text-cream-200/70">{l.hint}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-cream-200/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-caramel-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Alt bilgi */}
          <div className="menu-item mt-auto pt-8" style={item()}>
            <WhatsAppLink
              text="Merhaba Umba Coffee, sipariş ve ürünleriniz hakkında bilgi almak istiyorum."
              placement="top"
              className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-bold text-white"
              menuClassName="left-0 right-auto w-full"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp ile sipariş & destek
            </WhatsAppLink>
            <div className="mt-4 flex items-center justify-between text-sm">
              <a href={`tel:${site.contact.phoneHref}`} className="flex items-center gap-2 font-semibold">
                <Phone className="h-4 w-4 text-caramel-300" /> {site.contact.phone}
              </a>
              <div className="flex gap-2">
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 hover:border-caramel-400">
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/15 hover:border-caramel-400">
                  <FacebookIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
            <p className="mt-3 text-xs text-cream-200/60">{site.contact.workingHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
