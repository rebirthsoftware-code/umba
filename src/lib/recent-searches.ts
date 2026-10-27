"use client";

const KEY = "umba:recent-searches:v1";
const MAX = 6;
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

function commit(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* yoksay */
  }
  for (const l of listeners) l();
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
export function addRecentSearch(term: string) {
  const t = term.trim();
  if (t.length < 2) return;
  load();
  commit([t, ...cache.filter((s) => s.toLocaleLowerCase("tr") !== t.toLocaleLowerCase("tr"))].slice(0, MAX));
}
export function clearRecentSearches() {
  commit(EMPTY);
}
