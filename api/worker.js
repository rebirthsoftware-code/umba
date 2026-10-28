/**
 * Umba Coffee – Sipariş API'si (Cloudflare Worker + D1)
 *
 * Site statik (GitHub Pages) olduğu için siparişler, PayTR anahtarları ve yönetim
 * işlemleri bu küçük sunucuda tutulur.
 *
 *   POST /orders                 → siparişi katalog fiyatlarıyla hesaplar, D1'e yazar; kartta PayTR iframe token'ı döner
 *   POST /callback               → PayTR ödeme bildirimi (hash doğrulanır, "OK" döner)
 *   GET  /track?no=&phone=       → müşteri sipariş takibi (sipariş no + telefon)
 *   GET  /health
 *
 *   Yönetim (Authorization: Bearer <ADMIN_PASSWORD>):
 *   POST  /admin/login           → şifre doğrulama
 *   GET   /admin/orders?status=&q=&page=
 *   GET   /admin/orders/:no
 *   PATCH /admin/orders/:no      → { status?, carrier?, trackingNo?, trackingUrl?, adminNote?, message? }
 *   GET   /admin/stats
 *
 * Ortam değişkenleri: bkz. wrangler.toml ve README.md
 */

const PAYTR_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

export const STATUSES = ["odeme-bekliyor", "beklemede", "onaylandi", "hazirlaniyor", "kargolandi", "teslim-edildi", "iptal", "odeme-basarisiz"];

/** Kargo firmaları ve takip adresi şablonları ({no} → takip numarası). */
export const CARRIERS = {
  yurtici: { name: "Yurtiçi Kargo", url: "https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code={no}" },
  aras: { name: "Aras Kargo", url: "https://kargotakip.araskargo.com.tr/mainpage.aspx?code={no}" },
  mng: { name: "MNG Kargo", url: "https://www.mngkargo.com.tr/gonderitakip/?kargoTakipNo={no}" },
  ptt: { name: "PTT Kargo", url: "https://gonderitakip.ptt.gov.tr/Track/Verify?q={no}" },
  surat: { name: "Sürat Kargo", url: "https://www.suratkargo.com.tr/KargoTakip/?kargotakipno={no}" },
  hepsijet: { name: "HepsiJET", url: "https://www.hepsijet.com/gonderi-takibi/{no}" },
  ups: { name: "UPS", url: "https://www.ups.com/track?loc=tr_TR&tracknum={no}" },
  diger: { name: "Diğer", url: "" },
};

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...extra } });

