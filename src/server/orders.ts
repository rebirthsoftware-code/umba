import type { InValue, Row } from "@libsql/client";
import { db } from "./db";
import { getPaytrToken, paymentDemoMode, paytrTestMode } from "./paytr";
import { products } from "@/lib/products";
import { site } from "@/lib/site";
import { computeDiscount } from "@/lib/discount";
import { orderStatuses, type ApiOrder, type OrderEvent, type OrderStatus } from "@/lib/api";
import type { OrderLine, PaymentMethod } from "@/lib/order";

/** Kargo firmaları ve takip adresi şablonları ({no} → takip numarası). */
export const CARRIERS: Record<string, { name: string; url: string }> = {
  yurtici: { name: "Yurtiçi Kargo", url: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code={no}" },
  aras: { name: "Aras Kargo", url: "https://kargotakip.araskargo.com.tr/mainpage.aspx?code={no}" },
  mng: { name: "MNG Kargo", url: "https://www.mngkargo.com.tr/gonderitakip/?kargoTakipNo={no}" },
  ptt: { name: "PTT Kargo", url: "https://gonderitakip.ptt.gov.tr/Track/Verify?q={no}" },
  surat: { name: "Sürat Kargo", url: "https://www.suratkargo.com.tr/KargoTakip/?kargotakipno={no}" },
  hepsijet: { name: "HepsiJET", url: "https://www.hepsijet.com/gonderi-takibi/{no}" },
  ups: { name: "UPS", url: "https://www.ups.com/track?loc=tr_TR&tracknum={no}" },
  diger: { name: "Diğer", url: "" },
};

const now = () => new Date().toISOString();
const digits = (s: unknown) => String(s ?? "").replace(/\D/g, "").slice(-10);

export function generateOrderNo(date = new Date()): string {
  const ymd = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 36 ** 4).toString(36).toUpperCase().padStart(4, "0");
  return `UMB-${ymd}-${rand}`;
}

/* ----------------------------- Hesaplama ---------------------------------- */

export interface ComputedOrder {
  lines: OrderLine[];
  subtotal: number;
  shipping: number;
  codFee: number;
  discount: number;
  total: number;
}

/** Sepeti katalog fiyatlarıyla yeniden hesaplar (istemciden gelen fiyatlara güvenilmez). */
export function computeOrder(items: { productSlug: string; variantId: string; quantity: number }[], paymentMethod: PaymentMethod): ComputedOrder {
  const lines: OrderLine[] = [];
  for (const it of items) {
    const product = products.find((p) => p.slug === it.productSlug);
    const variant = product?.variants.find((v) => v.id === it.variantId);
    const qty = Math.min(99, Math.max(1, Number(it.quantity) || 0));
    if (!product || !variant || !variant.inStock || qty < 1) continue;
    lines.push({
      productSlug: product.slug,
      name: product.name,
      variantId: variant.id,
      variantLabel: variant.label,
      sku: variant.sku,
      unitPrice: variant.price,
      quantity: qty,
      lineTotal: Math.round(variant.price * qty * 100) / 100,
    });
  }
  const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const { freeShippingThreshold, shippingFee, codFee } = site.commerce;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const cod = 0;
  void paymentMethod;
  void codFee;
  const discount = computeDiscount(subtotal).amount;
  const total = Math.round((subtotal - discount + shipping + cod) * 100) / 100;
  return { lines, subtotal, shipping, codFee: cod, discount, total };
}

/* -------------------------------- Satırlar -------------------------------- */

function rowToOrder(row: Row, events: OrderEvent[] = []): ApiOrder {
  const carrierKey = row.carrier ? String(row.carrier) : null;
  const carrier = carrierKey ? CARRIERS[carrierKey] : null;
  const trackingNo = row.tracking_no ? String(row.tracking_no) : null;
  const trackingUrl = (row.tracking_url ? String(row.tracking_url) : "") || (carrier && trackingNo && carrier.url ? carrier.url.replace("{no}", encodeURIComponent(trackingNo)) : "");
  return {
    orderNo: String(row.order_no),
    merchantOid: String(row.merchant_oid),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    status: row.status as OrderStatus,
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: row.payment_status as ApiOrder["paymentStatus"],
    paidAmount: row.paid_amount === null ? null : Number(row.paid_amount),
    totals: { subtotal: Number(row.subtotal), shipping: Number(row.shipping), codFee: Number(row.cod_fee), discount: Number(row.discount ?? 0), total: Number(row.total) },
    customer: JSON.parse(String(row.customer_json)),
    lines: JSON.parse(String(row.lines_json)),
    carrier: carrierKey,
    carrierName: carrier?.name ?? null,
    trackingNo,
    trackingUrl,
    adminNote: row.admin_note ? String(row.admin_note) : null,
    testMode: Boolean(Number(row.test_mode)),
    events,
  };
}

