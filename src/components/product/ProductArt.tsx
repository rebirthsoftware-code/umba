import type { ArtKind, Product } from "@/lib/types";
import { categoryMap } from "@/lib/categories";

const SUFFIXES = new Set(["Şurubu", "Sosu", "Püresi", "Tozu", "Harmanı", "Konsantresi"]);

/** Etiket için kısa ürün adı ve satırlara bölünmüş hâli. */
export function artLabel(name: string, maxChars = 13): string[] {
  let words = name.replace(/\(.*?\)/g, "").trim().split(/\s+/);
  if (words.length > 1 && SUFFIXES.has(words[words.length - 1])) words = words.slice(0, -1);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = next;
    }
    if (lines.length === 2) break;
  }
  if (lines.length < 2 && cur) lines.push(cur);
  return lines.slice(0, 2).map((l) => (l.length > maxChars + 2 ? l.slice(0, maxChars + 1) + "…" : l));
}

function isLight(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 165;
}

interface ArtProps {
  product: Pick<Product, "name" | "color" | "color2" | "art" | "category" | "slug" | "variants">;
  className?: string;
  /** Etiket üzerindeki hacim yazısı */
  sizeLabel?: string;
}

/**
 * Ürün fotoğrafı yerine kullanılan vektörel ambalaj çizimi.
 * Gerçek fotoğraf eklendiğinde (product.image) ProductImage bunu otomatik devre dışı bırakır.
 */
