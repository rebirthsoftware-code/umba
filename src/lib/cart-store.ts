"use client";

import type { CartItem } from "./types";
import { CART_STORAGE_KEY, lineKey } from "./cart";

/**
 * localStorage destekli, React dışı sepet deposu.
 * useSyncExternalStore ile bağlanır; sunucu tarafında boş sepet döner.
 */
const EMPTY: CartItem[] = [];
let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function isCartItem(i: unknown): i is CartItem {
  return (
    typeof i === "object" &&
    i !== null &&
    typeof (i as CartItem).productSlug === "string" &&
    typeof (i as CartItem).variantId === "string" &&
    typeof (i as CartItem).quantity === "number"
  );
}

function parse(raw: string | null): CartItem[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    items = parse(window.localStorage.getItem(CART_STORAGE_KEY));
  } catch {
    items = EMPTY;
  }
}

function emit() {
  for (const l of listeners) l();
}

function commit(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* yoksay */
  }
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key !== CART_STORAGE_KEY) return;
  items = parse(e.newValue);
  emit();
}

export function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): CartItem[] {
  load();
  return items;
}

export function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

export const cartStore = {
  add(item: CartItem) {
    const key = lineKey(item);
    const existing = items.find((i) => lineKey(i) === key);
    if (existing) {
      commit(items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.min(99, i.quantity + item.quantity) } : i)));
    } else {
      commit([...items, { ...item, quantity: Math.min(99, Math.max(1, item.quantity)) }]);
    }
  },
  setQuantity(productSlug: string, variantId: string, quantity: number) {
    const key = lineKey({ productSlug, variantId });
    if (quantity <= 0) {
      commit(items.filter((i) => lineKey(i) !== key));
    } else {
      commit(items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.min(99, quantity) } : i)));
    }
  },
  remove(productSlug: string, variantId: string) {
    const key = lineKey({ productSlug, variantId });
    commit(items.filter((i) => lineKey(i) !== key));
  },
  clear() {
    commit(EMPTY);
  },
};
