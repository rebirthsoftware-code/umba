import webpush, { type PushSubscription } from "web-push";
import { db } from "./db";

/**
 * Yönetici cihazlarına anlık bildirim (Web Push).
 * Ortam değişkenleri: NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY, WEB_PUSH_PRIVATE_KEY, WEB_PUSH_SUBJECT (mailto:…)
 * Anahtar üretmek için: npx web-push generate-vapid-keys
 */
export function pushConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY && process.env.WEB_PUSH_PRIVATE_KEY);
}

function configure() {
  webpush.setVapidDetails(process.env.WEB_PUSH_SUBJECT || "mailto:info@umbagida.com", process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!, process.env.WEB_PUSH_PRIVATE_KEY!);
}

export async function saveSubscription(sub: PushSubscription, label?: string) {
  const c = await db();
  await c.execute({
    sql: "INSERT INTO push_subscriptions (endpoint, subscription_json, label, created_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(endpoint) DO UPDATE SET subscription_json = ?2, label = ?3",
    args: [sub.endpoint, JSON.stringify(sub), label ?? null, new Date().toISOString()],
  });
}

export async function removeSubscription(endpoint: string) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM push_subscriptions WHERE endpoint = ?1", args: [endpoint] });
}

export async function countSubscriptions(): Promise<number> {
  const c = await db();
  return Number((await c.execute("SELECT COUNT(*) AS n FROM push_subscriptions")).rows[0]?.n ?? 0);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/** Tüm kayıtlı yönetici cihazlarına gönderir; geçersiz abonelikleri siler. Hata fırlatmaz. */
export async function sendPushToAdmins(payload: PushPayload): Promise<number> {
  if (!pushConfigured()) return 0;
  try {
    configure();
    const c = await db();
    const rows = (await c.execute("SELECT endpoint, subscription_json FROM push_subscriptions")).rows;
    let sent = 0;
    await Promise.all(
      rows.map(async (r) => {
        const sub = JSON.parse(String(r.subscription_json)) as PushSubscription;
        try {
          await webpush.sendNotification(sub, JSON.stringify(payload), { TTL: 60 * 60 * 24 });
          sent++;
        } catch (err) {
          const code = (err as { statusCode?: number }).statusCode;
          if (code === 404 || code === 410) await removeSubscription(String(r.endpoint));
        }
      }),
    );
    return sent;
  } catch {
    return 0;
  }
}
