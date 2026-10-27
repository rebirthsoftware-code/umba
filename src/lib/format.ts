const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatPrice(value: number): string {
  return currency.format(value);
}

export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export const trCollator = new Intl.Collator("tr", { sensitivity: "base" });

/** Türkçe karakterleri sadeleştirip arama için normalize eder. */
export function normalizeTr(input: string): string {
  return input
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u");
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** "700 ml", "1 L", "250 g", "1 kg", "20 × 25 g kutu", "3 kg (HoReCa)" → 100 ml/g başına fiyat metni. */
export function unitPrice(label: string, price: number): string | null {
  const norm = label.toLocaleLowerCase("tr").replace(",", ".");
  const multi = norm.match(/(\d+)\s*[×x]\s*(\d+(?:\.\d+)?)\s*(ml|g)/);
  const single = norm.match(/(\d+(?:\.\d+)?)\s*(ml|l|g|kg)\b/);
  let amount = 0;
  let unit: "ml" | "g" | null = null;
  if (multi) {
    amount = Number(multi[1]) * Number(multi[2]);
    unit = multi[3] as "ml" | "g";
  } else if (single) {
    const n = Number(single[1]);
    const u = single[2];
    if (u === "l") {
      amount = n * 1000;
      unit = "ml";
    } else if (u === "kg") {
      amount = n * 1000;
      unit = "g";
    } else {
      amount = n;
      unit = u as "ml" | "g";
    }
  }
  if (!unit || amount <= 0) return null;
  return `${formatPrice((price / amount) * 100)} / 100 ${unit}`;
}
