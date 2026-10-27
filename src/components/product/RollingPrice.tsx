import { formatPrice, cn } from "@/lib/format";

/** Hover'da rakamları slot makinesi gibi yuvarlanan fiyat. Stil: globals.css → .price-roll */
export function RollingPrice({ value, className }: { value: number; className?: string }) {
  const text = formatPrice(value);
  let digitIndex = 0;
  return (
    <span className={cn("price-roll font-bold tabular-nums text-espresso-900", className)} aria-label={text} role="text">
      {[...text].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="digit-col" aria-hidden="true" style={{ "--d": ch, "--i": digitIndex++ } as React.CSSProperties}>
            <span className="digit-strip">
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}
