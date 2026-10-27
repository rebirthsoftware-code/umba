"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Plus, ShoppingBag, Check } from "lucide-react";
import { getProduct, minPrice } from "@/lib/products";
import { formatPrice, cn } from "@/lib/format";
import { DrinkArt, type DrinkKind } from "@/components/product/DrinkArt";
import { ProductArt } from "@/components/product/ProductArt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useCart } from "@/components/cart/CartProvider";

interface Drink {
  id: string;
  label: string;
  kind: DrinkKind;
  hero: string;
  tagline: string;
  steps: string[];
  products: string[];
}

const drinks: Drink[] = [
  {
    id: "latte",
    label: "Aromalı Latte",
    kind: "mug",
    hero: "vanilya-surubu",
    tagline: "Her kafenin en çok satan ikilisi: vanilya ve karamel latte.",
    steps: ["20–30 ml şurup bardağa", "1 shot Signature espresso", "180 ml buharlanmış süt, üstüne sos"],
    products: ["vanilya-surubu", "karamel-surubu", "umba-signature-espresso", "karamel-sosu"],
  },
  {
    id: "iced",
    label: "Soğuk Kahve",
    kind: "glass",
    hero: "karamel-surubu",
    tagline: "Iced latte, cold brew ve frappuccino tarzı soğuk kahveler.",
    steps: ["30 ml şurup + buz", "2 shot espresso", "Soğuk süt ile tamamlayın"],
    products: ["karamel-surubu", "findik-surubu", "sekersiz-vanilya-surubu", "umba-signature-espresso"],
  },
  {
    id: "frozen",
    label: "Frozen & Smoothie",
    kind: "glass",
    hero: "mango-puresi",
    tagline: "Gerçek meyveli, buz gibi; yazın en çok dönen içecekleri.",
    steps: ["80 g püre + 200 g buz", "40 ml limonata konsantresi", "Blender'da 30 saniye"],
    products: ["mango-puresi", "cilek-puresi", "karpuz-puresi", "limonata-konsantresi"],
  },
  {
    id: "soda",
    label: "Soda & Limonata",
    kind: "glass",
    hero: "cilek-surubu",
    tagline: "Renkli, ferah, fotoğraf çektiren içecekler.",
    steps: ["30–40 ml şurup", "Soda ve bol buz", "Nane ya da meyve dilimi"],
    products: ["cilek-surubu", "yesil-elma-surubu", "blue-curacao-surubu", "limonata-konsantresi"],
  },
  {
    id: "hot",
    label: "Sıcak Çikolata & Mocha",
    kind: "mug",
    hero: "klasik-sicak-cikolata",
    tagline: "Kış menüsünün kalbi: kıvamlı sıcak çikolata ve mocha.",
    steps: ["30 g sıcak çikolata tozu", "180 ml sıcak süt", "Krem şanti ve çikolata sosu"],
    products: ["klasik-sicak-cikolata", "cikolata-sosu", "beyaz-cikolata-sosu", "findik-surubu"],
  },
  {
    id: "frappe",
    label: "Frappe & Milkshake",
    kind: "frappe",
    hero: "vanilya-frappe-tozu",
    tagline: "Tek adımda kremamsı frappe; şurupla sonsuz çeşit.",
    steps: ["40 g frappe tozu + 150 ml süt", "Bir avuç buz, blender", "Püre veya sosla çeşitlendirin"],
    products: ["vanilya-frappe-tozu", "cikolata-frappe-tozu", "cilek-puresi", "karamel-sosu"],
  },
];

