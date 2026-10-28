import { stats } from "@/server/orders";
import { fail, guard, isAdmin, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => json({ status: "success", ...(await stats()) }));
}
