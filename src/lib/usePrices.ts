"use client";

import { useSyncExternalStore } from "react";
import { priceVersion, subscribePrices } from "./prices";

/** Fiyat/kargo deposu değişince bileşeni yeniden çizer (variant.price ve site.commerce güncel değeri okur). */
export function usePrices(): number {
  return useSyncExternalStore(subscribePrices, priceVersion, priceVersion);
}
