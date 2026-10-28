/* Sunucu modülleri TypeScript olduğu için bu test, çalışan bir sunucuya (BASE) karşı uçtan uca koşar:
   DATABASE_URL=file:./data/test.db ADMIN_PASSWORD=admin123 PAYTR_MERCHANT_ID=1 PAYTR_MERCHANT_KEY=k PAYTR_MERCHANT_SALT=s PAYTR_TOKEN_URL=http://localhost:3300/get-token npm start
   BASE=http://localhost:3000 npm run test:api */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

const BASE = process.env.BASE ?? "http://localhost:3000";
const ADMIN = process.env.ADMIN_PASSWORD ?? "admin123";
const KEY = process.env.PAYTR_MERCHANT_KEY ?? "k";
const SALT = process.env.PAYTR_MERCHANT_SALT ?? "s";
const customer = { fullName: "Test Müşteri", email: "test@example.com", phone: "0532 111 22 33", address: "Deneme Mah. Deneme Sk. No: 5", district: "Kadıköy", city: "İstanbul" };
const api = (p, init = {}, token) => fetch(`${BASE}/api${p}`, { ...init, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init.headers ?? {}) } }).then(async (r) => ({ code: r.status, body: await r.json().catch(() => ({})) }));

test("havale siparişi oluşur ve takip edilir", async () => {
  const r = await api("/orders", { method: "POST", body: JSON.stringify({ customer, paymentMethod: "havale", items: [{ productSlug: "karamel-surubu", variantId: "750ml", quantity: 2 }] }) });
  assert.equal(r.code, 200, JSON.stringify(r.body));
  assert.equal(r.body.orderStatus, "beklemede");
  assert.equal(r.body.totals.subtotal, 659.8);
  const t = await api(`/track?no=${r.body.orderNo}&phone=05321112233`);
  assert.equal(t.code, 200);
  assert.equal(t.body.order.status, "beklemede");
  const bad = await api(`/track?no=${r.body.orderNo}&phone=05000000000`);
  assert.equal(bad.code, 404);
});

test("kart siparişi: token, bildirim, onay, yönetim akışı", async () => {
  const r = await api("/orders", { method: "POST", body: JSON.stringify({ customer, paymentMethod: "kart", items: [{ productSlug: "mango-puresi", variantId: "1l", quantity: 1 }] }) });
  assert.equal(r.code, 200, JSON.stringify(r.body));
  assert.ok(r.body.token);
  const amt = String(Math.round(r.body.total * 100));
  const hash = createHmac("sha256", KEY).update(r.body.merchantOid + SALT + "success" + amt).digest("base64");
  const cb = await fetch(`${BASE}/api/paytr/callback`, { method: "POST", body: new URLSearchParams({ merchant_oid: r.body.merchantOid, status: "success", total_amount: amt, hash, test_mode: "1" }) });
  assert.equal(await cb.text(), "OK");
  const badCb = await fetch(`${BASE}/api/paytr/callback`, { method: "POST", body: new URLSearchParams({ merchant_oid: r.body.merchantOid, status: "success", total_amount: amt, hash: "x" }) });
  assert.equal(badCb.status, 400);

  assert.equal((await api("/admin/orders", {}, "yanlis")).code, 401);
  const got = await api(`/admin/orders/${r.body.orderNo}`, {}, ADMIN);
  assert.equal(got.body.order.status, "onaylandi");
  assert.equal(got.body.order.paymentStatus, "odendi");

  const upd = await api(`/admin/orders/${r.body.orderNo}`, { method: "PATCH", body: JSON.stringify({ carrier: "aras", trackingNo: "ABC123" }) }, ADMIN);
  assert.equal(upd.body.order.status, "kargolandi");
  assert.match(upd.body.order.trackingUrl, /araskargo.*ABC123/);
  const list = await api("/admin/orders?status=kargolandi", {}, ADMIN);
  assert.ok(list.body.orders.some((o) => o.orderNo === r.body.orderNo));
  const st = await api("/admin/stats", {}, ADMIN);
  assert.ok(st.body.today.n >= 1);
});
