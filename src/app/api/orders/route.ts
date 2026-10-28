import { createOrder } from "@/server/orders";
import { clientIp, fail, guard, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return guard(async () => {
    const body = await req.json().catch(() => null);
    if (!body || !Array.isArray(body.items) || !body.customer) return fail("Geçersiz istek");
    const res = await createOrder(body, clientIp(req));
    if (!res.ok) return json({ status: "failed", reason: res.reason, orderNo: res.orderNo }, res.status);
    return json({ status: "success", orderNo: res.orderNo, merchantOid: res.merchantOid, total: res.totals.total, totals: { subtotal: res.totals.subtotal, shipping: res.totals.shipping, codFee: res.totals.codFee, total: res.totals.total }, lines: res.totals.lines, token: res.token, orderStatus: res.orderStatus });
  });
}
