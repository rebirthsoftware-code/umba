import { formatPrice, cn } from "@/lib/format";

export function Price({
  value,
  compareAt,
  prefix,
  className,
  size = "md",
}: {
  value: number;
  compareAt?: number;
  prefix?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "text-sm", md: "text-base", lg: "text-2xl" };
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      {prefix && <span className="text-xs font-medium text-espresso-600">{prefix}</span>}
      <span className={cn("font-bold tabular-nums text-espresso-900", sizes[size])}>
        {formatPrice(value)}
      </span>
      {compareAt && compareAt > value && (
        <span className="text-xs text-espresso-600 line-through tabular-nums">{formatPrice(compareAt)}</span>
      )}
    </span>
  );
}
