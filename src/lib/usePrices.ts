"use client";

import { useSyncExternalStore } from "react";
import { priceVersion, subscribePrices } from "./prices";

/** Fiyat deposu değişince bileşeni yeniden çizer (variant.price güncel değeri okur). */
export function usePrices(): number {
  return useSyncExternalStore(subscribePrices, priceVersion, () => 0);
}
