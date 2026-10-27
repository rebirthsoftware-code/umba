import type { OrderRecord } from "./order";
import { site } from "./site";

/**
 * PayTR iFrame API için token, statik sitede üretilemez; merchant anahtarları
 * gizli kalmalıdır. Bu yüzden token, `paytr-worker/` altındaki küçük sunucu
 * (Cloudflare Worker) tarafından üretilir ve adresi NEXT_PUBLIC_PAYTR_TOKEN_ENDPOINT
 * ile verilir. Bkz. README → "Kart ile ödeme (PayTR)".
 */
export interface PaytrTokenResponse {
  status: "success" | "failed";
  token?: string;
  merchant_oid?: string;
  total?: number;
  reason?: string;
}

export function paytrEnabled(): boolean {
  return Boolean(site.paytr.tokenEndpoint);
}

export function paytrIframeUrl(token: string): string {
  return `https://www.paytr.com/odeme/guvenli/${token}`;
}

export async function requestPaytrToken(order: OrderRecord): Promise<PaytrTokenResponse> {
  if (!site.paytr.tokenEndpoint) return { status: "failed", reason: "PayTR yapılandırılmamış" };
  try {
    const res = await fetch(site.paytr.tokenEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        orderNo: order.orderNo,
        customer: order.customer,
        items: order.lines.map((l) => ({ productSlug: l.productSlug, variantId: l.variantId, quantity: l.quantity })),
        paymentMethod: order.paymentMethod,
      }),
    });
    const json = (await res.json()) as PaytrTokenResponse;
    if (!res.ok || json.status !== "success" || !json.token) {
      return { status: "failed", reason: json.reason ?? "Ödeme başlatılamadı" };
    }
    return json;
  } catch {
    return { status: "failed", reason: "Ödeme sunucusuna ulaşılamadı" };
  }
}
