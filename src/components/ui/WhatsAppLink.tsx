"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { whatsappUrl, formatWhatsApp } from "@/lib/forms";
import { cn } from "@/lib/format";

const labels = ["1. Hat", "2. Hat", "3. Hat", "4. Hat"];

/**
 * WhatsApp bağlantısı. Birden fazla hat tanımlıysa tıklanınca numara seçtirir,
 * tek hat varsa doğrudan wa.me bağlantısı olarak davranır.
 */
export function WhatsAppLink({
  text,
  className,
  children,
  placement = "bottom",
  menuClassName,
  "aria-label": ariaLabel,
}: {
  text: string;
  className?: string;
  children: ReactNode;
  placement?: "top" | "bottom";
  menuClassName?: string;
  "aria-label"?: string;
}) {
  const numbers = site.contact.whatsappNumbers;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (numbers.length === 0) return null;
  if (numbers.length === 1) {
    return (
      <a href={whatsappUrl(text, numbers[0])} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </button>
      <div
        id={id}
        role="menu"
        aria-label="WhatsApp hattı seçin"
        className={cn(
          "absolute z-50 w-64 rounded-2xl border border-espresso-900/10 bg-cream-50 p-2 text-left shadow-lift transition-all duration-200",
          placement === "top" ? "bottom-full right-0 mb-3 origin-bottom-right" : "left-0 top-full mt-3 origin-top-left",
          open ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0",
          menuClassName,
        )}
      >
        <p className="px-3 pb-1 pt-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-espresso-600">Hangi hatta yazmak istersiniz?</p>
        {numbers.map((n, i) => (
          <a
            key={n}
            role="menuitem"
            href={whatsappUrl(text, n)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-espresso-900 transition-colors hover:bg-[#25D366]/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <MessageCircle className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.65rem] font-bold uppercase tracking-[0.18em] text-espresso-600">{labels[i] ?? `${i + 1}. Hat`}</span>
              <span className="block text-sm font-bold tabular-nums">{formatWhatsApp(n)}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
