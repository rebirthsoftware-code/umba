import { getOrder, updateOrder } from "@/server/orders";
import { fail, guard, isAdmin, json } from "@/server/http";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ no: string }> };

export async function GET(req: Request, ctx: Ctx) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const { no } = await ctx.params;
    const order = await getOrder(no.toUpperCase());
    return order ? json({ status: "success", order }) : fail("Sipariş bulunamadı", 404);
  });
}

export async function PATCH(req: Request, ctx: Ctx) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const { no } = await ctx.params;
    const body = await req.json().catch(() => ({}));
    const res = await updateOrder(no.toUpperCase(), body);
    return res.ok ? json({ status: "success", order: res.order }) : fail(res.reason, res.status);
  });
}
