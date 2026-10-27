import type { Product } from "@/lib/types";

export type DrinkKind = "glass" | "mug" | "espresso" | "frappe";
type Kind = DrinkKind;

function kindFor(p: Pick<Product, "category" | "art" | "slug">): Kind {
  switch (p.category) {
    case "kahve":
      return "espresso";
    case "sicak-cikolata":
    case "soslar":
      return "mug";
    case "bar-urunleri":
      return p.art === "bottle" ? "glass" : "frappe";
    default:
      return "glass";
  }
}

function lighten(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = Math.min(255, ((n >> 16) & 255) + amt);
  const g = Math.min(255, ((n >> 8) & 255) + amt);
  const b = Math.min(255, (n & 255) + amt);
  return `rgb(${r} ${g} ${b})`;
}

/**
 * Ürünün bardaktaki hâlini gösteren vektörel çizim (ürün kartı hover'ı).
 * Kategoriye göre buzlu bardak, kupa, espresso fincanı veya frappe bardağı.
 */
export function DrinkArt({ product, className, kind: kindProp }: { product: Product; className?: string; kind?: Kind }) {
  const kind = kindProp ?? kindFor(product);
  const c1 = product.color;
  const c2 = product.color2 ?? product.color;
  const id = `d-${product.slug}`;

  return (
    <svg viewBox="0 0 240 300" className={className} role="img" aria-label={`${product.name} ile hazırlanmış içecek`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}-liq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={lighten(c1, 40)} />
          <stop offset="0.5" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.3" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.8" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id={`${id}-cream`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#efe3d2" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M70 60 H170 L160 270 Q160 282 148 282 H92 Q80 282 80 270 Z" />
        </clipPath>
        <clipPath id={`${id}-cupclip`}>
          <path d="M74 100 H166 L154 272 Q153 282 143 282 H97 Q87 282 86 272 Z" />
        </clipPath>
      </defs>

      <ellipse cx="120" cy="290" rx="62" ry="6" fill="#2b1b12" opacity="0.14" />

      {kind === "glass" && (
        <g>
          {/* pipet */}
          <rect x="128" y="12" width="12" height="150" rx="6" fill="#d08f2e" transform="rotate(8 134 87)" />
          <rect x="128" y="12" width="12" height="150" rx="6" fill="#fff" opacity="0.25" transform="rotate(8 134 87)" />
          {/* bardak gövdesi arka */}
          <path d="M70 60 H170 L160 270 Q160 282 148 282 H92 Q80 282 80 270 Z" fill="#fff" opacity="0.35" />
          {/* içecek */}
          <g clipPath={`url(#${id}-clip)`}>
            <rect x="60" y="96" width="120" height="200" fill={`url(#${id}-liq)`} />
            <rect x="60" y="96" width="120" height="34" fill={`url(#${id}-cream)`} opacity="0.92" />
            <path d="M60 130 Q90 140 120 128 T180 130 V96 H60 Z" fill="#fff" opacity="0.35" />
            {/* buz küpleri */}
            <rect x="88" y="150" width="34" height="34" rx="7" fill="#fff" opacity="0.55" transform="rotate(-12 105 167)" />
            <rect x="124" y="190" width="34" height="34" rx="7" fill="#fff" opacity="0.5" transform="rotate(14 141 207)" />
            <rect x="94" y="222" width="30" height="30" rx="7" fill="#fff" opacity="0.45" transform="rotate(-6 109 237)" />
            <rect x="88" y="150" width="34" height="34" rx="7" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" transform="rotate(-12 105 167)" />
            <rect x="124" y="190" width="34" height="34" rx="7" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" transform="rotate(14 141 207)" />
            {/* kabarcıklar */}
            <circle cx="100" cy="205" r="3" fill="#fff" opacity="0.6" />
            <circle cx="150" cy="170" r="2.5" fill="#fff" opacity="0.6" />
            <circle cx="112" cy="262" r="2" fill="#fff" opacity="0.5" />
          </g>
          {/* cam yüzeyi */}
          <path d="M70 60 H170 L160 270 Q160 282 148 282 H92 Q80 282 80 270 Z" fill={`url(#${id}-glass)`} />
          <path d="M70 60 H170 L160 270 Q160 282 148 282 H92 Q80 282 80 270 Z" fill="none" stroke="#2b1b12" strokeOpacity="0.28" strokeWidth="3" />
          <path d="M84 80 L78 250" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" />
          {/* dilim süsleme */}
          <circle cx="172" cy="62" r="17" fill={lighten(c1, 20)} stroke="#fff" strokeWidth="3" />
          <circle cx="172" cy="62" r="12" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
          <path d="M172 50 V74 M160 62 H184 M163.5 53.5 L180.5 70.5 M180.5 53.5 L163.5 70.5" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.5" />
        </g>
      )}

      {kind === "mug" && (
        <g>
          {/* buhar */}
          <g className="steam" fill="none" stroke="#2b1b12" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round">
            <path d="M96 70 c-8 -12 8 -18 0 -30" />
            <path d="M120 64 c-8 -12 8 -18 0 -30" />
            <path d="M144 70 c-8 -12 8 -18 0 -30" />
          </g>
          {/* kulp */}
          <path d="M176 150 Q226 150 226 192 Q226 234 176 234" fill="none" stroke="#efe3d2" strokeWidth="18" strokeLinecap="round" />
          <path d="M176 150 Q226 150 226 192 Q226 234 176 234" fill="none" stroke="#2b1b12" strokeOpacity="0.2" strokeWidth="2" />
          {/* kupa */}
          <path d="M62 112 H178 V258 Q178 280 156 280 H84 Q62 280 62 258 Z" fill="#fdfaf5" />
          <path d="M62 112 H178 V258 Q178 280 156 280 H84 Q62 280 62 258 Z" fill={`url(#${id}-glass)`} opacity="0.6" />
          <path d="M62 112 H178 V258 Q178 280 156 280 H84 Q62 280 62 258 Z" fill="none" stroke="#2b1b12" strokeOpacity="0.2" strokeWidth="3" />
          <rect x="62" y="186" width="116" height="30" fill={c1} opacity="0.9" />
          <text x="120" y="207" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontWeight="700" fontSize="15" letterSpacing="2" fill="#fdfaf5">
            UMBA
          </text>
          {/* içecek yüzeyi */}
          <ellipse cx="120" cy="112" rx="58" ry="13" fill={c2} />
          <ellipse cx="120" cy="110" rx="50" ry="9" fill={c1} />
          {/* krema */}
          <g>
            <circle cx="94" cy="104" r="20" fill="#fff" />
            <circle cx="120" cy="90" r="25" fill="#fff" />
            <circle cx="146" cy="104" r="20" fill="#fff" />
            <circle cx="106" cy="112" r="16" fill="#fff" />
            <circle cx="134" cy="112" r="16" fill="#fff" />
            <ellipse cx="120" cy="116" rx="46" ry="8" fill="#fff" />
          </g>
          {/* sos çizgileri */}
          <path d="M92 98 q10 -8 20 0 t20 0 t20 0" fill="none" stroke={c1} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M100 110 q8 -6 16 0 t16 0 t16 0" fill="none" stroke={c2} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <circle cx="120" cy="84" r="3" fill={c1} />
        </g>
      )}

      {kind === "espresso" && (
        <g>
          <g className="steam" fill="none" stroke="#2b1b12" strokeOpacity="0.25" strokeWidth="4" strokeLinecap="round">
            <path d="M100 120 c-8 -12 8 -18 0 -30" />
            <path d="M122 114 c-8 -12 8 -18 0 -30" />
            <path d="M144 120 c-8 -12 8 -18 0 -30" />
          </g>
          {/* tabak */}
          <ellipse cx="120" cy="262" rx="92" ry="17" fill="#efe3d2" />
          <ellipse cx="120" cy="260" rx="92" ry="17" fill="#fdfaf5" stroke="#2b1b12" strokeOpacity="0.15" strokeWidth="2" />
          <ellipse cx="120" cy="260" rx="60" ry="9" fill="none" stroke="#2b1b12" strokeOpacity="0.1" strokeWidth="2" />
          {/* kulp */}
          <path d="M166 172 Q204 172 204 198 Q204 226 166 226" fill="none" stroke="#fdfaf5" strokeWidth="14" strokeLinecap="round" />
          <path d="M166 172 Q204 172 204 198 Q204 226 166 226" fill="none" stroke="#2b1b12" strokeOpacity="0.2" strokeWidth="2" />
          {/* fincan */}
          <path d="M66 150 H174 L164 240 Q162 258 144 258 H96 Q78 258 76 240 Z" fill="#fdfaf5" />
          <path d="M66 150 H174 L164 240 Q162 258 144 258 H96 Q78 258 76 240 Z" fill={`url(#${id}-glass)`} opacity="0.6" />
          <path d="M66 150 H174 L164 240 Q162 258 144 258 H96 Q78 258 76 240 Z" fill="none" stroke="#2b1b12" strokeOpacity="0.2" strokeWidth="3" />
          <rect x="74" y="196" width="92" height="18" fill={c1} opacity="0.9" />
          <text x="120" y="209" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontWeight="700" fontSize="11" letterSpacing="2" fill="#fdfaf5">
            UMBA
          </text>
          {/* kahve yüzeyi ve krema */}
          <ellipse cx="120" cy="150" rx="54" ry="12" fill="#2b1b12" />
          <ellipse cx="120" cy="150" rx="48" ry="9" fill="#c58a3b" />
          <ellipse cx="112" cy="149" rx="24" ry="5" fill="#e2a84b" opacity="0.8" />
          <path d="M100 152 q10 -4 20 0 t20 0" fill="none" stroke="#8e5c16" strokeWidth="1.5" opacity="0.6" />
          {/* çekirdekler */}
          <g transform="translate(46 246) rotate(-25)">
            <ellipse rx="9" ry="6" fill={c1} />
            <path d="M-6 0 q6 -3 12 0" fill="none" stroke="#fdfaf5" strokeWidth="1.5" />
          </g>
          <g transform="translate(196 250) rotate(20)">
            <ellipse rx="9" ry="6" fill={c2} />
            <path d="M-6 0 q6 -3 12 0" fill="none" stroke="#fdfaf5" strokeWidth="1.5" />
          </g>
        </g>
      )}

      {kind === "frappe" && (
        <g>
          {/* pipet */}
          <rect x="134" y="6" width="11" height="130" rx="5" fill="#2b1b12" transform="rotate(6 139 71)" />
          {/* bardak gövdesi */}
          <g clipPath={`url(#${id}-cupclip)`}>
            <rect x="60" y="90" width="120" height="200" fill={`url(#${id}-liq)`} />
            <rect x="60" y="100" width="120" height="30" fill="#fff" opacity="0.25" />
            <rect x="60" y="178" width="120" height="48" fill="#fdfaf5" />
            <rect x="60" y="178" width="120" height="48" fill={`url(#${id}-glass)`} opacity="0.5" />
            <circle cx="104" cy="240" r="3" fill="#fff" opacity="0.5" />
            <circle cx="140" cy="258" r="2.5" fill="#fff" opacity="0.5" />
          </g>
          <text x="120" y="208" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontWeight="700" fontSize="15" letterSpacing="2" fill="#2b1b12">
            UMBA
          </text>
          <path d="M74 100 H166 L154 272 Q153 282 143 282 H97 Q87 282 86 272 Z" fill={`url(#${id}-glass)`} />
          <path d="M74 100 H166 L154 272 Q153 282 143 282 H97 Q87 282 86 272 Z" fill="none" stroke="#2b1b12" strokeOpacity="0.25" strokeWidth="3" />
          {/* kubbe kapak + krema */}
          <path d="M66 100 Q120 22 174 100 Z" fill="#fff" opacity="0.4" />
          <path d="M66 100 Q120 22 174 100" fill="none" stroke="#2b1b12" strokeOpacity="0.25" strokeWidth="3" />
          <g>
            <circle cx="98" cy="90" r="16" fill="#fff" />
            <circle cx="120" cy="72" r="20" fill="#fff" />
            <circle cx="142" cy="90" r="16" fill="#fff" />
            <ellipse cx="120" cy="98" rx="42" ry="9" fill="#fff" />
          </g>
          <path d="M100 86 q10 -8 20 0 t20 0" fill="none" stroke={c1} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M106 96 q7 -5 14 0 t14 0" fill="none" stroke={c2} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
          <rect x="62" y="98" width="116" height="6" rx="3" fill="#2b1b12" opacity="0.25" />
        </g>
      )}
    </svg>
  );
}
