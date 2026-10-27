"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getProduct } from "@/lib/products";
import { addRecentlyViewed, getServerSnapshot, getSnapshot, subscribe } from "@/lib/recently-viewed";
import { ProductRail } from "./ProductRail";

export function TrackView({ slug }: { slug: string }) {
  useEffect(() => {
    addRecentlyViewed(slug);
  }, [slug]);
  return null;
}

export function RecentlyViewed({ exclude }: { exclude: string }) {
  const slugs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = slugs.filter((s) => s !== exclude).map((s) => getProduct(s)).filter((p): p is NonNullable<typeof p> => Boolean(p));
  if (items.length < 1) return null;
  return (
    <section className="container-x py-12">
      <h2 className="font-display text-3xl font-semibold text-espresso-900">Son görüntülediğiniz ürünler</h2>
      <div className="mt-8">
        <ProductRail products={items} ariaLabel="Son görüntülenen ürünler" />
      </div>
    </section>
  );
}
