const items = ["Türkiye'de üretim", "Kafe standardı", "1–3 iş günü teslimat", "Doğal aroma", "HoReCa'ya özel fiyat", "Barista desteği", "17 aroma şurup", "Taze kavrulmuş kahve"];

/** İnce, kesintisiz kayan şerit. */
export function Ticker() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-espresso-900/10 bg-cream-50 py-2.5">
      <div className="flex w-max animate-marquee items-center gap-10 pr-10 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center gap-10 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-espresso-700">
            {t}
            <span className="h-1 w-1 rounded-full bg-caramel-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
