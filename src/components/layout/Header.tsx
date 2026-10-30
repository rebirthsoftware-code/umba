"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Phone, Search, ShoppingBag, Truck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { categories } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { site } from "@/lib/site";
import { usePrices } from "@/lib/usePrices";
import { cn, formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { CategoryTile } from "@/components/product/CategoryTile";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { MobileMenu } from "./MobileMenu";

const nav = [
  { href: "/urunler", label: "Ürünler", mega: true },
  { href: "/kurumsal", label: "Kurumsal & Bayilik" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  usePrices();
  const pathname = usePathname();
  const router = useRouter();
  const { totals, open: openCart, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimer = useRef<number | null>(null);
  const lastY = useRef(0);

  // Kaydırma: gölge + aşağı kaydırınca gizle, yukarı kaydırınca göster
  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 140);
        lastY.current = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ctrl/Cmd + K ile arama
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Rota değişince menüleri kapat (render sırasında state ayarlama deseni)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
  }

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openSearchFromMenu = useCallback(() => {
    setMenuOpen(false);
    window.setTimeout(() => setSearchOpen(true), 150);
  }, []);

  const openMega = () => {
    if (megaTimer.current) window.clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    megaTimer.current = window.setTimeout(() => setMegaOpen(false), 120);
  };
  const lastPointer = useRef<string>("");
  /* Fare: hover açar, tıklama tüm ürünlere gider. Dokunmatik/klavye: dokunma açar-kapatır. */
  const onMegaClick = () => {
    if (lastPointer.current === "mouse") {
      router.push("/urunler");
      return;
    }
    if (megaTimer.current) window.clearTimeout(megaTimer.current);
    setMegaOpen((o) => !o);
  };
  const megaRef = useRef<HTMLDivElement>(null);
  // Dışarı tıklayınca açılır menüyü kapat (dokunmatik ekranlarda hover yok)
  useEffect(() => {
    if (!megaOpen) return;
    const onDown = (e: PointerEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [megaOpen]);

  const isActive = (href: string) =>
    href === "/urunler"
      ? pathname.startsWith("/urunler") || pathname.startsWith("/kategori") || pathname.startsWith("/urun/")
      : pathname.startsWith(href);

  return (
    <>
      {/* Duyuru çubuğu (sayfayla birlikte kayar) */}
      <div className="bg-espresso-950 text-cream-100">
        <div className="container-x flex h-9 items-center justify-between text-xs">
          <p className="flex items-center gap-2 font-medium">
            <Truck className="h-3.5 w-3.5 text-caramel-400" />
            <span>
              <span className="font-bold text-caramel-300">{formatPrice(site.commerce.freeShippingThreshold)}</span> ve üzeri
              siparişlerde kargo bedava
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

      <header
        className={cn(
          "sticky top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          hidden && !menuOpen && !searchOpen && !megaOpen ? "-translate-y-full" : "translate-y-0",
        )}
      >
        <div
          className={cn(
            "border-b transition-all duration-300",
            scrolled
              ? "border-espresso-900/10 bg-cream-50/85 shadow-[0_8px_30px_-20px_rgb(43_27_18/0.35)] backdrop-blur-xl"
              : "border-transparent bg-cream-50",
          )}
        >
          <div className="container-x flex h-[4.25rem] items-center gap-3 lg:h-20">
            <button
              type="button"
              className="hamburger -ml-2 text-espresso-900 hover:bg-cream-200 lg:hidden"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              data-open={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
              <span />
            </button>

            <Logo className="mr-2" />

            <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Ana menü">
              {nav.map((item) =>
                item.mega ? (
                  <div
                    key={item.href}
                    ref={megaRef}
                    className="relative"
                    onPointerEnter={(e) => e.pointerType === "mouse" && openMega()}
                    onPointerLeave={(e) => e.pointerType === "mouse" && closeMega()}
                  >
                    <button
                      type="button"
                      onPointerDown={(e) => {
                        lastPointer.current = e.pointerType;
                      }}
                      onKeyDown={() => {
                        lastPointer.current = "keyboard";
                      }}
                      onClick={onMegaClick}
                      className={cn(
                        "inline-flex h-10 items-center gap-1 rounded-full px-4 text-sm font-semibold transition-colors",
                        isActive(item.href) || megaOpen ? "bg-cream-200 text-espresso-900" : "text-espresso-800 hover:bg-cream-200",
                      )}
                      aria-haspopup="menu"
                      aria-expanded={megaOpen}
                      aria-controls="mega-urunler"
                    >
                      {item.label}
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", megaOpen && "rotate-180")} />
                    </button>
                    <div
                      id="mega-urunler"
                      className={cn(
                        "absolute left-0 top-full z-50 w-[48rem] pt-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        megaOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
                      )}
                      onFocus={openMega}
                      onBlur={closeMega}
                    >
                      <div className="rounded-2xl border border-espresso-900/10 bg-cream-50 p-4 shadow-lift">
                        <div className="grid grid-cols-3 gap-2">
                          {categories.map((c, i) => {
                            const sample = getProductsByCategory(c.slug)[0];
                            return (
                              <Link
                                key={c.slug}
                                prefetch={false}
                                href={`/kategori/${c.slug}`}
                                style={{ transitionDelay: megaOpen ? `${i * 40}ms` : "0ms" }}
                                className={cn(
                                  "group/item flex items-center gap-3 rounded-2xl border border-transparent p-2.5 pr-4 transition-all duration-300 hover:border-espresso-900/10 hover:bg-cream-100",
                                  megaOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                                )}
                              >
                                <CategoryTile
                                  category={c}
                                  sample={sample}
                                  className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-xl bg-cream-100 transition-colors group-hover/item:bg-cream-50"
                                  imgClassName="p-1.5 transition-transform duration-500 group-hover/item:scale-110"
                                />
                                <span className="min-w-0">
                                  <span className="block text-sm font-bold text-espresso-900 group-hover/item:text-caramel-700">{c.name}</span>
                                  <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-espresso-600">{c.tagline}</span>
                                </span>
                              </Link>
                            );
                          })}
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
              <SearchTrigger onOpen={() => setSearchOpen(true)} className="hidden w-60 md:flex lg:w-72" />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-espresso-900 hover:bg-cream-200 md:hidden"
                aria-label="Ara"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={openCart}
                className="group relative inline-flex h-11 items-center gap-2 rounded-full bg-espresso-900 px-4 text-sm font-semibold text-cream-50 transition-all hover:bg-espresso-800 hover:shadow-card sm:pr-5"
                aria-label={`Sepet, ${totals.itemCount} ürün`}
              >
                <ShoppingBag className="h-5 w-5 transition-transform group-hover:-rotate-6" />
                <span className="hidden sm:inline">Sepet</span>
                {hydrated && totals.itemCount > 0 && (
                  <span
                    key={totals.itemCount}
                    className="absolute -right-1 -top-1 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-caramel-500 px-1.5 text-[0.7rem] font-bold text-espresso-950 ring-2 ring-cream-50"
                  >
                    {totals.itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} onSearch={openSearchFromMenu} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
