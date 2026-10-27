import Image from "next/image";
import Link from "next/link";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/format";

/** Marka logosu: "UMBA Coffee and More" yazı markası (public/brand). Oran 1089×480. */
export const LOGO = {
  dark: "/brand/logo-dark.png",
  light: "/brand/logo-white.png",
  width: 1089,
  height: 480,
} as const;

export function LogoImage({ tone = "dark", className, priority }: { tone?: "dark" | "light"; className?: string; priority?: boolean }) {
  return (
    <Image
      src={assetUrl(LOGO[tone])}
      alt="Umba Coffee and More"
      width={LOGO.width}
      height={LOGO.height}
      priority={priority}
      className={cn("w-auto", className)}
    />
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
      className={cn("group inline-flex shrink-0 items-center transition-opacity hover:opacity-80", className)}
    >
      <LogoImage tone={tone} priority className={compact ? "h-7 w-auto" : "h-9 w-auto sm:h-10"} />
    </Link>
  );
}
