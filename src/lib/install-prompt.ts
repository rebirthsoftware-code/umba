"use client";

import { useSyncExternalStore } from "react";

/**
 * "Uygulama olarak yükle" istemi (beforeinstallprompt) için küçük dış depo.
 * Chrome/Edge/Android'de yerel istem açılır; iOS Safari'de istem yoktur, yönerge gösterilir.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferred: BeforeInstallPromptEvent | null = null;
let installed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as BeforeInstallPromptEvent;
    emit();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    deferred = null;
    emit();
  });
}

export type InstallState = "unavailable" | "available" | "installed" | "standalone" | "ios";

function read(): InstallState {
  if (typeof window === "undefined") return "unavailable";
  if (window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone) return "standalone";
  if (installed) return "installed";
  if (deferred) return "available";
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua)) return "ios";
  return "unavailable";
}

export function useInstallState(): InstallState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    read,
    () => "unavailable",
  );
}

export async function promptInstall(): Promise<boolean> {
  if (!deferred) return false;
  await deferred.prompt();
  const { outcome } = await deferred.userChoice;
  deferred = null;
  emit();
  return outcome === "accepted";
}
