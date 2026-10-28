"use client";

import { useEffect } from "react";

/** Service worker kaydı (çevrimdışı yedek sayfa, statik önbellek, anlık bildirimler). */
export function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);
  return null;
}
