"use client";

import { useState, useSyncExternalStore } from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { cn } from "@/lib/format";
import { site } from "@/lib/site";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ?? "";

function urlBase64ToUint8Array(base64: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(new ArrayBuffer(raw.length));
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

type State = "unsupported" | "denied" | "off" | "on";
const listeners = new Set<() => void>();
let cached: State | null = null;
async function detect(): Promise<State> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  return sub ? "on" : "off";
}
if (typeof window !== "undefined") {
  void detect().then((s) => {
    cached = s;
    listeners.forEach((l) => l());
  });
}
function usePushState(): State | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => cached,
    () => null,
  );
}

/** Yönetim paneli: bu cihazda yeni sipariş bildirimlerini aç/kapat. */
export function PushToggle({ token }: { token: string }) {
  const state = usePushState();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const standalone = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone);
  const isIos = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);

  if (!PUBLIC_KEY) return null;
  if (state === null) return null;
  if (state === "unsupported") {
    return isIos && !standalone ? <p className="text-xs text-espresso-600">Bildirim için paneli önce ana ekrana ekleyin (Paylaş → Ana Ekrana Ekle).</p> : null;
  }

  const api = (method: string, body?: unknown) =>
    fetch(`${site.api.url}/admin/push`, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: body ? JSON.stringify(body) : undefined }).then((r) => r.json());

  const enable = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        cached = perm === "denied" ? "denied" : "off";
        listeners.forEach((l) => l());
        setMsg("Bildirim izni verilmedi.");
        return;
      }
      const reg = (await navigator.serviceWorker.getRegistration()) ?? (await navigator.serviceWorker.register("/sw.js"));
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY) });
      const res = await api("POST", { subscription: sub.toJSON(), label: navigator.userAgent.slice(0, 120) });
      if (res.status !== "success") throw new Error(res.reason ?? "Kayıt başarısız");
      cached = "on";
      listeners.forEach((l) => l());
      setMsg(`Bildirimler açık · ${res.devices} cihaz kayıtlı`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Bildirim açılamadı");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setMsg(null);
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) {
      await api("DELETE", { endpoint: sub.endpoint });
      await sub.unsubscribe();
    }
    cached = "off";
    listeners.forEach((l) => l());
    setBusy(false);
  };

  const test = async () => {
    setBusy(true);
    const res = await api("PUT");
    setMsg(res.status === "success" ? `Test bildirimi gönderildi (${res.sent} cihaz)` : res.reason ?? "Gönderilemedi");
    setBusy(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {state === "on" ? (
        <>
          <button type="button" onClick={() => void test()} disabled={busy} className="inline-flex h-10 items-center gap-2 rounded-full bg-leaf-100 px-4 text-sm font-semibold text-leaf-500 disabled:opacity-60">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />} Bildirimler açık · test et
          </button>
          <button type="button" onClick={() => void disable()} disabled={busy} aria-label="Bildirimleri kapat" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-espresso-900/15 text-espresso-600 hover:bg-cream-200">
            <BellOff className="h-4 w-4" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => void enable()}
          disabled={busy || state === "denied"}
          className={cn("inline-flex h-10 items-center gap-2 rounded-full border border-espresso-900/15 px-4 text-sm font-semibold hover:bg-cream-200 disabled:opacity-60")}
          title={state === "denied" ? "Tarayıcı ayarlarından bildirim iznini açın" : undefined}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />} {state === "denied" ? "Bildirim izni engellendi" : "Bildirimleri aç"}
        </button>
      )}
      {msg && <span className="text-xs text-espresso-600">{msg}</span>}
    </div>
  );
}
