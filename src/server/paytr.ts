import { createHmac } from "node:crypto";
import { site } from "@/lib/site";

/**
 * PayTR iFrame API (sunucu tarafı). Belgeler: https://dev.paytr.com/iframe-api
 * Ortam değişkenleri: PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY, PAYTR_MERCHANT_SALT, PAYTR_TEST_MODE ("1" | "0")
 */
const TOKEN_URL = "https://www.paytr.com/odeme/api/get-token";

export function paytrConfigured(): boolean {
  return Boolean(process.env.PAYTR_MERCHANT_ID && process.env.PAYTR_MERCHANT_KEY && process.env.PAYTR_MERCHANT_SALT);
}

/** PayTR anahtarları yokken (veya PAYMENT_DEMO=1) kart ödemesi sahte "demo" ekranıyla simüle edilir. */
export function paymentDemoMode(): boolean {
  return process.env.PAYMENT_DEMO === "1" || !paytrConfigured();
}

export function paytrTestMode(): boolean {
  return (process.env.PAYTR_TEST_MODE ?? "1") === "1";
}

export function hmacBase64(message: string, key: string): string {
  return createHmac("sha256", key).update(message).digest("base64");
}

const b64utf8 = (s: string) => Buffer.from(s, "utf8").toString("base64");

export interface PaytrTokenInput {
  orderNo: string;
  merchantOid: string;
  userIp: string;
  customer: { fullName: string; email: string; phone: string; address: string; district: string; city: string };
  lines: { name: string; unitPrice: number; quantity: number }[];
  shipping: number;
  total: number;
}

/** PayTR'den iframe token'ı alır; hata durumunda fırlatır. */
export async function getPaytrToken(input: PaytrTokenInput): Promise<string> {
  const merchantId = process.env.PAYTR_MERCHANT_ID!;
  const merchantKey = process.env.PAYTR_MERCHANT_KEY!;
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT!;
  const paymentAmount = String(Math.round(input.total * 100)); // kuruş
  const basket = b64utf8(
    JSON.stringify([
      ...input.lines.map((l) => [l.name, l.unitPrice.toFixed(2), l.quantity]),
      ...(input.shipping > 0 ? [["Kargo", input.shipping.toFixed(2), 1]] : []),
    ]),
  );
  const noInstallment = "0";
  const maxInstallment = "0";
  const currency = "TL";
  const testMode = paytrTestMode() ? "1" : "0";
  const email = input.customer.email.trim();

  const hashStr = `${merchantId}${input.userIp}${input.merchantOid}${email}${paymentAmount}${basket}${noInstallment}${maxInstallment}${currency}${testMode}`;
  const paytrToken = hmacBase64(hashStr + merchantSalt, merchantKey);

  const form = new URLSearchParams({
    merchant_id: merchantId,
    user_ip: input.userIp,
    merchant_oid: input.merchantOid,
    email,
    payment_amount: paymentAmount,
    paytr_token: paytrToken,
    user_basket: basket,
    debug_on: testMode,
    no_installment: noInstallment,
    max_installment: maxInstallment,
    user_name: input.customer.fullName.slice(0, 60),
    user_address: `${input.customer.address} ${input.customer.district}/${input.customer.city}`.slice(0, 400),
    user_phone: input.customer.phone.replace(/\s/g, "").slice(0, 20),
    merchant_ok_url: `${site.url}/odeme/basarili?no=${encodeURIComponent(input.orderNo)}`,
    merchant_fail_url: `${site.url}/odeme/basarisiz?no=${encodeURIComponent(input.orderNo)}`,
    timeout_limit: "30",
    currency,
    test_mode: testMode,
    lang: "tr",
  });
  const res = await fetch(process.env.PAYTR_TOKEN_URL ?? TOKEN_URL, { method: "POST", body: form });
  const data = (await res.json().catch(() => ({}))) as { status?: string; token?: string; reason?: string };
  if (data.status !== "success" || !data.token) throw new Error(data.reason ?? "PayTR token alınamadı");
  return data.token;
}

/** Bildirim imzasını doğrular. */
export function verifyCallbackHash(merchantOid: string, status: string, totalAmount: string, hash: string): boolean {
  const expected = hmacBase64(`${merchantOid}${process.env.PAYTR_MERCHANT_SALT}${status}${totalAmount}`, process.env.PAYTR_MERCHANT_KEY ?? "");
  return expected === hash;
}
