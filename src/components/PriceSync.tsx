"use client";

import { useEffect } from "react";
import { setPriceOverrides, type PriceOverrides } from "@/lib/prices";
import { site } from "@/lib/site";

const KEY = "umba:prices:v1";

/** Güncel fiyatları (yönetim panelinden girilen) istemciye yükler. */
export function PriceSync() {
  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(KEY);
      if (cached) setPriceOverrides(JSON.parse(cached) as PriceOverrides);
    } catch {
      /* yoksay */
    }
    if (!site.api.url) return;
    const ctrl = new AbortController();
    fetch(`${site.api.url}/prices`, { signal: ctrl.signal, headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { prices?: PriceOverrides } | null) => {
        if (!data?.prices) return;
        setPriceOverrides(data.prices);
        try {
          window.localStorage.setItem(KEY, JSON.stringify(data.prices));
        } catch {
          /* yoksay */
        }
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  return null;
}
