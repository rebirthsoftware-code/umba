"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { CartItem, CartLine } from "@/lib/types";
import { computeTotals, resolveLines, type Totals } from "@/lib/cart";
import { cartStore, getServerSnapshot, getSnapshot, subscribe } from "@/lib/cart-store";

export interface CartToast {
  id: number;
  productSlug: string;
  variantId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  lines: CartLine[];
  totals: Totals;
  /** İstemcide localStorage okunduktan sonra true olur. */
  hydrated: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Sepete ekler; varsayılan olarak çekmece yerine küçük bir bildirim gösterir. */
  add: (item: CartItem, options?: { open?: boolean; silent?: boolean }) => void;
  setQuantity: (productSlug: string, variantId: string, quantity: number) => void;
  remove: (productSlug: string, variantId: string) => void;
  clear: () => void;
  toast: CartToast | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const noopSubscribe = () => () => {};
export const TOAST_MS = 3200;

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);
  const toastTimer = useRef<number | null>(null);

  const lines = useMemo(() => resolveLines(items), [items]);
  const totals = useMemo(() => computeTotals(lines), [lines]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const add = useCallback((item: CartItem, options?: { open?: boolean; silent?: boolean }) => {
    cartStore.add(item);
    if (options?.open) {
      setIsOpen(true);
      return;
    }
    if (options?.silent) return;
    setToast({ id: Date.now(), ...item });
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [toast]);

  const setQuantity = useCallback(
    (productSlug: string, variantId: string, quantity: number) => cartStore.setQuantity(productSlug, variantId, quantity),
    [],
  );
  const remove = useCallback((productSlug: string, variantId: string) => cartStore.remove(productSlug, variantId), []);
  const clear = useCallback(() => cartStore.clear(), []);

  const value = useMemo<CartContextValue>(
    () => ({ items, lines, totals, hydrated, isOpen, open, close, add, setQuantity, remove, clear, toast, dismissToast }),
    [items, lines, totals, hydrated, isOpen, open, close, add, setQuantity, remove, clear, toast, dismissToast],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalıdır.");
  return ctx;
}
