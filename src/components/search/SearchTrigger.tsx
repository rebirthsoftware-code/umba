"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchPlaceholders } from "@/lib/search";
import { cn } from "@/lib/format";

/** Başlıkta yazıyormuş gibi örnek aramalar gösteren arama düğmesi. */
export function SearchTrigger({ onOpen, className }: { onOpen: () => void; className?: string }) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      const t = window.setTimeout(() => setTyped(searchPlaceholders[0]), 0);
      return () => window.clearTimeout(t);
    }
    let phrase = 0;
    let pos = 0;
    let deleting = false;
    let timer = 0;
    const step = () => {
      const word = searchPlaceholders[phrase];
      if (!deleting) {
        pos += 1;
        setTyped(word.slice(0, pos));
        if (pos === word.length) {
          deleting = true;
          timer = window.setTimeout(step, 1600);
          return;
        }
        timer = window.setTimeout(step, 70);
      } else {
        pos -= 1;
        setTyped(word.slice(0, pos));
        if (pos === 0) {
          deleting = false;
          phrase = (phrase + 1) % searchPlaceholders.length;
          timer = window.setTimeout(step, 350);
          return;
        }
        timer = window.setTimeout(step, 35);
      }
    };
    timer = window.setTimeout(step, 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Ürün ara"
      className={cn(
        "group flex h-11 items-center gap-2.5 rounded-full border border-espresso-900/10 bg-cream-100 pl-4 pr-2 text-sm text-espresso-600 transition-all hover:border-caramel-500 hover:bg-cream-50 hover:shadow-card",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-caramel-600 transition-transform group-hover:scale-110" />
      <span className="min-w-0 flex-1 truncate text-left">
        <span className="text-espresso-600/80">Ara: </span>
        <span className="font-medium text-espresso-800">{typed}</span>
        <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] animate-blink bg-caramel-600" aria-hidden="true" />
      </span>
      <kbd className="hidden shrink-0 rounded-md border border-espresso-900/10 bg-cream-50 px-1.5 py-0.5 font-sans text-[0.65rem] font-bold text-espresso-600 lg:inline-block">
        Ctrl K
      </kbd>
    </button>
  );
}
