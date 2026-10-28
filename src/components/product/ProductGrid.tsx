"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, Sparkles } from "lucide-react";
import type { Product, ProductTag, CategorySlug } from "@/lib/types";
import { categories } from "@/lib/categories";
import { minPrice } from "@/lib/products";
import { popularSearches } from "@/lib/search";
import { normalizeTr, trCollator, cn } from "@/lib/format";
import { ProductCard } from "./ProductCard";

type Sort = "onerilen" | "fiyat-artan" | "fiyat-azalan" | "ad";

const sortOptions: { value: Sort; label: string }[] = [
  { value: "onerilen", label: "Önerilen" },
  { value: "fiyat-artan", label: "Fiyat: düşükten yükseğe" },
  { value: "fiyat-azalan", label: "Fiyat: yüksekten düşüğe" },
  { value: "ad", label: "Ada göre (A–Z)" },
];

const tagOptions: { value: ProductTag; label: string }[] = [
  { value: "cok-satan", label: "Çok satan" },
  { value: "yeni", label: "Yeni" },
  { value: "sekersiz", label: "Şekersiz" },
  { value: "vegan", label: "Vegan" },
  { value: "single-origin", label: "Single origin" },
];

export function ProductGrid({
  products,
  lockedCategory,
}: {
  products: Product[];
  /** Kategori sayfasında kategori filtresi gizlenir. */
  lockedCategory?: CategorySlug;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const q = params.get("q") ?? "";
  const cat = (params.get("kategori") as CategorySlug | null) ?? null;
  const tag = (params.get("etiket") as ProductTag | null) ?? null;
  const sort = (params.get("sirala") as Sort | null) ?? "onerilen";

  const [search, setSearch] = useState(q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) {
    setPrevQ(q);
    setSearch(q);
  }
  const inputRef = useRef<HTMLInputElement>(null);

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  // Yazarken anında filtrele; URL'yi kısa bir gecikmeyle güncelle (geri tuşu ve paylaşım için).
  useEffect(() => {
    if (search === q) return;
    const t = window.setTimeout(() => update({ q: search.trim() }), 350);
    return () => window.clearTimeout(t);
  }, [search, q, update]);

  const filtered = useMemo(() => {
    const nq = normalizeTr(search.trim());
    let list = products;
    if (cat && !lockedCategory) list = list.filter((p) => p.category === cat);
    if (tag) list = list.filter((p) => p.tags.includes(tag));
    if (nq) {
      list = list.filter((p) => {
        const hay = normalizeTr(`${p.name} ${p.short} ${p.description} ${p.tags.join(" ")}`);
        return nq.split(/\s+/).every((t) => hay.includes(t));
      });
    }
    const sorted = [...list];
    switch (sort) {
      case "fiyat-artan":
        sorted.sort((a, b) => minPrice(a) - minPrice(b));
        break;
      case "fiyat-azalan":
        sorted.sort((a, b) => minPrice(b) - minPrice(a));
        break;
      case "ad":
        sorted.sort((a, b) => trCollator.compare(a.name, b.name));
        break;
      default:
        sorted.sort((a, b) => Number(b.tags.includes("cok-satan")) - Number(a.tags.includes("cok-satan")));
    }
    return sorted;
  }, [products, search, cat, tag, sort, lockedCategory]);

  const activeCount = [search.trim(), cat && !lockedCategory ? cat : null, tag].filter(Boolean).length;
  const suggestions = popularSearches.filter((s) => normalizeTr(s) !== normalizeTr(search.trim())).slice(0, 6);

  const Filters = (
    <div className="space-y-7">
      {!lockedCategory && (
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Kategori</p>
          <ul className="mt-2 space-y-1">
            <li>
              <button
                type="button"
                onClick={() => update({ kategori: null })}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
                  !cat ? "bg-espresso-900 text-cream-50" : "hover:bg-cream-200",
                )}
              >
                Tümü <span className="text-xs opacity-70">{products.length}</span>
              </button>
            </li>
            {categories.map((c) => {
              const n = products.filter((p) => p.category === c.slug).length;
              return (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => update({ kategori: cat === c.slug ? null : c.slug })}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
                      cat === c.slug ? "bg-espresso-900 text-cream-50" : "hover:bg-cream-200",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
                      {c.name}
                    </span>
                    <span className="text-xs opacity-70">{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-espresso-600">Etiket</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tagOptions.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => update({ etiket: tag === t.value ? null : t.value })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                tag === t.value
                  ? "border-espresso-900 bg-espresso-900 text-cream-50"
                  : "border-espresso-900/15 bg-cream-50 hover:border-espresso-900",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            update({ q: null, kategori: null, etiket: null });
          }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-berry-500 hover:underline"
        >
          <X className="h-4 w-4" /> Filtreleri temizle
        </button>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-12">
      {/* Masaüstü filtreler */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-28 rounded-2xl border border-espresso-900/5 bg-cream-100 p-5">{Filters}</div>
      </aside>

      <div className="lg:col-span-9">
        {/* Arama çubuğu */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: search.trim() });
            inputRef.current?.blur();
          }}
          className="relative"
        >
          <label htmlFor="grid-search" className="sr-only">
            Ürün ara
          </label>
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-espresso-600" />
          <input
            ref={inputRef}
            id="grid-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setSearch("");
            }}
            placeholder={lockedCategory ? "Bu kategoride ara: aroma, ürün adı…" : "Ürün, aroma veya kategori ara…"}
            autoComplete="off"
            enterKeyHint="search"
            className="h-14 w-full rounded-full border border-espresso-900/10 bg-cream-50 pl-14 pr-28 [&::-webkit-search-cancel-button]:hidden text-base shadow-card transition-[border-color,box-shadow] focus:border-espresso-900 focus:shadow-lift focus:outline-none sm:text-lg"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  inputRef.current?.focus();
                }}
                aria-label="Aramayı temizle"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-espresso-600 hover:bg-cream-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <span className="hidden rounded-full bg-espresso-900 px-3 py-1.5 text-xs font-bold text-cream-50 sm:inline-flex" aria-live="polite">
              {filtered.length} sonuç
            </span>
          </div>
        </form>
        <div className="mt-3 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="inline-flex shrink-0 items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-espresso-600">
            <Sparkles className="h-3.5 w-3.5" /> Popüler
          </span>
          {suggestions.map((sg) => (
            <button
              key={sg}
              type="button"
              onClick={() => setSearch(sg)}
              className="shrink-0 rounded-full border border-espresso-900/15 bg-cream-50 px-3 py-1.5 text-xs font-semibold transition-colors hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50"
            >
              {sg}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-espresso-700">
            <span className="font-bold text-espresso-900">{filtered.length}</span> ürün
            {search.trim() && (
              <>
                {" "}
                · “<mark className="rounded bg-caramel-300/60 px-1 font-semibold text-espresso-900">{search.trim()}</mark>” için sonuçlar
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-espresso-900/15 px-4 text-sm font-semibold lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filtrele
              {activeCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-caramel-500 text-[0.65rem] font-bold text-espresso-950">
                  {activeCount}
                </span>
              )}
            </button>
            <label className="sr-only" htmlFor="sort">
              Sırala
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => update({ sirala: e.target.value === "onerilen" ? null : e.target.value })}
              className="h-10 rounded-full border border-espresso-900/15 bg-cream-50 px-4 pr-9 text-sm font-semibold focus:border-caramel-500 focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-espresso-900/15 p-12 text-center">
            <p className="font-display text-2xl font-semibold text-espresso-900">“{search.trim() || "Bu filtreler"}” için sonuç yok</p>
            <p className="mt-2 text-sm text-espresso-600">Yazımı kontrol edin, daha kısa bir kelime deneyin ya da popüler aramalardan birini seçin.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {popularSearches.slice(0, 5).map((sg) => (
                <button key={sg} type="button" onClick={() => setSearch(sg)} className="rounded-full border border-espresso-900/15 px-3 py-1.5 text-xs font-semibold hover:bg-cream-200">
                  {sg}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                update({ q: null, kategori: null, etiket: null });
              }}
              className="mt-5 inline-flex h-11 items-center rounded-full bg-espresso-900 px-6 text-sm font-semibold text-cream-50"
            >
              Filtreleri temizle
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 lg:gap-5">
            {filtered.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 6} />
            ))}
          </div>
        )}
      </div>

      {/* Mobil filtre paneli */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", filtersOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn("absolute inset-0 bg-espresso-950/50 transition-opacity", filtersOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setFiltersOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[2rem] bg-cream-50 p-6 transition-transform duration-300",
            filtersOpen ? "translate-y-0" : "translate-y-full",
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Filtreler"
        >
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Filtreler</h2>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label="Kapat"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {Filters}
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="mt-6 h-12 w-full rounded-full bg-espresso-900 text-sm font-bold text-cream-50"
          >
            {filtered.length} ürünü göster
          </button>
        </div>
      </div>
    </div>
  );
}