function cors(env, request) {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = (env.ALLOWED_ORIGIN ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.length === 0 || allowed.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin || "*" : allowed[0],
    "Access-Control-Allow-Methods": "POST, GET, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export async function hmacBase64(message, key) {
  const enc = new TextEncoder();
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

const b64utf8 = (s) => btoa(unescape(encodeURIComponent(s)));
const now = () => new Date().toISOString();
const digits = (s) => String(s ?? "").replace(/\D/g, "").slice(-10);

export function generateOrderNo(date = new Date()) {
  const ymd = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 36 ** 4).toString(36).toUpperCase().padStart(4, "0");
  return `UMB-${ymd}-${rand}`;
}

/* -------------------------------------------------------------------------- */
/*  Katalog ve hesaplama                                                       */
/* -------------------------------------------------------------------------- */

let catalogCache = { at: 0, data: null };
export async function loadCatalog(env) {
  if (catalogCache.data && Date.now() - catalogCache.at < 5 * 60 * 1000) return catalogCache.data;
  const res = await fetch(`${env.SITE_URL}/catalog.json`, { cf: { cacheTtl: 300 } });
  if (!res.ok) throw new Error("Katalog okunamadı");
  const data = await res.json();
  catalogCache = { at: Date.now(), data };
  return data;
}

/** Sepeti katalog fiyatlarıyla yeniden hesaplar (istemciden gelen fiyatlara güvenilmez). */
export function computeOrder(catalog, items, paymentMethod = "kart") {
  const bySku = new Map(catalog.items.map((i) => [`${i.slug}::${i.variantId}`, i]));
  const lines = [];
  for (const it of items) {
    const item = bySku.get(`${it.productSlug}::${it.variantId}`);
    const qty = Math.min(99, Math.max(1, Number(it.quantity) || 0));
    if (!item || !item.inStock || qty < 1) continue;
    lines.push({
      productSlug: item.slug,
      variantId: item.variantId,
      sku: item.sku,
      name: item.name,
      variantLabel: item.variantLabel ?? "",
      unitPrice: item.price,
      quantity: qty,
      lineTotal: Math.round(item.price * qty * 100) / 100,
    });
  }
  const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const { freeShippingThreshold, shippingFee, codFee } = catalog.commerce;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const cod = paymentMethod === "kapida" ? codFee : 0;
  const total = Math.round((subtotal + shipping + cod) * 100) / 100;
  return { lines, subtotal, shipping, codFee: cod, total };
}

/* -------------------------------------------------------------------------- */
/*  Veritabanı yardımcıları                                                     */
/* -------------------------------------------------------------------------- */

function rowToOrder(row, events = []) {
  if (!row) return null;
  const carrier = row.carrier ? CARRIERS[row.carrier] : null;
  const trackingUrl = row.tracking_url || (carrier && row.tracking_no ? carrier.url.replace("{no}", encodeURIComponent(row.tracking_no)) : "");
  return {
    orderNo: row.order_no,
    merchantOid: row.merchant_oid,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentStatus: row.payment_status,
    paidAmount: row.paid_amount,
    totals: { subtotal: row.subtotal, shipping: row.shipping, codFee: row.cod_fee, total: row.total },
    customer: JSON.parse(row.customer_json),
    lines: JSON.parse(row.lines_json),
    carrier: row.carrier,
    carrierName: carrier?.name ?? null,
    trackingNo: row.tracking_no,
    trackingUrl,
    adminNote: row.admin_note,
    testMode: Boolean(row.test_mode),
    events,
  };
}

async function getOrder(env, orderNo) {
  const row = await env.DB.prepare("SELECT * FROM orders WHERE order_no = ?1 OR merchant_oid = ?1").bind(orderNo).first();
  if (!row) return null;
  const ev = await env.DB.prepare("SELECT at, type, status, message, actor FROM order_events WHERE order_no = ?1 ORDER BY id").bind(row.order_no).all();
  return rowToOrder(row, ev.results ?? []);
}

async function addEvent(env, orderNo, type, { status = null, message = null, actor = "system" } = {}) {
  await env.DB.prepare("INSERT INTO order_events (order_no, at, type, status, message, actor) VALUES (?1, ?2, ?3, ?4, ?5, ?6)")
    .bind(orderNo, now(), type, status, message, actor)
    .run();
}

async function notify(env, subject, message) {
  if (!env.NOTIFY_WEBHOOK) return;
  await fetch(env.NOTIFY_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ subject, message }),
  }).catch(() => {});
}

/* -------------------------------------------------------------------------- */
/*  PayTR                                                                       */
/* -------------------------------------------------------------------------- */

