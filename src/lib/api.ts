import type { OrderRecord, PaymentMethod } from "./order";
import { site } from "./site";

/**
 * Sipariş API'si istemcisi (api/worker.js). Adres NEXT_PUBLIC_API_URL ile verilir.
 * Tanımlı değilse site WhatsApp / e-posta akışına düşer (bkz. CheckoutForm).
 */

export const orderStatuses = ["odeme-bekliyor", "beklemede", "onaylandi", "hazirlaniyor", "kargolandi", "teslim-edildi", "iptal", "odeme-basarisiz"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const statusLabels: Record<OrderStatus, string> = {
  "odeme-bekliyor": "Ödeme bekleniyor",
  beklemede: "Havale bekleniyor",
  onaylandi: "Onaylandı",
  hazirlaniyor: "Hazırlanıyor",
  kargolandi: "Kargoya verildi",
  "teslim-edildi": "Teslim edildi",
  iptal: "İptal edildi",
  "odeme-basarisiz": "Ödeme başarısız",
};

export const statusTone: Record<OrderStatus, string> = {
  "odeme-bekliyor": "bg-caramel-300/50 text-espresso-900",
  beklemede: "bg-caramel-300/50 text-espresso-900",
  onaylandi: "bg-leaf-100 text-leaf-500",
  hazirlaniyor: "bg-[#e3ecf7] text-[#2a5a9a]",
  kargolandi: "bg-[#efe3f7] text-[#6a3a9a]",
  "teslim-edildi": "bg-espresso-900 text-cream-50",
  iptal: "bg-cream-200 text-espresso-600",
  "odeme-basarisiz": "bg-berry-500/10 text-berry-500",
};

/** Müşteriye gösterilen ilerleme adımları. */
export const progressSteps: { key: OrderStatus; label: string }[] = [
  { key: "onaylandi", label: "Onaylandı" },
  { key: "hazirlaniyor", label: "Hazırlanıyor" },
  { key: "kargolandi", label: "Kargoda" },
  { key: "teslim-edildi", label: "Teslim edildi" },
];

export const carriers: Record<string, string> = {
  yurtici: "Yurtiçi Kargo",
  aras: "Aras Kargo",
  mng: "MNG Kargo",
  ptt: "PTT Kargo",
  surat: "Sürat Kargo",
  hepsijet: "HepsiJET",
  ups: "UPS",
  diger: "Diğer",
};

export interface OrderEvent {
  at: string;
  type: "created" | "payment" | "status" | "cargo" | "note";
  status: OrderStatus | null;
  message: string | null;
  actor: "system" | "paytr" | "admin" | "customer";
}

export interface ApiOrder {
  orderNo: string;
  merchantOid?: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "bekliyor" | "odendi" | "basarisiz" | "kapida";
  paidAmount: number | null;
  totals: { subtotal: number; shipping: number; codFee: number; total: number };
  customer: OrderRecord["customer"];
  lines: OrderRecord["lines"];
  carrier: string | null;
  carrierName: string | null;
  trackingNo: string | null;
  trackingUrl: string;
  adminNote?: string | null;
  testMode: boolean;
  events: OrderEvent[];
}

export function apiEnabled(): boolean {
  return Boolean(site.api.url);
}

async function call<T>(path: string, init: RequestInit = {}, token?: string): Promise<T & { status: "success" | "failed"; reason?: string }> {
  const headers: Record<string, string> = { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(`${site.api.url}${path}`, { ...init, headers });
    const data = (await res.json().catch(() => ({}))) as T & { status: "success" | "failed"; reason?: string };
    if (!res.ok && !data.reason) data.reason = res.status === 401 ? "Yetkisiz" : `Sunucu hatası (${res.status})`;
    if (!data.status) data.status = res.ok ? "success" : "failed";
    return data;
  } catch {
    return { status: "failed", reason: "Sunucuya ulaşılamadı" } as T & { status: "failed"; reason: string };
  }
}

/* ------------------------------- Müşteri ---------------------------------- */

export interface CreateOrderResponse {
  orderNo: string;
  merchantOid: string;
  total: number;
  totals: ApiOrder["totals"];
  lines: OrderRecord["lines"];
  token?: string;
  demo?: boolean;
  orderStatus: OrderStatus;
}

export function createRemoteOrder(order: OrderRecord) {
  return call<CreateOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify({
      customer: order.customer,
      paymentMethod: order.paymentMethod,
      items: order.lines.map((l) => ({ productSlug: l.productSlug, variantId: l.variantId, quantity: l.quantity })),
    }),
  });
}

export function completeDemoPayment(orderNo: string, approve: boolean) {
  return call<object>("/paytr/demo", { method: "POST", body: JSON.stringify({ orderNo, approve }) });
}

export function trackOrder(orderNo: string, phone: string) {
  return call<{ order: ApiOrder }>(`/track?no=${encodeURIComponent(orderNo.trim())}&phone=${encodeURIComponent(phone.replace(/\D/g, ""))}`);
}

/* -------------------------------- Yönetim --------------------------------- */

export const admin = {
  login: (password: string) => call<object>("/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  stats: (token: string) =>
    call<{ byStatus: { status: OrderStatus; n: number; sum: number }[]; today: { n: number; sum: number }; month: { n: number; sum: number } }>("/admin/stats", {}, token),
  list: (token: string, params: { status?: string; q?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.q) qs.set("q", params.q);
    if (params.page) qs.set("page", String(params.page));
    return call<{ orders: ApiOrder[]; page: number; pages: number; total: number }>(`/admin/orders?${qs}`, {}, token);
  },
  get: (token: string, orderNo: string) => call<{ order: ApiOrder }>(`/admin/orders/${encodeURIComponent(orderNo)}`, {}, token),
  update: (token: string, orderNo: string, patch: { status?: OrderStatus; carrier?: string; trackingNo?: string; trackingUrl?: string; adminNote?: string; message?: string }) =>
    call<{ order: ApiOrder }>(`/admin/orders/${encodeURIComponent(orderNo)}`, { method: "PATCH", body: JSON.stringify(patch) }, token),
};
