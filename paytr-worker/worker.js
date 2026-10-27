/**
 * Umba Coffee – PayTR iFrame API için küçük sunucu (Cloudflare Worker).
 *
 * Neden gerekli? Site statik (GitHub Pages) olduğu için merchant_key ve merchant_salt
 * tarayıcıya verilemez. Bu Worker:
 *   POST /token     → sepeti katalog fiyatlarıyla yeniden hesaplar, PayTR'den iframe token alır
 *   POST /callback  → PayTR bildirimini (ödeme sonucu) doğrular, "OK" döner, isteğe bağlı webhook'a iletir
 *   GET  /health    → sağlık kontrolü
 *
 * Ortam değişkenleri (wrangler.toml / wrangler secret):
 *   PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT  (PayTR mağaza paneli → Bilgi)
 *   SITE_URL          https://rebirthsoftware-code.github.io/umba  (sondaki / olmadan)
 *   ALLOWED_ORIGIN    https://rebirthsoftware-code.github.io
 *   TEST_MODE         "1" (test) | "0" (canlı)
 *   NOTIFY_WEBHOOK    (isteğe bağlı) başarılı ödemede sipariş JSON'unun POST edileceği adres (Formspree vb.)
 *   ORDERS            (isteğe bağlı) KV binding; siparişleri token aşamasında saklar, callback'te okur
 */

const PAYTR_TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...extra } });

function cors(env, request) {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = (env.ALLOWED_ORIGIN ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.length === 0 || allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin || "*" : allowed[0],
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
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
    lines.push({ name: item.name, unitPrice: item.price, quantity: qty, lineTotal: Math.round(item.price * qty * 100) / 100 });
  }
  const subtotal = Math.round(lines.reduce((s, l) => s + l.lineTotal, 0) * 100) / 100;
  const { freeShippingThreshold, shippingFee, codFee } = catalog.commerce;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const cod = paymentMethod === "kapida" ? codFee : 0;
  const total = Math.round((subtotal + shipping + cod) * 100) / 100;
  return { lines, subtotal, shipping, codFee: cod, total };
}

