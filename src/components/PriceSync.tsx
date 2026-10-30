"use client";

import { useEffect, type ReactNode } from "react";
import { setPriceOverrides, setCommerceSettings, getPriceOverrides, getCommerceSettings, type PriceOverrides, type CommerceSettings } from "@/lib/prices";
import { site } from "@/lib/site";

const KEY = "umba:prices:v2";

export interface PriceSnapshot {
  prices: PriceOverrides;
  commerce: CommerceSettings;
}

function apply(snap: Partial<PriceSnapshot>) {
  const cur = getPriceOverrides();
  const curC = getCommerceSettings();
  const samePrices = snap.prices && JSON.stringify(snap.prices) === JSON.stringify(cur);
  const sameCommerce = snap.commerce && snap.commerce.shippingFee === curC.shippingFee && snap.commerce.freeShippingThreshold === curC.freeShippingThreshold;
  if (snap.prices && !samePrices) setPriceOverrides(snap.prices);
  if (snap.commerce && !sameCommerce) setCommerceSettings(snap.commerce);
}

/**
 * Fiyat ve kargo ayarlarını istemci tarafına taşır.
 * - `initial`: sunucuda (layout) veritabanından okunan değerler; render sırasında
 *   depoya yazılır ki sunucu HTML'i ile istemci ilk çizimi aynı olsun.
 * - Sonra /api/prices ile tazelenir (panelden yapılan değişiklikler, önbellekli sayfalar).
 */
export function PriceProvider({ initial, children }: { initial: PriceSnapshot; children: ReactNode }) {
  apply(initial);
  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(KEY);
      if (cached) apply(JSON.parse(cached) as Partial<PriceSnapshot>);
    } catch {
      /* yoksay */
    }
    if (!site.api.url) return;
    const ctrl = new AbortController();
    fetch(`${site.api.url}/prices`, { signal: ctrl.signal, headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Partial<PriceSnapshot> | null) => {
        if (!data?.prices) return;
        apply(data);
        try {
          window.localStorage.setItem(KEY, JSON.stringify({ prices: data.prices, commerce: data.commerce }));
        } catch {
          /* yoksay */
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  return <>{children}</>;
}
