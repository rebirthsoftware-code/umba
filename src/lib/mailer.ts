import "server-only";
import type { OrderRecord } from "./order";
import { site } from "./site";
import { formatPrice } from "./format";
import { paymentLabels } from "./order";

/**
 * SMTP ayarları .env ile verilirse e-posta gönderir, verilmezse sessizce atlar.
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, ORDER_NOTIFY_EMAIL
 */
export function mailEnabled(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function send(to: string, subject: string, html: string, text: string) {
  if (!mailEnabled()) return false;
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? `${site.name} <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
  return true;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

export function orderHtml(order: OrderRecord): string {
  const rows = order.lines
    .map(
      (l) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(l.name)}<br><small>${escapeHtml(l.variantLabel)} · ${escapeHtml(l.sku)}</small></td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${l.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(l.lineTotal)}</td></tr>`,
    )
    .join("");
  const c = order.customer;
  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#2b1b12">
    <h2 style="font-weight:600">Sipariş ${order.orderNo}</h2>
    <p>Merhaba ${escapeHtml(c.fullName)}, siparişinizi aldık. Ödeme yöntemi: <strong>${paymentLabels[order.paymentMethod]}</strong>.</p>
    ${
      order.paymentMethod === "havale"
        ? `<div style="background:#f8f1e7;padding:12px 16px;border-radius:12px"><strong>Havale / EFT bilgileri</strong><br>${escapeHtml(site.bank.bankName)}<br>${escapeHtml(site.bank.holder)}<br>IBAN: ${escapeHtml(site.bank.iban)}<br>Açıklama: <strong>${order.orderNo}</strong></div>`
        : ""
    }
    <table style="width:100%;border-collapse:collapse;margin-top:16px">
      <thead><tr><th style="text-align:left;padding:8px">Ürün</th><th style="padding:8px">Adet</th><th style="text-align:right;padding:8px">Tutar</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right">Ara toplam: ${formatPrice(order.totals.subtotal)}<br>Kargo: ${order.totals.shipping ? formatPrice(order.totals.shipping) : "Ücretsiz"}${order.totals.codFee ? `<br>Kapıda ödeme: ${formatPrice(order.totals.codFee)}` : ""}<br><strong>Toplam: ${formatPrice(order.totals.total)}</strong></p>
    <h3>Teslimat adresi</h3>
    <p>${escapeHtml(c.address)}<br>${escapeHtml(c.district)} / ${escapeHtml(c.city)} ${escapeHtml(c.postalCode ?? "")}<br>${escapeHtml(c.phone)}</p>
    ${c.invoiceType === "kurumsal" ? `<p><strong>Fatura:</strong> ${escapeHtml(c.companyName ?? "")} · ${escapeHtml(c.taxOffice ?? "")} · ${escapeHtml(c.taxNo ?? "")}</p>` : ""}
    ${c.note ? `<p><strong>Not:</strong> ${escapeHtml(c.note)}</p>` : ""}
    <p style="color:#6e4f3a;font-size:12px">${escapeHtml(site.legal.companyName)} · ${escapeHtml(site.contact.phone)} · ${escapeHtml(site.contact.email)}</p>
  </div>`;
}

export function orderText(order: OrderRecord): string {
  const lines = order.lines.map((l) => `- ${l.name} (${l.variantLabel}) x${l.quantity}: ${formatPrice(l.lineTotal)}`).join("\n");
  return `Sipariş ${order.orderNo}\n\n${lines}\n\nToplam: ${formatPrice(order.totals.total)}\nÖdeme: ${paymentLabels[order.paymentMethod]}\n\nTeslimat: ${order.customer.address}, ${order.customer.district}/${order.customer.city}`;
}

export async function sendOrderMails(order: OrderRecord) {
  const html = orderHtml(order);
  const text = orderText(order);
  const results = { customer: false, merchant: false };
  try {
    results.customer = await send(order.customer.email, `${site.name} · Siparişiniz alındı (${order.orderNo})`, html, text);
  } catch (err) {
    console.error("[mail] müşteri e-postası gönderilemedi", err);
  }
  const notify = process.env.ORDER_NOTIFY_EMAIL ?? site.contact.email;
  try {
    results.merchant = await send(notify, `Yeni sipariş ${order.orderNo} · ${formatPrice(order.totals.total)}`, html, text);
  } catch (err) {
    console.error("[mail] mağaza e-postası gönderilemedi", err);
  }
  return results;
}

export async function sendPlainMail(subject: string, body: string) {
  const to = process.env.ORDER_NOTIFY_EMAIL ?? site.contact.email;
  try {
    return await send(to, subject, `<pre style="font-family:Arial,sans-serif;white-space:pre-wrap">${escapeHtml(body)}</pre>`, body);
  } catch (err) {
    console.error("[mail] gönderilemedi", err);
    return false;
  }
}
