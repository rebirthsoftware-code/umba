"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";

/** İmleç yaklaşınca hafifçe ona doğru kayan sarmalayıcı (butonlar için). */
export function Magnetic({ children, strength = 0.3, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ display: "inline-block", transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)", willChange: "transform" }}
    >
      {children}
    </div>
  );
}
