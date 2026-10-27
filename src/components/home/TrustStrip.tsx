import { Factory, Truck, BadgePercent, ShieldCheck, Leaf, Headset } from "lucide-react";

const items = [
  { icon: Factory, label: "Türkiye'de üretim" },
  { icon: Truck, label: "1–3 iş günü teslimat" },
  { icon: BadgePercent, label: "HoReCa'ya özel fiyat" },
  { icon: ShieldCheck, label: "Güvenli ödeme" },
  { icon: Leaf, label: "Doğal aroma" },
  { icon: Headset, label: "Barista desteği" },
];

export function TrustStrip() {
  return (
    <div className="border-y border-espresso-900/5 bg-cream-100">
      <div className="container-x">
        <ul className="scrollbar-none flex items-center gap-8 overflow-x-auto py-4 text-sm font-semibold text-espresso-800 sm:justify-between">
          {items.map(({ icon: Icon, label }) => (
            <li key={label} className="flex shrink-0 items-center gap-2">
              <Icon className="h-4.5 w-4.5 text-caramel-600" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
