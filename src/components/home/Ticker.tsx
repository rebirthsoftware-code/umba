import { LogoMark } from "@/components/ui/Logo";

const items = [
  "Türkiye'de üretim",
  "Kafe standardı",
  "1–3 iş günü teslimat",
  "Doğal aroma",
  "HoReCa'ya özel fiyat",
  "Barista desteği",
  "Şekersiz seçenekler",
  "Taze kavrulmuş kahve",
];

/** Kesintisiz kayan şerit. Üzerine gelince durur. */
export function Ticker() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-espresso-900/5 bg-espresso-950 py-3 text-cream-100">
      <div className="flex w-max animate-marquee items-center gap-8 pr-8 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.18em]">
            {t}
            <LogoMark className="h-5 w-5 opacity-80" color="#fdfaf5" />
          </span>
        ))}
      </div>
    </div>
  );
}