async function paytrToken(env, request, { orderNo, merchantOid, customer, order }) {
  const email = String(customer.email ?? "").trim();
  const paymentAmount = String(Math.round(order.total * 100)); // kuruş
  const basket = b64utf8(
    JSON.stringify([
      ...order.lines.map((l) => [l.name, l.unitPrice.toFixed(2), l.quantity]),
      ...(order.shipping > 0 ? [["Kargo", order.shipping.toFixed(2), 1]] : []),
    ]),
  );
  const userIp = request.headers.get("CF-Connecting-IP") ?? request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = "TL";
  const testMode = env.TEST_MODE === "1" ? "1" : "0";

  const hashStr = `${env.PAYTR_MERCHANT_ID}${userIp}${merchantOid}${email}${paymentAmount}${basket}${noInstallment}${maxInstallment}${currency}${testMode}`;
  const token = await hmacBase64(hashStr + env.PAYTR_MERCHANT_SALT, env.PAYTR_MERCHANT_KEY);

  const form = new URLSearchParams({
    merchant_id: env.PAYTR_MERCHANT_ID,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email,
    payment_amount: paymentAmount,
    paytr_token: token,
    user_basket: basket,
    debug_on: testMode,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: String(customer.fullName ?? "").slice(0, 60),
    user_address: `${customer.address ?? ""} ${customer.district ?? ""}/${customer.city ?? ""}`.slice(0, 400),
    user_phone: String(customer.phone ?? "").replace(/\s/g, "").slice(0, 20),
    merchant_ok_url: `${env.SITE_URL}/odeme/basarili/?no=${encodeURIComponent(orderNo)}`,
    merchant_fail_url: `${env.SITE_URL}/odeme/basarisiz/?no=${encodeURIComponent(orderNo)}`,
    timeout_limit: "30",
    currency,
    test_mode: testMode,
    lang: "tr",
  });
  const res = await fetch(env.PAYTR_TOKEN_URL ?? PAYTR_TOKEN_URL, { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (data.status !== "success") throw new Error(data.reason ?? "PayTR token alınamadı");
  return data.token;
}

/* -------------------------------------------------------------------------- */
/*  Uç noktalar                                                                 */
/* -------------------------------------------------------------------------- */

async function handleCreateOrder(request, env) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || !body.customer) return json({ status: "failed", reason: "Geçersiz istek" }, 400);
  const c = body.customer;
  const paymentMethod = ["kart", "havale", "kapida"].includes(body.paymentMethod) ? body.paymentMethod : "havale";
  const email = String(c.email ?? "").trim().toLowerCase();
  const phone = digits(c.phone);
  if (!email.includes("@") || phone.length < 10 || !c.fullName || !c.address || !c.city) {
    return json({ status: "failed", reason: "Müşteri bilgileri eksik" }, 400);
  }
  if (paymentMethod === "kart" && !env.PAYTR_MERCHANT_ID) return json({ status: "failed", reason: "Kart ödemesi henüz yapılandırılmadı" }, 400);

  const catalog = await loadCatalog(env);
  const order = computeOrder(catalog, body.items, paymentMethod);
  if (order.lines.length === 0 || order.total <= 0) return json({ status: "failed", reason: "Sepet boş veya ürünler stokta değil" }, 400);

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
  const status = paymentMethod === "kart" ? "odeme-bekliyor" : paymentMethod === "havale" ? "beklemede" : "onaylandi";
  const paymentStatus = paymentMethod === "kapida" ? "kapida" : "bekliyor";
  const ts = now();

  await env.DB.prepare(
    `INSERT INTO orders (order_no, merchant_oid, created_at, updated_at, status, payment_method, payment_status, total, subtotal, shipping, cod_fee,
       customer_json, lines_json, phone_digits, email, test_mode)
     VALUES (?1, ?2, ?3, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)`,
  )
    .bind(orderNo, merchantOid, ts, status, paymentMethod, paymentStatus, order.total, order.subtotal, order.shipping, order.codFee,
      JSON.stringify(customer), JSON.stringify(order.lines), phone, email, env.TEST_MODE === "1" ? 1 : 0)
    .run();
  await addEvent(env, orderNo, "created", { status, message: `Sipariş oluşturuldu · ${paymentMethod}`, actor: "customer" });

  let token;
  if (paymentMethod === "kart") {
    try {
      token = await paytrToken(env, request, { orderNo, merchantOid, customer, order });
    } catch (err) {
      await addEvent(env, orderNo, "payment", { status: "odeme-basarisiz", message: `PayTR token hatası: ${err.message}`, actor: "paytr" });
      await env.DB.prepare("UPDATE orders SET status = 'odeme-basarisiz', payment_status = 'basarisiz', updated_at = ?2 WHERE order_no = ?1").bind(orderNo, now()).run();
      return json({ status: "failed", reason: err.message, orderNo }, 502);
    }
  } else {
    await notify(env, `Yeni sipariş ${orderNo} · ${order.total.toFixed(2)} TL · ${paymentMethod}`, `${customer.fullName} · ${customer.phone}\n${env.SITE_URL}/yonetim/?no=${orderNo}`);
  }

  return json({ status: "success", orderNo, merchantOid, total: order.total, totals: { subtotal: order.subtotal, shipping: order.shipping, codFee: order.codFee, total: order.total }, lines: order.lines, token, orderStatus: status });
}

