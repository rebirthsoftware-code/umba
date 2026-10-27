"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { ArrowRight, Clock, CornerDownLeft, Search, Sparkles, TrendingUp, X } from "lucide-react";
import { categories } from "@/lib/categories";
import { getProductsByCategory, minPrice } from "@/lib/products";
import { searchProducts, countResults, highlight, popularSearches } from "@/lib/search";
import { addRecentSearch, clearRecentSearches, getServerSnapshot, getSnapshot, subscribe } from "@/lib/recent-searches";
import { formatPrice, cn } from "@/lib/format";
import { ProductArt } from "@/components/product/ProductArt";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const recent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Kapanınca sorguyu sıfırla (render sırasında state ayarlama deseni)
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const hits = useMemo(() => searchProducts(query, 7), [query]);
  const total = useMemo(() => (query.trim() ? countResults(query) : 0), [query]);
  const hasQuery = query.trim().length > 0;

  const entries = useMemo(() => {
    if (!hasQuery) return [] as { href: string; label: string }[];
    const list = hits.map((h) => ({ href: `/urun/${h.product.slug}`, label: h.product.name }));
    list.push({ href: `/urunler?q=${encodeURIComponent(query.trim())}`, label: "Tüm sonuçlar" });
    return list;
  }, [hits, hasQuery, query]);

  const go = (href: string, remember = true) => {
    if (remember && hasQuery) addRecentSearch(query);
    onClose();
    router.push(href);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(entries.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = entries[active] ?? entries[entries.length - 1];
      if (target) go(target.href);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div
      className={cn("fixed inset-0 z-[60]", open ? "pointer-events-auto" : "pointer-events-none")}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label="Ürün ara"
    >
      <div
        className={cn(
          "absolute inset-0 bg-espresso-950/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-0 flex justify-center px-3 pt-3 sm:pt-[8vh]">
        <div
          className={cn(
            "flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.75rem] border border-espresso-900/10 bg-cream-50 shadow-lift transition-all duration-300",
            open ? "translate-y-0 scale-100 opacity-100" : "-translate-y-3 scale-[0.98] opacity-0",
          )}
        >
          {/* Giriş */}
          <div className="relative flex items-center gap-3 border-b border-espresso-900/10 px-4 py-3 sm:px-5">
            <Search className="h-5 w-5 shrink-0 text-caramel-600" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Ne arıyorsunuz? Aroma, kategori, ürün…"
              aria-label="Ürün ara"
              autoComplete="off"
              className="h-12 flex-1 bg-transparent text-base text-espresso-900 placeholder:text-espresso-600/60 focus:outline-none sm:text-lg [&::-webkit-search-cancel-button]:hidden"
            />
            {hasQuery && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="rounded-full px-2 py-1 text-xs font-semibold text-espresso-600 hover:bg-cream-200"
              >
                Temizle
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Aramayı kapat"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-200"
            >
              <X className="h-5 w-5" />
            </button>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-caramel-400 via-caramel-600 to-berry-500 transition-all duration-500"
              style={{ width: hasQuery ? "100%" : "0%" }}
            />
          </div>

          {/* Gövde */}
          <div ref={listRef} className="flex-1 overflow-y-auto overscroll-contain">
            {!hasQuery ? (
              <div className="space-y-6 p-4 sm:p-5">
                {recent.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between">
                      <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">
                        <Clock className="h-3.5 w-3.5" /> Son aramalar
                      </h3>
                      <button type="button" onClick={clearRecentSearches} className="text-xs font-semibold text-espresso-600 hover:text-berry-500">
                        Temizle
                      </button>
                    </div>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setQuery(r)}
                          className="rounded-full border border-espresso-900/15 bg-cream-50 px-3.5 py-1.5 text-sm font-semibold text-espresso-800 transition-colors hover:border-espresso-900 hover:bg-cream-100"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </section>
                )}
                <section>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">
                    <TrendingUp className="h-3.5 w-3.5" /> Popüler aramalar
                  </h3>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {popularSearches.map((p, i) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setQuery(p)}
                        style={{ animationDelay: `${i * 35}ms` }}
                        className={cn(
                          "rounded-full bg-cream-200 px-3.5 py-1.5 text-sm font-semibold text-espresso-800 transition-all hover:-translate-y-0.5 hover:bg-caramel-300",
                          open && "animate-pop-in",
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">
                    <Sparkles className="h-3.5 w-3.5" /> Kategoriler
                  </h3>
                  <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {categories.map((c, i) => {
                      const sample = getProductsByCategory(c.slug)[0];
                      return (
                        <Link
                          key={c.slug}
                          href={`/kategori/${c.slug}`}
                          onClick={() => onClose()}
                          style={{ animationDelay: `${120 + i * 40}ms`, background: `linear-gradient(135deg, ${c.colorSoft}, #fdfaf5)` }}
                          className={cn(
                            "group relative flex h-20 items-center overflow-hidden rounded-2xl border border-espresso-900/5 pl-3 pr-14 transition-all hover:-translate-y-0.5 hover:shadow-card",
                            open && "animate-pop-in",
                          )}
                        >
                          <span>
                            <span className="block text-sm font-bold text-espresso-900">{c.name}</span>
                            <span className="block text-[0.7rem] text-espresso-600">{getProductsByCategory(c.slug).length} ürün</span>
                          </span>
                          {sample && (
                            <ProductArt
                              product={sample}
                              className="absolute -right-1 bottom-1 h-[88%] w-auto drop-shadow-md transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : hits.length === 0 ? (
              <div className="p-10 text-center">
                <p className="font-display text-xl font-semibold text-espresso-900">“{query}” için sonuç yok</p>
                <p className="mt-1 text-sm text-espresso-600">Farklı bir kelime deneyin ya da kategorilere göz atın.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {categories.slice(0, 4).map((c) => (
                    <Link key={c.slug} href={`/kategori/${c.slug}`} onClick={onClose} className="rounded-full bg-cream-200 px-3.5 py-1.5 text-sm font-semibold hover:bg-caramel-300">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="p-2 sm:p-3">
                {hits.map((h, i) => {
                  const p = h.product;
                  const isActive = active === i;
                  return (
                    <li key={p.slug} data-index={i} style={{ animationDelay: `${i * 30}ms` }} className="animate-pop-in">
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(`/urun/${p.slug}`)}
                        className={cn(
                          "flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-left transition-colors",
                          isActive ? "bg-cream-200" : "hover:bg-cream-100",
                        )}
                      >
                        <span
                          className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: `radial-gradient(120% 90% at 50% 100%, ${p.color}33 0%, transparent 60%), #f3ebdf` }}
                        >
                          <ProductArt product={p} className="h-[84%] w-auto drop-shadow" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-espresso-900">
                            {highlight(p.name, query).map((part, j) =>
                              part.hit ? (
                                <mark key={j} className="hit">
                                  {part.text}
                                </mark>
                              ) : (
                                <span key={j}>{part.text}</span>
                              ),
                            )}
                          </span>
                          <span className="block truncate text-xs text-espresso-600">
                            {categories.find((c) => c.slug === p.category)?.name} · {p.short}
                          </span>
                        </span>
                        <span className="shrink-0 text-sm font-bold tabular-nums text-espresso-900">{formatPrice(minPrice(p))}</span>
                        <CornerDownLeft className={cn("h-4 w-4 shrink-0 text-espresso-600 transition-opacity", isActive ? "opacity-100" : "opacity-0")} />
                      </button>
                    </li>
                  );
                })}
                <li data-index={hits.length} className="mt-1">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(hits.length)}
                    onClick={() => go(`/urunler?q=${encodeURIComponent(query.trim())}`)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-colors",
                      active === hits.length ? "bg-espresso-900 text-cream-50" : "bg-cream-100 text-espresso-900 hover:bg-cream-200",
                    )}
                  >
                    <span>
                      Tüm sonuçları gör <span className="opacity-70">({total})</span>
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* Alt bilgi */}
          <div className="hidden items-center justify-between border-t border-espresso-900/10 bg-cream-100 px-5 py-2.5 text-[0.7rem] text-espresso-600 sm:flex">
            <span className="flex items-center gap-3">
              <span>
                <kbd className="rounded border border-espresso-900/15 bg-cream-50 px-1.5 py-0.5 font-sans">↑</kbd>{" "}
                <kbd className="rounded border border-espresso-900/15 bg-cream-50 px-1.5 py-0.5 font-sans">↓</kbd> gezin
              </span>
              <span>
                <kbd className="rounded border border-espresso-900/15 bg-cream-50 px-1.5 py-0.5 font-sans">↵</kbd> aç
              </span>
              <span>
                <kbd className="rounded border border-espresso-900/15 bg-cream-50 px-1.5 py-0.5 font-sans">esc</kbd> kapat
              </span>
            </span>
            <span className="font-semibold">Umba Arama</span>
          </div>
        </div>
      </div>
    </div>
  );
}
