"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Yönetim panelinde mağaza üst/alt çerçevesini gizler (uygulama görünümü). */
export function StoreChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/yonetim")) return null;
  return <>{children}</>;
}