async function handleToken(request, env) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.items) || !body.customer) return json({ status: "failed", reason: "Geçersiz istek" }, 400);

  const c = body.customer;
  const email = String(c.email ?? "").trim();
  const orderNo = String(body.orderNo ?? "").trim();
  if (!/^[A-Z0-9-]{6,40}$/i.test(orderNo) || !email.includes("@")) return json({ status: "failed", reason: "Sipariş bilgileri eksik" }, 400);
  const merchantOid = orderNo.replace(/[^a-zA-Z0-9]/g, ""); // PayTR: yalnızca alfanümerik

  const catalog = await loadCatalog(env);
  const order = computeOrder(catalog, body.items, "kart");
  if (order.lines.length === 0 || order.total <= 0) return json({ status: "failed", reason: "Sepet boş veya ürünler stokta değil" }, 400);

  const paymentAmount = String(Math.round(order.total * 100)); // kuruş
  const userBasket = b64utf8(JSON.stringify(order.lines.map((l) => [l.name, l.unitPrice.toFixed(2), l.quantity])));
  if (order.shipping > 0) {
    // Kargo da sepete satır olarak eklenir ki toplam tutsun
  }
  const basketWithShipping = b64utf8(
    JSON.stringify([
      ...order.lines.map((l) => [l.name, l.unitPrice.toFixed(2), l.quantity]),
      ...(order.shipping > 0 ? [["Kargo", order.shipping.toFixed(2), 1]] : []),
    ]),
  );
  void userBasket;

  const userIp = request.headers.get("CF-Connecting-IP") ?? request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = "TL";
  const testMode = env.TEST_MODE === "1" ? "1" : "0";

  const hashStr = `${env.PAYTR_MERCHANT_ID}${userIp}${merchantOid}${email}${paymentAmount}${basketWithShipping}${noInstallment}${maxInstallment}${currency}${testMode}`;
  const paytrToken = await hmacBase64(hashStr + env.PAYTR_MERCHANT_SALT, env.PAYTR_MERCHANT_KEY);

  const form = new URLSearchParams({
    merchant_id: env.PAYTR_MERCHANT_ID,
    user_ip: userIp,
    merchant_oid: merchantOid,
    email,
    payment_amount: paymentAmount,
    paytr_token: paytrToken,
    user_basket: basketWithShipping,
    debug_on: testMode,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: String(c.fullName ?? "").slice(0, 60),
    user_address: `${c.address ?? ""} ${c.district ?? ""}/${c.city ?? ""}`.slice(0, 400),
    user_phone: String(c.phone ?? "").replace(/\s/g, "").slice(0, 20),
    merchant_ok_url: `${env.SITE_URL}/odeme/basarili/?no=${encodeURIComponent(orderNo)}`,
    merchant_fail_url: `${env.SITE_URL}/odeme/basarisiz/?no=${encodeURIComponent(orderNo)}`,
    timeout_limit: "30",
    currency,
    test_mode: testMode,
    lang: "tr",
  });

  const res = await fetch(PAYTR_TOKEN_URL, { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (data.status !== "success") return json({ status: "failed", reason: data.reason ?? "PayTR token alınamadı" }, 502);

  if (env.ORDERS) {
    await env.ORDERS.put(
      merchantOid,
      JSON.stringify({ orderNo, merchantOid, createdAt: new Date().toISOString(), customer: c, order, status: "odeme-bekliyor" }),
      { expirationTtl: 60 * 60 * 24 * 30 },
    );
  }
  return json({ status: "success", token: data.token, merchant_oid: merchantOid, total: order.total });
}

async function handleCallback(request, env) {
  const form = await request.formData();
  const merchantOid = form.get("merchant_oid") ?? "";
  const status = form.get("status") ?? "";
  const totalAmount = form.get("total_amount") ?? "";
  const hash = form.get("hash") ?? "";
  const expected = await hmacBase64(`${merchantOid}${env.PAYTR_MERCHANT_SALT}${status}${totalAmount}`, env.PAYTR_MERCHANT_KEY);
  if (hash !== expected) return new Response("PAYTR notification failed: bad hash", { status: 400 });

  let record = null;
  if (env.ORDERS) {
    const raw = await env.ORDERS.get(merchantOid);
    if (raw) {
      record = JSON.parse(raw);
      record.status = status === "success" ? "odendi" : "odeme-basarisiz";
      record.paidAmount = Number(totalAmount) / 100;
      record.failedReason = form.get("failed_reason_msg") ?? undefined;
      await env.ORDERS.put(merchantOid, JSON.stringify(record), { expirationTtl: 60 * 60 * 24 * 365 });
    }
  }
  if (env.NOTIFY_WEBHOOK) {
    const payload = {
      subject: status === "success" ? `Ödeme alındı · ${merchantOid} · ${(Number(totalAmount) / 100).toFixed(2)} TL` : `Ödeme başarısız · ${merchantOid}`,
      merchant_oid: merchantOid,
      status,
      total_amount: totalAmount,
      message: record ? JSON.stringify(record, null, 2) : `Sipariş ${merchantOid} – ${status} – ${totalAmount}`,
    };
    await fetch(env.NOTIFY_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) }).catch(() => {});
  }
  // PayTR bu yanıtı bekler; aksi hâlde bildirimi tekrar gönderir.
  return new Response("OK");
}

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = cors(env, request);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    try {
      if (url.pathname === "/health") return json({ ok: true, test_mode: env.TEST_MODE === "1" }, 200, headers);
      if (url.pathname === "/token" && request.method === "POST") {
        const res = await handleToken(request, env);
        for (const [k, v] of Object.entries(headers)) res.headers.set(k, v);
        return res;
      }
      if (url.pathname === "/callback" && request.method === "POST") return handleCallback(request, env);
      return json({ status: "failed", reason: "Bulunamadı" }, 404, headers);
    } catch (err) {
      return json({ status: "failed", reason: err instanceof Error ? err.message : "Sunucu hatası" }, 500, headers);
    }
  },
};

export default worker;