export async function getOrder(orderNo: string): Promise<ApiOrder | null> {
  const c = await db();
  const r = await c.execute({ sql: "SELECT * FROM orders WHERE order_no = ?1 OR merchant_oid = ?1", args: [orderNo] });
  const row = r.rows[0];
  if (!row) return null;
  const ev = await c.execute({ sql: "SELECT at, type, status, message, actor FROM order_events WHERE order_no = ?1 ORDER BY id", args: [String(row.order_no)] });
  return rowToOrder(row, ev.rows.map((e) => ({ at: String(e.at), type: e.type as OrderEvent["type"], status: (e.status as OrderStatus) ?? null, message: e.message ? String(e.message) : null, actor: e.actor as OrderEvent["actor"] })));
}

export async function addEvent(orderNo: string, type: OrderEvent["type"], opts: { status?: OrderStatus | null; message?: string | null; actor?: OrderEvent["actor"] } = {}) {
  const c = await db();
  await c.execute({ sql: "INSERT INTO order_events (order_no, at, type, status, message, actor) VALUES (?1, ?2, ?3, ?4, ?5, ?6)", args: [orderNo, now(), type, opts.status ?? null, opts.message ?? null, opts.actor ?? "system"] });
}

export async function notify(subject: string, message: string) {
  const hook = process.env.NOTIFY_WEBHOOK;
  if (!hook) return;
  await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ subject, message }) }).catch(() => {});
}

/* ------------------------------ Oluşturma --------------------------------- */

export interface CreateOrderBody {
  customer: Record<string, unknown>;
  paymentMethod?: string;
  items: { productSlug: string; variantId: string; quantity: number }[];
}

export type CreateResult =
  | { ok: true; orderNo: string; merchantOid: string; totals: ComputedOrder; token?: string; demo?: boolean; orderStatus: OrderStatus }
  | { ok: false; status: number; reason: string; orderNo?: string };

export async function createOrder(body: CreateOrderBody, userIp: string): Promise<CreateResult> {
  const c = body.customer ?? {};
  const paymentMethod: PaymentMethod = body.paymentMethod === "kart" ? "kart" : "havale";
  const email = String(c.email ?? "").trim().toLowerCase();
  const phone = digits(c.phone);
  if (!email.includes("@") || phone.length < 10 || !c.fullName || !c.address || !c.city) return { ok: false, status: 400, reason: "Müşteri bilgileri eksik" };
  const demo = paymentMethod === "kart" && paymentDemoMode();

  const order = computeOrder(body.items ?? [], paymentMethod);
  if (order.lines.length === 0 || order.total <= 0) return { ok: false, status: 400, reason: "Sepet boş veya ürünler stokta değil" };

  const orderNo = generateOrderNo();
  const merchantOid = orderNo.replace(/[^a-zA-Z0-9]/g, "");
  const customer = {
    fullName: String(c.fullName).slice(0, 80),
    email,
    phone: String(c.phone).slice(0, 20),
    address: String(c.address).slice(0, 400),
    district: String(c.district ?? "").slice(0, 60),
    city: String(c.city).slice(0, 60),
    postalCode: String(c.postalCode ?? "").slice(0, 10),
    note: String(c.note ?? "").slice(0, 500),
    invoiceType: c.invoiceType === "kurumsal" ? "kurumsal" : "bireysel",
    companyName: String(c.companyName ?? "").slice(0, 120),
    taxOffice: String(c.taxOffice ?? "").slice(0, 80),
    taxNo: String(c.taxNo ?? "").slice(0, 11),
  };
  const status: OrderStatus = paymentMethod === "kart" ? "odeme-bekliyor" : "beklemede";
  const paymentStatus = "bekliyor";
  const ts = now();
  const testMode = paymentMethod === "kart" && (demo || paytrTestMode()) ? 1 : 0;

  const client = await db();
  await client.execute({
    sql: `INSERT INTO orders (order_no, merchant_oid, created_at, updated_at, status, payment_method, payment_status, total, subtotal, shipping, cod_fee, discount,
            customer_json, lines_json, phone_digits, email, test_mode)
          VALUES (?1, ?2, ?3, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)`,
    args: [orderNo, merchantOid, ts, status, paymentMethod, paymentStatus, order.total, order.subtotal, order.shipping, order.codFee, order.discount, JSON.stringify(customer), JSON.stringify(order.lines), phone, email, testMode],
  });
  await addEvent(orderNo, "created", { status, message: `Sipariş oluşturuldu · ${paymentMethod}`, actor: "customer" });

  let token: string | undefined;
  if (paymentMethod === "kart" && demo) {
    await addEvent(orderNo, "payment", { message: "Demo kart ödemesi başlatıldı (PayTR yapılandırılmadı)", actor: "system" });
  } else if (paymentMethod === "kart") {
    try {
      token = await getPaytrToken({ orderNo, merchantOid, userIp, customer, lines: order.lines, shipping: order.shipping, discount: order.discount, total: order.total });
    } catch (err) {
      const reason = err instanceof Error ? err.message : "PayTR hatası";
      await addEvent(orderNo, "payment", { status: "odeme-basarisiz", message: `PayTR token hatası: ${reason}`, actor: "paytr" });
      await client.execute({ sql: "UPDATE orders SET status = 'odeme-basarisiz', payment_status = 'basarisiz', updated_at = ?2 WHERE order_no = ?1", args: [orderNo, now()] });
      return { ok: false, status: 502, reason, orderNo };
    }
  } else {
    await notify(`Yeni sipariş ${orderNo} · ${order.total.toFixed(2)} TL · ${paymentMethod}`, `${customer.fullName} · ${customer.phone}\n${site.url}/yonetim?no=${orderNo}`);
  }
  return { ok: true, orderNo, merchantOid, totals: order, token, demo: demo || undefined, orderStatus: status };
}