async function handleCallback(request, env) {
  const form = await request.formData();
  const merchantOid = form.get("merchant_oid") ?? "";
  const status = form.get("status") ?? "";
  const totalAmount = form.get("total_amount") ?? "";
  const hash = form.get("hash") ?? "";
  const expected = await hmacBase64(`${merchantOid}${env.PAYTR_MERCHANT_SALT}${status}${totalAmount}`, env.PAYTR_MERCHANT_KEY);
  if (hash !== expected) return new Response("PAYTR notification failed: bad hash", { status: 400 });

  const row = await env.DB.prepare("SELECT order_no, payment_status, total FROM orders WHERE merchant_oid = ?1").bind(merchantOid).first();
  if (row && row.payment_status === "bekliyor") {
    // Yalnızca ilk bildirim işlenir; tekrarlar için sadece OK dönülür.
    const paid = Number(totalAmount) / 100;
    if (status === "success") {
      await env.DB.prepare("UPDATE orders SET status = 'onaylandi', payment_status = 'odendi', paid_amount = ?2, updated_at = ?3 WHERE order_no = ?1")
        .bind(row.order_no, paid, now()).run();
      await addEvent(env, row.order_no, "payment", { status: "onaylandi", message: `Kart ödemesi alındı · ${paid.toFixed(2)} TL${form.get("test_mode") === "1" ? " (test)" : ""}`, actor: "paytr" });
      await notify(env, `Ödeme alındı · ${row.order_no} · ${paid.toFixed(2)} TL`, `${env.SITE_URL}/yonetim/?no=${row.order_no}`);
    } else {
      const reason = form.get("failed_reason_msg") ?? "Ödeme reddedildi";
      await env.DB.prepare("UPDATE orders SET status = 'odeme-basarisiz', payment_status = 'basarisiz', updated_at = ?2 WHERE order_no = ?1").bind(row.order_no, now()).run();
      await addEvent(env, row.order_no, "payment", { status: "odeme-basarisiz", message: `Ödeme başarısız: ${reason}`, actor: "paytr" });
    }
  }
  return new Response("OK");
}

async function handleTrack(url, env) {
  const no = (url.searchParams.get("no") ?? "").trim().toUpperCase();
  const phone = digits(url.searchParams.get("phone"));
  if (!no || phone.length < 10) return json({ status: "failed", reason: "Sipariş numarası ve telefon gerekli" }, 400);
  const order = await getOrder(env, no);
  if (!order || order.customer.phone.replace(/\D/g, "").slice(-10) !== phone) return json({ status: "failed", reason: "Bu bilgilerle eşleşen sipariş bulunamadı" }, 404);
  // Müşteriye gösterilen alanlar (yönetici notu ve iç olaylar hariç)
  const { adminNote: _n, merchantOid: _m, ...pub } = order;
  void _n; void _m;
  pub.events = order.events.filter((e) => e.type !== "note");
  return json({ status: "success", order: pub });
}

/* ------------------------------- Yönetim ---------------------------------- */

