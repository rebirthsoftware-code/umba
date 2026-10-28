import { listOrders } from "@/server/orders";
import { fail, guard, isAdmin, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const url = new URL(req.url);
    const data = await listOrders({ status: url.searchParams.get("status"), q: url.searchParams.get("q"), page: Number(url.searchParams.get("page")) || 1 });
    return json({ status: "success", ...data });
  });
}