/* --------------------------- PayTR bildirimi ------------------------------ */

export async function applyPaymentCallback(merchantOid: string, status: string, totalAmount: string, extra: { failedReason?: string; testMode?: boolean }) {
  const client = await db();
  const r = await client.execute({ sql: "SELECT order_no, payment_status FROM orders WHERE merchant_oid = ?1", args: [merchantOid] });
  const row = r.rows[0];
  // Yalnızca ilk bildirim işlenir; tekrarlar için sadece OK dönülür.
  if (!row || row.payment_status !== "bekliyor") return;
  const orderNo = String(row.order_no);
  const paid = Number(totalAmount) / 100;
  if (status === "success") {
    await client.execute({ sql: "UPDATE orders SET status = 'onaylandi', payment_status = 'odendi', paid_amount = ?2, updated_at = ?3 WHERE order_no = ?1", args: [orderNo, paid, now()] });
    await addEvent(orderNo, "payment", { status: "onaylandi", message: `Kart ödemesi alındı · ${paid.toFixed(2)} TL${extra.testMode ? " (test)" : ""}`, actor: "paytr" });
    await notify(`Ödeme alındı · ${orderNo} · ${paid.toFixed(2)} TL`, `${site.url}/yonetim?no=${orderNo}`);
  } else {
    await client.execute({ sql: "UPDATE orders SET status = 'odeme-basarisiz', payment_status = 'basarisiz', updated_at = ?2 WHERE order_no = ?1", args: [orderNo, now()] });
    await addEvent(orderNo, "payment", { status: "odeme-basarisiz", message: `Ödeme başarısız: ${extra.failedReason ?? "Ödeme reddedildi"}`, actor: "paytr" });
  }
}

/** Demo kart ödemesi: yalnızca demo modunda, ödeme bekleyen sipariş için. */
export async function completeDemoPayment(orderNo: string, approve: boolean): Promise<{ ok: true } | { ok: false; status: number; reason: string }> {
  if (!paymentDemoMode()) return { ok: false, status: 403, reason: "Demo ödeme kapalı" };
  const order = await getOrder(orderNo.toUpperCase());
  if (!order) return { ok: false, status: 404, reason: "Sipariş bulunamadı" };
  if (order.paymentMethod !== "kart" || order.paymentStatus !== "bekliyor") return { ok: false, status: 400, reason: "Bu sipariş için ödeme beklenmiyor" };
  await applyPaymentCallback(order.merchantOid!, approve ? "success" : "failed", String(Math.round(order.totals.total * 100)), { failedReason: "Demo: kart reddedildi", testMode: true });
  return { ok: true };
}

/* --------------------------------- Takip ---------------------------------- */

export async function trackOrder(no: string, phone: string): Promise<ApiOrder | null> {
  const order = await getOrder(no.trim().toUpperCase());
  if (!order || order.customer.phone.replace(/\D/g, "").slice(-10) !== digits(phone)) return null;
  const { adminNote: _n, merchantOid: _m, ...pub } = order;
  void _n;
  void _m;
  return { ...pub, events: order.events.filter((e) => e.type !== "note") } as ApiOrder;
}

/* -------------------------------- Yönetim --------------------------------- */

