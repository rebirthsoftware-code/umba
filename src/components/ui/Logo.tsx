import Link from "next/link";
import { cn } from "@/lib/format";

export function LogoMark({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="umba-bean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2a84b" />
          <stop offset="1" stopColor="#b4761f" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill={color} opacity="0.08" />
      <g transform="rotate(-32 24 24)">
        <ellipse cx="24" cy="24" rx="11.5" ry="16" fill="url(#umba-bean)" />
        <path
          d="M24 8.5c-5 5-5.5 9 0 15.5s5 10.5 0 15.5"
          fill="none"
          stroke={color === "currentColor" ? "#2b1b12" : color}
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.9"
        />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  tone = "dark",
  compact = false,
}: {
  className?: string;
  tone?: "dark" | "light";
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Umba Coffee ana sayfa"
      className={cn("inline-flex items-center gap-2.5 group", className)}
    >
      <LogoMark
        className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-rotate-6"
        color={tone === "dark" ? "currentColor" : "#fdfaf5"}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.55rem] font-semibold tracking-tight",
            tone === "dark" ? "text-espresso-900" : "text-cream-50",
          )}
        >
          umba
        </span>
        {!compact && (
          <span
            className={cn(
              "mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.32em]",
              tone === "dark" ? "text-caramel-600" : "text-caramel-300",
            )}
          >
            coffee
          </span>
        )}
      </span>
    </Link>
  );
}
