import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/format";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outline" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-caramel-500 text-espresso-950 hover:bg-caramel-400 shadow-[0_8px_20px_-10px_rgb(208_143_46/0.8)]",
  secondary: "bg-espresso-900 text-cream-50 hover:bg-espresso-800",
  dark: "bg-espresso-950 text-cream-50 hover:bg-espresso-800",
  ghost: "bg-transparent text-espresso-900 hover:bg-cream-200",
  outline:
    "border border-espresso-900/20 bg-transparent text-espresso-900 hover:border-espresso-900 hover:bg-espresso-900 hover:text-cream-50",
  light: "bg-cream-50 text-espresso-900 hover:bg-cream-200",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

type ButtonAsLink = CommonProps & { href: string; target?: string; rel?: string; prefetch?: boolean };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && typeof props.href === "string") {
    const { href, target, rel, prefetch } = props;
    return (
      <Link href={href} target={target} rel={rel} prefetch={prefetch} className={classes}>
        {children}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } = props as ButtonAsButton;
  return (
    <button type="button" {...rest} className={classes}>
      {children}
    </button>
  );
}