export async function listOrders(params: { status?: string | null; q?: string | null; page?: number }) {
  const client = await db();
  const size = 30;
  const page = Math.max(1, params.page || 1);
  const where: string[] = [];
  const args: InValue[] = [];
  if (params.status && (orderStatuses as readonly string[]).includes(params.status)) {
    where.push(`status = ?${args.length + 1}`);
    args.push(params.status);
  }
  if (params.q?.trim()) {
    const i = args.length + 1;
    where.push(`(order_no LIKE ?${i} OR customer_json LIKE ?${i} OR email LIKE ?${i} OR tracking_no LIKE ?${i})`);
    args.push(`%${params.q.trim()}%`);
  }
  const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const total = Number((await client.execute({ sql: `SELECT COUNT(*) AS n FROM orders ${w}`, args })).rows[0]?.n ?? 0);
  const rows = await client.execute({ sql: `SELECT * FROM orders ${w} ORDER BY created_at DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, args });
  return { page, pages: Math.max(1, Math.ceil(total / size)), total, orders: rows.rows.map((r) => rowToOrder(r)) };
}

export async function stats() {
  const client = await db();
  const byStatus = (await client.execute("SELECT status, COUNT(*) AS n, COALESCE(SUM(total),0) AS sum FROM orders GROUP BY status")).rows.map((r) => ({ status: r.status as OrderStatus, n: Number(r.n), sum: Number(r.sum) }));
  const today = new Date().toISOString().slice(0, 10);
  const agg = async (since: string) => {
    const r = (await client.execute({ sql: "SELECT COUNT(*) AS n, COALESCE(SUM(total),0) AS sum FROM orders WHERE created_at >= ?1 AND status NOT IN ('iptal','odeme-basarisiz')", args: [since] })).rows[0];
    return { n: Number(r?.n ?? 0), sum: Number(r?.sum ?? 0) };
  };
  return { byStatus, today: await agg(today), month: await agg(today.slice(0, 7) + "-01") };
}

export interface OrderPatch {
  status?: string;
  carrier?: string;
  trackingNo?: string;
  trackingUrl?: string;
  adminNote?: string;
  message?: string;
}

export async function updateOrder(orderNo: string, body: OrderPatch): Promise<{ ok: true; order: ApiOrder } | { ok: false; status: number; reason: string }> {
  const current = await getOrder(orderNo);
  if (!current) return { ok: false, status: 404, reason: "Sipariş bulunamadı" };
  const client = await db();
  const sets: string[] = [];
  const args: InValue[] = [];
  const push = (col: string, val: InValue) => {
    sets.push(`${col} = ?${args.length + 1}`);
    args.push(val);
  };

  if (body.status !== undefined) {
    if (!(orderStatuses as readonly string[]).includes(body.status)) return { ok: false, status: 400, reason: "Geçersiz durum" };
    const next = body.status as OrderStatus;
    if (next !== current.status) {
      push("status", next);
      if (next === "onaylandi" && current.paymentMethod === "havale") push("payment_status", "odendi");
      await addEvent(orderNo, "status", { status: next, message: body.message || null, actor: "admin" });
    }
  }
  if (body.carrier !== undefined || body.trackingNo !== undefined || body.trackingUrl !== undefined) {
    const carrier = body.carrier && CARRIERS[body.carrier] ? body.carrier : current.carrier;
    const trackingNo = body.trackingNo !== undefined ? String(body.trackingNo).trim().slice(0, 60) : current.trackingNo;
    const trackingUrl = body.trackingUrl !== undefined ? String(body.trackingUrl).trim().slice(0, 400) : "";
    push("carrier", carrier ?? null);
    push("tracking_no", trackingNo || null);
    push("tracking_url", trackingUrl || null);
    if (trackingNo && trackingNo !== current.trackingNo) {
      await addEvent(orderNo, "cargo", { status: "kargolandi", message: `${(carrier && CARRIERS[carrier]?.name) ?? "Kargo"} · ${trackingNo}`, actor: "admin" });
      if (body.status === undefined && !["kargolandi", "teslim-edildi"].includes(current.status)) push("status", "kargolandi");
    }
  }
  if (body.adminNote !== undefined) {
    push("admin_note", String(body.adminNote).slice(0, 2000));
    await addEvent(orderNo, "note", { message: String(body.adminNote).slice(0, 200), actor: "admin" });
  }
  if (sets.length) {
    push("updated_at", now());
    await client.execute({ sql: `UPDATE orders SET ${sets.join(", ")} WHERE order_no = ?${args.length + 1}`, args: [...args, orderNo] });
  }
  return { ok: true, order: (await getOrder(orderNo))! };
}
