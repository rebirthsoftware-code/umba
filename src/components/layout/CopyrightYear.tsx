"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const FALLBACK_YEAR = 2026;

export function CopyrightYear() {
  const year = useSyncExternalStore(subscribe, () => new Date().getFullYear(), () => FALLBACK_YEAR);
  return <>{year}</>;
}
