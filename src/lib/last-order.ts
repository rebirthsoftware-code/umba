"use client";

import { useSyncExternalStore } from "react";
import type { OrderRecord } from "./order";

/** Son siparişi oturum depolamasında tutan küçük dış depo (ödeme adımları arasında taşımak için). */
const KEY = "umba:lastOrder";
let cachedRaw: string | null | undefined;
let cached: OrderRecord | null = null;
const listeners = new Set<() => void>();

function read(): OrderRecord | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cached = raw ? (JSON.parse(raw) as OrderRecord) : null;
    }
  } catch {
    cached = null;
  }
  return cached;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function saveLastOrder(order: OrderRecord) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    /* yoksay */
  }
  for (const l of listeners) l();
}

export function updateLastOrder(patch: Partial<OrderRecord>) {
  const current = read();
  if (!current) return;
  saveLastOrder({ ...current, ...patch });
}

export function useLastOrder(): OrderRecord | null {
  return useSyncExternalStore(subscribe, read, () => null);
}
