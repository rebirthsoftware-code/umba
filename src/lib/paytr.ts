import { site } from "./site";

/**
 * PayTR iFrame API için token, statik sitede üretilemez; merchant anahtarları
 * gizli kalmalıdır. Token, sipariş API'si (api/worker.js → POST /orders) tarafından
 * sipariş kaydıyla birlikte üretilir. Bkz. README → "Kart ile ödeme (PayTR)".
 */
export function paytrEnabled(): boolean {
  return Boolean(site.api.url);
}

export function paytrIframeUrl(token: string): string {
  return `https://www.paytr.com/odeme/guvenli/${token}`;
}
