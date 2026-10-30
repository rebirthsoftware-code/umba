import type { Product } from "./types";
import { products } from "./products";
import { categoryMap } from "./categories";
import { normalizeTr } from "./format";

export interface SearchHit {
  product: Product;
  score: number;
}

/** Katalogda puanlı arama: ad > kategori > kısa açıklama > açıklama/etiket. Tüm kelimeler eşleşmeli. */
export function searchProducts(query: string, limit = 8): SearchHit[] {
  const q = normalizeTr(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];
  for (const p of products) {
    const name = normalizeTr(p.name);
    const cat = normalizeTr(categoryMap[p.category].name);
    const short = normalizeTr(p.short);
    const rest = normalizeTr(`${p.description} ${p.tags.join(" ")}`);
    let score = 0;
    for (const t of terms) {
      if (name.startsWith(t)) score += 12;
      else if (name.includes(` ${t}`)) score += 9;
      else if (name.includes(t)) score += 6;
      else if (cat.includes(t)) score += 4;
      else if (short.includes(t)) score += 3;
      else if (rest.includes(t)) score += 1;
      else {
        score = -1;
        break;
      }
    }
    if (score > 0) {
      if (p.tags.includes("cok-satan")) score += 1;
      hits.push({ product: p, score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function countResults(query: string): number {
  return searchProducts(query, Number.MAX_SAFE_INTEGER).length;
}

/** Eşleşen ilk kelimeyi vurgulamak için metni parçalara böler. */
export function highlight(text: string, query: string): { text: string; hit: boolean }[] {
  const terms = normalizeTr(query.trim()).split(/\s+/).filter(Boolean);
  const norm = normalizeTr(text);
  if (!terms.length || norm.length !== text.length) return [{ text, hit: false }];
  let best = -1;
  let len = 0;
  for (const t of terms) {
    const i = norm.indexOf(t);
    if (i !== -1 && (best === -1 || i < best)) {
      best = i;
      len = t.length;
    }
  }
  if (best === -1) return [{ text, hit: false }];
  return [
    { text: text.slice(0, best), hit: false },
    { text: text.slice(best, best + len), hit: true },
    { text: text.slice(best + len), hit: false },
  ].filter((p) => p.text);
}

export const popularSearches = ["Karamel", "Vanilya", "Cool lime", "Espresso", "Sıcak çikolata", "Mojito", "Salep", "Milkshake"];

export const searchPlaceholders = [
  "karamel şurubu",
  "mango püresi",
  "espresso harmanı",
  "sıcak çikolata",
  "damla sakızı",
  "salep",
  "çilek sosu",
];
