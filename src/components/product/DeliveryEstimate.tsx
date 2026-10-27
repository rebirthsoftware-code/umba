"use client";

import { useSyncExternalStore } from "react";
import { Truck } from "lucide-react";

const noop = () => () => {};
let cachedKey = "";
let cachedText = "";

function addBusinessDays(d: Date, n: number): Date {
  const x = new Date(d);
  let left = n;
  while (left > 0) {
    x.setDate(x.getDate() + 1);
    const day = x.getDay();
    if (day !== 0 && day !== 6) left -= 1;
  }
  return x;
}

function estimate(): string {
  const now = new Date();
  const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours() < 14 ? "a" : "p"}`;
  if (key === cachedKey) return cachedText;
  const shipDay = now.getHours() < 14 && now.getDay() !== 0 && now.getDay() !== 6 ? now : addBusinessDays(now, 1);
  const from = addBusinessDays(shipDay, 1);
  const to = addBusinessDays(shipDay, 3);
  const fmt = (d: Date) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long" }).format(d);
  const sameDay = shipDay.getDate() === now.getDate();
  cachedKey = key;
  cachedText = `${sameDay ? "Bugün" : "Yarın"} kargoda · ${fmt(from)} – ${fmt(to)} arası teslim`;
  return cachedText;
}

export function DeliveryEstimate() {
  const text = useSyncExternalStore(noop, estimate, () => null);
  return (
    <p className="flex items-center gap-2 text-xs font-semibold text-espresso-700">
      <Truck className="h-4 w-4 shrink-0 text-caramel-600" />
      {text ?? "Hızlı teslimat · 1–3 iş günü"}
    </p>
  );
}
