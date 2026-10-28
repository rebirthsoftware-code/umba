"use client";

import { useSyncExternalStore } from "react";
import { Smartphone, X } from "lucide-react";
import { useInstallState } from "@/lib/install-prompt";
import { InstallButton } from "./InstallButton";

const KEY = "umba:installBannerDismissed";
const listeners = new Set<() => void>();
const readDismissed = () => {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/** Mağaza sitesinde alt köşede küçük "uygulama olarak ekle" şeridi (bir kez kapatılınca bir daha çıkmaz). */
export function InstallBanner() {
  const state = useInstallState();
  const dismissed = useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    readDismissed,
    () => true,
  );
  if (dismissed || (state !== "available" && state !== "ios")) return null;
  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* yoksay */
    }
    listeners.forEach((l) => l());
  };
  return (
    <div className="fixed bottom-24 left-4 right-4 z-30 mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-espresso-900/10 bg-cream-50/95 p-3 shadow-lift backdrop-blur sm:left-5 sm:right-auto">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-espresso-900 text-cream-50"><Smartphone className="h-5 w-5" /></span>
      <p className="min-w-0 flex-1 text-xs leading-snug text-espresso-800"><strong>Umba&rsquo;yı uygulama olarak ekleyin.</strong> Ana ekrandan tek dokunuşla sipariş verin.</p>
      <InstallButton label="Ekle" className="h-9 shrink-0 px-3 text-xs" />
      <button type="button" onClick={dismiss} aria-label="Kapat" className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-espresso-600 hover:bg-cream-200"><X className="h-4 w-4" /></button>
    </div>
  );
}
