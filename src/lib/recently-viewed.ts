"use client";

const KEY = "umba:recently-viewed:v1";
const MAX = 8;
const EMPTY: string[] = [];
let cache: string[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    cache = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string").slice(0, MAX) : EMPTY;
  } catch {
    cache = EMPTY;
  }
}
export function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function getSnapshot(): string[] {
  load();
  return cache;
}
export function getServerSnapshot(): string[] {
  return EMPTY;
}
export function addRecentlyViewed(slug: string) {
  load();
  const next = [slug, ...cache.filter((s) => s !== slug)].slice(0, MAX);
  if (next.length === cache.length && next.every((s, i) => s === cache[i])) return;
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* yoksay */
  }
  for (const l of listeners) l();
}