export function DrinkFinder() {
  const [activeId, setActiveId] = useState(drinks[0].id);
  const [added, setAdded] = useState(false);
  const { add, open } = useCart();
  const drink = drinks.find((d) => d.id === activeId)!;
  const hero = getProduct(drink.hero)!;
  const items = drink.products.map((s) => getProduct(s)!).filter(Boolean);
  const setTotal = items.reduce((s, p) => s + p.variants[0].price, 0);

  const addSet = () => {
    for (const p of items) add({ productSlug: p.slug, variantId: p.variants[0].id, quantity: 1 }, { silent: true });
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      open();
    }, 700);
  };

  return (
    <section className="container-x py-20 sm:py-28" id="icecek-bul">
      <SectionHeading
        eyebrow="İçeceğinizi seçin"
        title="Ne yapmak istiyorsunuz? Ürünleri biz bulalım."
        description="Menünüzdeki içeceği seçin; gereken ürünleri, dozajı ve set fiyatını tek bakışta görün."
      />

      {/* Sekmeler */}
      <div className="scrollbar-none -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="İçecek türleri">
        {drinks.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={d.id === activeId}
            onClick={() => setActiveId(d.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
              d.id === activeId
                ? "border-espresso-900 bg-espresso-900 text-cream-50"
                : "border-espresso-900/15 bg-cream-50 text-espresso-800 hover:border-espresso-900",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-12">
        {/* İçecek paneli */}
        <div
          key={drink.id}
          className="grain relative flex min-h-[26rem] min-w-0 animate-pop-in flex-col justify-between overflow-hidden rounded-[1.75rem] bg-espresso-950 p-7 text-cream-50 lg:col-span-5 lg:p-9"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3" style={{ background: `linear-gradient(180deg, transparent, ${hero.color}40)` }} />
          <div className="relative">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cream-50/80">Seçiminiz</p>
            <h3 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{drink.label}</h3>
            <p className="mt-2 max-w-xs text-sm text-cream-50/85">{drink.tagline}</p>
          </div>
          <div className="relative mt-6 flex items-end gap-5">
            <DrinkArt product={hero} kind={drink.kind} className="h-56 w-auto shrink-0 drop-shadow-2xl sm:h-64" />
            <ol className="space-y-2 text-sm">
              {drink.steps.map((s, i) => (
                <li key={s} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cream-50/20 text-[0.65rem] font-bold">{i + 1}</span>
                  <span className="text-cream-50/95">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Ürünler */}
        <div className="flex min-w-0 flex-col rounded-[1.75rem] border border-espresso-900/10 bg-cream-50 p-5 lg:col-span-7 lg:p-7">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-espresso-600">Gerekenler · {items.length} ürün</p>
            <Link href="/urunler" className="text-sm font-bold text-espresso-900 hover:underline">
              Tüm ürünler
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {items.map((p, i) => (
              <li key={`${drink.id}-${p.slug}`} style={{ animationDelay: `${i * 60}ms` }} className="min-w-0 animate-pop-in">
                <ProductMini product={p} />
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 border-t border-espresso-900/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-espresso-600">Set fiyatı ({items.length} ürün, başlangıç boyları)</p>
              <p className="font-display text-2xl font-semibold text-espresso-900">{formatPrice(setTotal)}</p>
            </div>
            <button
              type="button"
              onClick={addSet}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-all active:scale-[0.98]",
                added ? "bg-leaf-500 text-cream-50" : "bg-espresso-900 text-cream-50 hover:bg-espresso-800",
              )}
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
              {added ? "Set eklendi" : "Seti sepete ekle"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductMini({ product }: { product: ReturnType<typeof getProduct> & object }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const p = product;
  return (
    <div className="group relative flex min-w-0 items-center gap-3 rounded-xl border border-espresso-900/10 bg-cream-50 p-3 transition-colors hover:bg-cream-100">
      <span className="flex h-16 w-14 shrink-0 items-center justify-center rounded-xl" style={{ background: `radial-gradient(120% 90% at 50% 100%, ${p.color}33 0%, transparent 60%), #f3ebdf` }}>
        <ProductArt product={p} className="h-[84%] w-auto drop-shadow transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
      </span>
      <div className="min-w-0 flex-1">
        <Link href={`/urun/${p.slug}`} className="block truncate text-sm font-bold text-espresso-900 after:absolute after:inset-0">
          {p.name}
        </Link>
        <p className="text-xs text-espresso-600">
          {p.variants[0].label} · <span className="font-semibold text-espresso-800">{formatPrice(minPrice(p))}</span>
        </p>
      </div>
      <button
        type="button"
        aria-label={`${p.name} sepete ekle`}
        onClick={() => {
          add({ productSlug: p.slug, variantId: p.variants[0].id, quantity: 1 });
          setDone(true);
          window.setTimeout(() => setDone(false), 1200);
        }}
        className={cn(
          "relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
          done ? "border-leaf-500 bg-leaf-500 text-cream-50" : "border-espresso-900/15 hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50",
        )}
      >
        {done ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
      <ArrowUpRight className="sr-only" />
    </div>
  );
}
