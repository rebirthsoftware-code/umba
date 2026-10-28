import { countSubscriptions, pushConfigured, removeSubscription, saveSubscription, sendPushToAdmins } from "@/server/push";
import { fail, guard, isAdmin, json } from "@/server/http";

export const dynamic = "force-dynamic";

/** GET: durum · POST: abonelik kaydet · DELETE: abonelik sil · PUT: test bildirimi */
export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => json({ status: "success", configured: pushConfigured(), devices: await countSubscriptions() }));
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    if (!pushConfigured()) return fail("Bildirim anahtarları tanımlı değil (WEB_PUSH_*)", 500);
    const body = await req.json().catch(() => ({}));
    if (!body.subscription?.endpoint) return fail("Abonelik eksik");
    await saveSubscription(body.subscription, body.label);
    return json({ status: "success", devices: await countSubscriptions() });
  });
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const body = await req.json().catch(() => ({}));
    if (body.endpoint) await removeSubscription(String(body.endpoint));
    return json({ status: "success", devices: await countSubscriptions() });
  });
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const sent = await sendPushToAdmins({ title: "Umba Yönetim", body: "Test bildirimi: her şey hazır.", url: "/yonetim", tag: "test" });
    return json({ status: "success", sent });
  });
}
