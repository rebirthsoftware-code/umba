"use client";

import { useState } from "react";
import { Download, Share, X } from "lucide-react";
import { useInstallState, promptInstall } from "@/lib/install-prompt";
import { cn } from "@/lib/format";

/** "Uygulama olarak yükle" butonu; iOS'ta yönerge, diğerlerinde yerel istem. */
export function InstallButton({ label = "Uygulamayı yükle", className }: { label?: string; className?: string }) {
  const state = useInstallState();
  const [iosHelp, setIosHelp] = useState(false);
  if (state === "standalone" || state === "installed" || state === "unavailable") return null;
  return (
    <>
      <button
        type="button"
        onClick={() => (state === "ios" ? setIosHelp(true) : void promptInstall())}
        className={cn("inline-flex h-10 items-center gap-2 rounded-full border border-espresso-900/15 px-4 text-sm font-semibold hover:bg-cream-200", className)}
      >
        <Download className="h-4 w-4" /> {label}
      </button>
      {iosHelp && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-espresso-950/50 p-4 sm:items-center" onClick={() => setIosHelp(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-cream-50 p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h2 className="font-display text-xl font-semibold text-espresso-900">Ana ekrana ekle</h2>
              <button type="button" onClick={() => setIosHelp(false)} aria-label="Kapat" className="-mr-2 -mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream-200"><X className="h-4 w-4" /></button>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-espresso-800">
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-xs font-bold text-cream-50">1</span><span>Safari&rsquo;nin altındaki <Share className="inline h-4 w-4" /> <strong>Paylaş</strong> düğmesine dokunun.</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-xs font-bold text-cream-50">2</span><span><strong>Ana Ekrana Ekle</strong> seçeneğini seçin.</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-espresso-900 text-xs font-bold text-cream-50">3</span><span>Sağ üstten <strong>Ekle</strong> deyin; uygulama ana ekranınızda.</span></li>
            </ol>
          </div>
        </div>
      )}
    </>
  );
}
