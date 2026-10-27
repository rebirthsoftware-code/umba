"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/format";

/** Koyu bölümlerde imleci izleyen sıcak ışık. */
export function Spotlight({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "footer" }) {
  const ref = useRef<HTMLElement | null>(null);
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot-opacity", "1");
  };
  const onLeave = () => ref.current?.style.setProperty("--spot-opacity", "0");
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} onMouseMove={onMove} onMouseLeave={onLeave} className={cn("spotlight", className)}>
      {children}
    </Tag>
  );
}
