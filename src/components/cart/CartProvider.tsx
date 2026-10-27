"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import type { CartItem, CartLine } from "@/lib/types";
import { computeTotals, resolveLines, type Totals } from "@/lib/cart";
import { cartStore, getServerSnapshot, getSnapshot, subscribe } from "@/lib/cart-store";

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  totals: Totals;
  /** İstemcide localStorage okunduktan sonra true olur. */
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: CartItem, options?: { open?: boolean }) => void;
  setQuantity: (productSlug: string, variantId: string, quantity: number) => void;
  remove: (productSlug: string, variantId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [isOpen, setIsOpen] = useState(false);

  const lines = useMemo(() => resolveLines(items), [items]);
  const totals = useMemo(() => computeTotals(lines), [lines]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const add = useCallback((item: CartItem, options?: { open?: boolean }) => {
    cartStore.add(item);
    if (options?.open !== false) setIsOpen(true);
  }, []);
  const setQuantity = useCallback(
    (productSlug: string, variantId: string, quantity: number) => cartStore.setQuantity(productSlug, variantId, quantity),
    [],
  );
  const remove = useCallback((productSlug: string, variantId: string) => cartStore.remove(productSlug, variantId), []);
  const clear = useCallback(() => cartStore.clear(), []);

  const value = useMemo<CartContextValue>(
    () => ({ items, lines, totals, hydrated, isOpen, open, close, add, setQuantity, remove, clear }),
    [items, lines, totals, hydrated, isOpen, open, close, add, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalıdır.");
  return ctx;
}