function isAdmin(request, env) {
  const auth = request.headers.get("Authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return Boolean(env.ADMIN_PASSWORD) && token === env.ADMIN_PASSWORD;
}

async function handleAdmin(request, env, url) {
  const path = url.pathname.replace(/^\/admin/, "");
  if (path === "/login" && request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    if (!env.ADMIN_PASSWORD) return json({ status: "failed", reason: "ADMIN_PASSWORD tanımlı değil" }, 500);
    if (body.password !== env.ADMIN_PASSWORD) return json({ status: "failed", reason: "Şifre hatalı" }, 401);
    return json({ status: "success" });
  }
  if (!isAdmin(request, env)) return json({ status: "failed", reason: "Yetkisiz" }, 401);

  if (path === "/stats" && request.method === "GET") {
    const byStatus = await env.DB.prepare("SELECT status, COUNT(*) AS n, COALESCE(SUM(total),0) AS sum FROM orders GROUP BY status").all();
    const today = new Date().toISOString().slice(0, 10);
    const todayRow = await env.DB.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(total),0) AS sum FROM orders WHERE created_at >= ?1 AND status NOT IN ('iptal','odeme-basarisiz')").bind(today).first();
    const monthRow = await env.DB.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(total),0) AS sum FROM orders WHERE created_at >= ?1 AND status NOT IN ('iptal','odeme-basarisiz')").bind(today.slice(0, 7) + "-01").first();
    return json({ status: "success", byStatus: byStatus.results ?? [], today: todayRow, month: monthRow });
  }

  if (path === "/orders" && request.method === "GET") {
    const status = url.searchParams.get("status");
    const q = (url.searchParams.get("q") ?? "").trim();
    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const size = 30;
    const where = [];
    const binds = [];
    if (status && STATUSES.includes(status)) { where.push(`status = ?${binds.length + 1}`); binds.push(status); }
    if (q) { where.push(`(order_no LIKE ?${binds.length + 1} OR customer_json LIKE ?${binds.length + 1} OR email LIKE ?${binds.length + 1} OR tracking_no LIKE ?${binds.length + 1})`); binds.push(`%${q}%`); }
    const w = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const total = await env.DB.prepare(`SELECT COUNT(*) AS n FROM orders ${w}`).bind(...binds).first();
    const rows = await env.DB.prepare(`SELECT * FROM orders ${w} ORDER BY created_at DESC LIMIT ${size} OFFSET ${(page - 1) * size}`).bind(...binds).all();
    return json({ status: "success", page, pages: Math.max(1, Math.ceil((total?.n ?? 0) / size)), total: total?.n ?? 0, orders: (rows.results ?? []).map((r) => rowToOrder(r)) });
  }

  const m = path.match(/^\/orders\/([A-Z0-9-]+)$/i);
  if (m && request.method === "GET") {
    const order = await getOrder(env, m[1].toUpperCase());
    return order ? json({ status: "success", order }) : json({ status: "failed", reason: "Sipariş bulunamadı" }, 404);
  }
  if (m && request.method === "PATCH") {
    const orderNo = m[1].toUpperCase();
    const current = await getOrder(env, orderNo);
    if (!current) return json({ status: "failed", reason: "Sipariş bulunamadı" }, 404);
    const body = await request.json().catch(() => ({}));
    const sets = [];
    const binds = [];
    const push = (col, val) => { sets.push(`${col} = ?${binds.length + 1}`); binds.push(val); };

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) return json({ status: "failed", reason: "Geçersiz durum" }, 400);
      if (body.status !== current.status) {
        push("status", body.status);
        if (body.status === "onaylandi" && current.paymentMethod === "havale") push("payment_status", "odendi");
        await addEvent(env, orderNo, "status", { status: body.status, message: body.message || null, actor: "admin" });
      }
    }
    if (body.carrier !== undefined || body.trackingNo !== undefined || body.trackingUrl !== undefined) {
      const carrier = body.carrier && CARRIERS[body.carrier] ? body.carrier : current.carrier;
      const trackingNo = body.trackingNo !== undefined ? String(body.trackingNo).trim().slice(0, 60) : current.trackingNo;
      const trackingUrl = body.trackingUrl !== undefined ? String(body.trackingUrl).trim().slice(0, 400) : (current.trackingUrl && !current.carrier ? current.trackingUrl : "");
      push("carrier", carrier ?? null);
      push("tracking_no", trackingNo || null);
      push("tracking_url", trackingUrl || null);
      if (trackingNo && trackingNo !== current.trackingNo) {
        await addEvent(env, orderNo, "cargo", { status: "kargolandi", message: `${CARRIERS[carrier]?.name ?? "Kargo"} · ${trackingNo}`, actor: "admin" });
        if (body.status === undefined && !["kargolandi", "teslim-edildi"].includes(current.status)) {
          push("status", "kargolandi");
        }
      }
    }
    if (body.adminNote !== undefined) {
      push("admin_note", String(body.adminNote).slice(0, 2000));
      await addEvent(env, orderNo, "note", { message: String(body.adminNote).slice(0, 200), actor: "admin" });
    }
    if (sets.length) {
      push("updated_at", now());
      await env.DB.prepare(`UPDATE orders SET ${sets.join(", ")} WHERE order_no = ?${binds.length + 1}`).bind(...binds, orderNo).run();
    }
    return json({ status: "success", order: await getOrder(env, orderNo) });
  }
  return json({ status: "failed", reason: "Bulunamadı" }, 404);
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = cors(env, request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const withCors = (res) => { for (const [k, v] of Object.entries(headers)) res.headers.set(k, v); return res; };
    try {
      if (!env.DB) return json({ status: "failed", reason: "D1 veritabanı bağlı değil (wrangler.toml → d1_databases)" }, 500, headers);
      if (url.pathname === "/health") return json({ ok: true, test_mode: env.TEST_MODE === "1", paytr: Boolean(env.PAYTR_MERCHANT_ID), admin: Boolean(env.ADMIN_PASSWORD), carriers: CARRIERS }, 200, headers);
      if (url.pathname === "/orders" && request.method === "POST") return withCors(await handleCreateOrder(request, env));
      if (url.pathname === "/callback" && request.method === "POST") return handleCallback(request, env);
      if (url.pathname === "/track" && request.method === "GET") return withCors(await handleTrack(url, env));
      if (url.pathname.startsWith("/admin/")) return withCors(await handleAdmin(request, env, url));
      return json({ status: "failed", reason: "Bulunamadı" }, 404, headers);
    } catch (err) {
      return json({ status: "failed", reason: err instanceof Error ? err.message : "Sunucu hatası" }, 500, headers);
    }
  },
};

export default worker;