export function ProductArt({ product, className, sizeLabel }: ArtProps) {
  const kind: ArtKind = product.art ?? categoryMap[product.category].art;
  const c1 = product.color;
  const c2 = product.color2 ?? product.color;
  const id = `g-${product.slug}`;
  const lines = artLabel(product.name);
  const vol = sizeLabel ?? product.variants[0]?.label ?? "";
  const light = isLight(c1);

  return (
    <svg
      viewBox="0 0 240 300"
      className={className}
      role="img"
      aria-label={product.name}
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={`${id}-liq`} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0.02" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1f1f1f" />
          <stop offset="0.5" stopColor="#141414" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <linearGradient id={`${id}-kraft`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a2719" />
          <stop offset="0.5" stopColor="#141414" />
          <stop offset="1" stopColor="#1b100a" />
        </linearGradient>
        <radialGradient id={`${id}-fruit`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="0.4" stopColor={c1} />
          <stop offset="1" stopColor={c2} />
        </radialGradient>
      </defs>

      {/* gölge */}
      <ellipse cx="120" cy="289" rx="58" ry="6" fill="#141414" opacity="0.14" />

      {kind === "bottle" && (
        <g>
          <rect x="99" y="18" width="42" height="28" rx="7" fill={`url(#${id}-dark)`} />
          <rect x="104" y="22" width="8" height="18" rx="3" fill="#fff" opacity="0.12" />
          <path
            d="M104 46 H136 V74 C136 90 170 92 170 112 V260 Q170 282 148 282 H92 Q70 282 70 260 V112 C70 92 104 90 104 74 Z"
            fill={`url(#${id}-liq)`}
          />
          <path
            d="M104 46 H136 V74 C136 90 170 92 170 112 V260 Q170 282 148 282 H92 Q70 282 70 260 V112 C70 92 104 90 104 74 Z"
            fill={`url(#${id}-shine)`}
          />
          <path d="M80 118 V250" stroke="#fff" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
          <Label x={82} y={138} w={76} h={92} lines={lines} color={c1} vol={vol} light={light} id={id} />
        </g>
      )}

      {kind === "sauce" && (
        <g>
          <path d="M113 14 H127 L133 38 H107 Z" fill={`url(#${id}-dark)`} />
          <rect x="97" y="36" width="46" height="16" rx="5" fill={`url(#${id}-dark)`} />
          <path
            d="M100 52 H140 V62 Q172 66 172 96 V256 Q172 282 146 282 H94 Q68 282 68 256 V96 Q68 66 100 62 Z"
            fill={`url(#${id}-liq)`}
          />
          <path
            d="M100 52 H140 V62 Q172 66 172 96 V256 Q172 282 146 282 H94 Q68 282 68 256 V96 Q68 66 100 62 Z"
            fill={`url(#${id}-shine)`}
          />
          <path d="M80 104 V246" stroke="#fff" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
          <Label x={80} y={120} w={80} h={104} lines={lines} color={c1} vol={vol} light={light} id={id} />
        </g>
      )}

      {kind === "pouch" && (
        <g>
          <path
            d="M64 36 H176 L188 246 Q190 282 156 282 H84 Q50 282 52 246 Z"
            fill={`url(#${id}-liq)`}
          />
          <path
            d="M64 36 H176 L188 246 Q190 282 156 282 H84 Q50 282 52 246 Z"
            fill={`url(#${id}-shine)`}
          />
          <path d="M64 36 H176 L177 54 H63 Z" fill="#fff" opacity="0.28" />
          <path d="M66 60 H174" stroke="#141414" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M76 78 Q86 170 80 262" stroke="#000" strokeOpacity="0.1" strokeWidth="10" strokeLinecap="round" />
          <path d="M164 78 Q154 170 160 262" stroke="#000" strokeOpacity="0.1" strokeWidth="10" strokeLinecap="round" />
          <circle cx="120" cy="108" r="26" fill={`url(#${id}-fruit)`} />
          <path d="M126 84 q10 -14 22 -8 q-8 12 -22 8z" fill="#4f8a2f" />
          <Label x={78} y={146} w={84} h={100} lines={lines} color={c1} vol={vol} light={light} id={id} />
        </g>
      )}

      {kind === "bag" && (
        <g>
          <rect x="60" y="38" width="120" height="244" rx="12" fill={`url(#${id}-kraft)`} />
          <rect x="60" y="38" width="120" height="244" rx="12" fill={`url(#${id}-shine)`} opacity="0.5" />
          <rect x="60" y="38" width="120" height="26" rx="12" fill="#0f0805" opacity="0.55" />
          <path d="M70 64 H170" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="156" cy="88" r="7" fill="#0f0805" />
          <circle cx="156" cy="88" r="2.5" fill="#d9c7a3" />
          <rect x="60" y="246" width="120" height="36" rx="12" fill="#0f0805" opacity="0.35" />
          <Label x={78} y={112} w={84} h={116} lines={lines} color={c1} vol={vol} light={light} id={id} dark />
        </g>
      )}

      {kind === "tin" && (
        <g>
          <rect x="62" y="56" width="116" height="214" rx="8" fill={`url(#${id}-liq)`} />
          <rect x="62" y="56" width="116" height="214" rx="8" fill={`url(#${id}-shine)`} />
          <ellipse cx="120" cy="270" rx="58" ry="12" fill="#0a0a0a" opacity="0.5" />
          <rect x="58" y="40" width="124" height="22" rx="11" fill={`url(#${id}-dark)`} />
          <ellipse cx="120" cy="40" rx="62" ry="12" fill="#1f1f1f" />
          <ellipse cx="120" cy="40" rx="50" ry="8" fill="#4e3627" />
          <path d="M76 86 V236" stroke="#fff" strokeOpacity="0.4" strokeWidth="6" strokeLinecap="round" />
          <Label x={62} y={122} w={116} h={98} lines={lines} color={c1} vol={vol} light={light} id={id} full />
        </g>
      )}

      {kind === "box" && (
        <g>
          <path d="M58 76 L96 50 H208 L170 76 Z" fill="#efe3d2" />
          <path d="M170 76 L208 50 V232 L170 258 Z" fill="#d9c7ad" />
          <rect x="58" y="76" width="112" height="182" fill="#fdfaf5" />
          <rect x="58" y="76" width="112" height="182" fill={`url(#${id}-shine)`} opacity="0.4" />
          <rect x="58" y="206" width="112" height="52" fill={c1} />
          <rect x="58" y="206" width="112" height="52" fill={`url(#${id}-shine)`} />
          <text
            x="114"
            y="116"
            textAnchor="middle"
            fontFamily="var(--font-fraunces), Georgia, serif"
            fontWeight="700"
            fontSize="22"
            letterSpacing="2"
            fill="#141414"
          >
            UMBA
          </text>
          <line x1="80" y1="128" x2="148" y2="128" stroke="#c9b48a" strokeWidth="2" />
          {lines.map((l, i) => (
            <text
              key={l}
              x="114"
              y={152 + i * 18}
              textAnchor="middle"
              fontFamily="var(--font-manrope), system-ui, sans-serif"
              fontWeight="700"
              fontSize="13"
              fill="#141414"
            >
              {l}
            </text>
          ))}
          <text
            x="114"
            y="238"
            textAnchor="middle"
            fontFamily="var(--font-manrope), system-ui, sans-serif"
            fontWeight="700"
            fontSize="12"
            fill={light ? "#141414" : "#fdfaf5"}
          >
            {vol}
          </text>
        </g>
      )}
    </svg>
  );
}

function Label({
  x,
  y,
  w,
  h,
  lines,
  color,
  vol,
  light,
  id,
  dark = false,
  full = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  color: string;
  vol: string;
  light: boolean;
  id: string;
  dark?: boolean;
  full?: boolean;
}) {
  const cx = x + w / 2;
  const bandH = 22;
  const fontSize = w >= 100 ? 13 : 11.5;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={full ? 0 : 9} fill={dark ? "#fdfaf5" : "#fdfaf5"} />
      <rect x={x} y={y} width={w} height={h} rx={full ? 0 : 9} fill={`url(#${id}-shine)`} opacity="0.35" />
      <text
        x={cx}
        y={y + 24}
        textAnchor="middle"
        fontFamily="var(--font-fraunces), Georgia, serif"
        fontWeight="700"
        fontSize={w >= 100 ? 19 : 16}
        letterSpacing="1.5"
        fill="#141414"
      >
        UMBA
      </text>
      <line x1={cx - w * 0.3} y1={y + 32} x2={cx + w * 0.3} y2={y + 32} stroke="#c9b48a" strokeWidth="1.5" />
      {lines.map((l, i) => (
        <text
          key={l}
          x={cx}
          y={y + 50 + i * (fontSize + 4)}
          textAnchor="middle"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          fontWeight="700"
          fontSize={fontSize}
          fill="#141414"
        >
          {l}
        </text>
      ))}
      <rect x={x} y={y + h - bandH} width={w} height={bandH} rx={full ? 0 : 9} fill={color} />
      <rect x={x} y={y + h - bandH} width={w} height={bandH / 2} fill={color} />
      <rect x={x} y={y + h - bandH} width={w} height={bandH} rx={full ? 0 : 9} fill={`url(#${id}-shine)`} opacity="0.6" />
      <text
        x={cx}
        y={y + h - 7}
        textAnchor="middle"
        fontFamily="var(--font-manrope), system-ui, sans-serif"
        fontWeight="700"
        fontSize="10.5"
        fill={light ? "#141414" : "#fdfaf5"}
      >
        {vol}
      </text>
    </g>
  );
}
