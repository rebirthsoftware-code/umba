"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "scale";

/**
 * Görünüm alanına girince çocuklarını yumuşakça ortaya çıkarır.
 * CSS tarafı globals.css içindeki [data-reveal] kurallarında.
 */
export function Reveal({
  children,
  delay = 0,
  direction = "up",
  as: Tag = "div",
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  as?: "div" | "section" | "li" | "article" | "span";
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            if (once) io.unobserve(el);
          } else if (!once) {
            el.classList.remove("is-visible");
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} data-reveal={direction === "up" ? "" : direction} style={style} className={className}>
      {children}
    </Tag>
  );
}
