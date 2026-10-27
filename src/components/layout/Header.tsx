"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown, Menu, Phone, Search, ShoppingBag, X, Truck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { categories } from "@/lib/categories";
import { site } from "@/lib/site";
import { cn, formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

const nav = [
  { href: "/urunler", label: "Ürünler", mega: true },
  { href: "/kurumsal", label: "Kurumsal & Bayilik" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totals, open, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const megaTimer = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rota değişince menüleri kapat (render sırasında state ayarlama deseni)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/urunler?q=${encodeURIComponent(q)}` : "/urunler");
    setSearchOpen(false);
    setMobileOpen(false);
  };

  const openMega = () => {
    if (megaTimer.current) window.clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer.current = window.setTimeout(() => setMegaOpen(false), 120);
  };

  const isActive = (href: string) =>
    href === "/urunler"
      ? pathname.startsWith("/urunler") || pathname.startsWith("/kategori") || pathname.startsWith("/urun/")
      : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      {/* Duyuru çubuğu */}
      <div className="bg-espresso-950 text-cream-100">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-2 font-medium">
            <Truck className="h-3.5 w-3.5 text-caramel-400" />
            <span>
              <span className="font-bold text-caramel-300">{formatPrice(site.commerce.freeShippingThreshold)}</span> ve
              üzeri siparişlerde kargo bedava
            </span>
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            <a href={`tel:${site.contact.phoneHref}`} className="flex items-center gap-1.5 hover:text-caramel-300">
              <Phone className="h-3.5 w-3.5" /> {site.contact.phone}
            </a>
            <Link href="/kurumsal" className="font-semibold text-caramel-300 hover:text-caramel-200">
              Kurumsal satış →
            </Link>
          </div>
        </div>
      </div>

      {/* Ana çubuk */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled
            ? "border-espresso-900/10 bg-cream-50/90 shadow-[0_8px_30px_-20px_rgb(43_27_18/0.35)] backdrop-blur-xl"
            : "border-transparent bg-cream-50",
        )}
      >
        <div className="container-x flex h-[4.25rem] items-center gap-4 lg:h-20">
          <button
            type="button"
            className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-espresso-900 hover:bg-cream-200 lg:hidden"
            aria-label="Menüyü aç"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <Logo className="mr-2" />

          <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {nav.map((item) =>
              item.mega ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "inline-flex h-10 items-center gap-1 rounded-full px-4 text-sm font-semibold transition-colors",
                      isActive(item.href) ? "bg-cream-200 text-espresso-900" : "text-espresso-800 hover:bg-cream-200",
                    )}
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                    onFocus={openMega}
                  >
                    {item.label}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", megaOpen && "rotate-180")} />
                  </Link>
                  <div
                    className={cn(
                      "absolute left-0 top-full z-50 w-[46rem] pt-3 transition-all duration-200",
                      megaOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
                    )}
                    onFocus={openMega}
                    onBlur={closeMega}
                  >
                    <div className="rounded-3xl border border-espresso-900/10 bg-cream-50 p-4 shadow-lift">
                      <div className="grid grid-cols-3 gap-2">
                        {categories.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/kategori/${c.slug}`}
                            className="group/item flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-cream-100"
                          >
                            <span
                              className="mt-0.5 h-9 w-9 shrink-0 rounded-xl"
                              style={{
                                background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)`,
                                boxShadow: `inset 0 0 0 1px rgb(43 27 18 / 0.08)`,
                              }}
                              aria-hidden="true"
                            />
                            <span>
                              <span className="block text-sm font-bold text-espresso-900 group-hover/item:text-caramel-700">
                                {c.name}
                              </span>
                              <span className="mt-0.5 block text-xs leading-snug text-espresso-600">{c.tagline}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center justify-between rounded-2xl bg-espresso-900 px-4 py-3 text-cream-50">
                        <p className="text-sm">
                          <span className="font-semibold">Tüm ürünleri</span> tek sayfada filtreleyin.
                        </p>
                        <Link href="/urunler" className="text-sm font-bold text-caramel-300 hover:text-caramel-200">
                          Tüm ürünler →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors",
                    isActive(item.href) ? "bg-cream-200 text-espresso-900" : "text-espresso-800 hover:bg-cream-200",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            {/* Arama (masaüstü) */}
            <form
              onSubmit={onSearch}
              role="search"
              className="hidden items-center md:flex"
            >
              <label htmlFor="site-search" className="sr-only">
                Ürün ara
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-600" />
                <input
                  id="site-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün ara: karamel, püre, espresso…"
                  className="h-11 w-56 rounded-full border border-espresso-900/10 bg-cream-100 pl-10 pr-4 text-sm text-espresso-900 placeholder:text-espresso-600/70 transition-all focus:w-72 focus:border-caramel-500 focus:bg-cream-50 focus:outline-none lg:w-64 lg:focus:w-80"
                />
              </div>
            </form>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-espresso-900 hover:bg-cream-200 md:hidden"
              aria-label="Ara"
              onClick={() => setSearchOpen((s) => !s)}
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={open}
              className="relative inline-flex h-11 items-center gap-2 rounded-full bg-espresso-900 pl-4 pr-4 text-sm font-semibold text-cream-50 transition-colors hover:bg-espresso-800 sm:pr-5"
              aria-label={`Sepet, ${totals.itemCount} ürün`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden sm:inline">Sepet</span>
              {hydrated && totals.itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-caramel-500 px-1.5 text-[0.7rem] font-bold text-espresso-950 ring-2 ring-cream-50">
                  {totals.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobil arama */}
        {searchOpen && (
          <div className="border-t border-espresso-900/10 bg-cream-50 md:hidden">
            <form onSubmit={onSearch} role="search" className="container-x flex items-center gap-2 py-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso-600" />
                <input
                  ref={searchRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün ara…"
                  aria-label="Ürün ara"
                  className="h-11 w-full rounded-full border border-espresso-900/10 bg-cream-100 pl-10 pr-4 text-sm focus:border-caramel-500 focus:outline-none"
                />
              </div>
              <button type="submit" className="h-11 rounded-full bg-espresso-900 px-4 text-sm font-semibold text-cream-50">
                Ara
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobil menü */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-espresso-950/50 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-cream-50 shadow-lift transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
        >
          <div className="flex h-[4.25rem] items-center justify-between border-b border-espresso-900/10 px-4">
            <Logo />
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-cream-200"
              aria-label="Menüyü kapat"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <p className="px-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-caramel-700">Kategoriler</p>
            <ul className="mt-2 space-y-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className="flex items-center gap-3 rounded-2xl px-2 py-2.5 text-base font-semibold text-espresso-900 hover:bg-cream-100"
                  >
                    <span
                      className="h-8 w-8 rounded-lg"
                      style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)` }}
                      aria-hidden="true"
                    />
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/urunler"
                  className="block rounded-2xl px-2 py-2.5 text-base font-bold text-caramel-700 hover:bg-cream-100"
                >
                  Tüm ürünler →
                </Link>
              </li>
            </ul>
            <p className="mt-6 px-2 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-caramel-700">Umba</p>
            <ul className="mt-2 space-y-1">
              {nav
                .filter((n) => !n.mega)
                .map((n) => (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className="block rounded-2xl px-2 py-2.5 text-base font-semibold text-espresso-900 hover:bg-cream-100"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/sss" className="block rounded-2xl px-2 py-2.5 text-base font-semibold text-espresso-900 hover:bg-cream-100">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>
          <div className="border-t border-espresso-900/10 p-4 text-sm">
            <a href={`tel:${site.contact.phoneHref}`} className="flex items-center gap-2 font-semibold text-espresso-900">
              <Phone className="h-4 w-4 text-caramel-600" /> {site.contact.phone}
            </a>
            <p className="mt-1 text-espresso-600">{site.contact.workingHours}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
