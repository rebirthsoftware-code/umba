import { cn } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-bold uppercase tracking-[0.22em]",
            tone === "dark" ? "text-caramel-600" : "text-caramel-300",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-[2rem] font-semibold leading-[1.08] text-balance sm:text-4xl lg:text-[2.9rem]",
          tone === "dark" ? "text-espresso-900" : "text-cream-50",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-pretty sm:text-lg",
            tone === "dark" ? "text-espresso-700" : "text-cream-200",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
