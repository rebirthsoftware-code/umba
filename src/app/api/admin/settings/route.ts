import { revalidatePath } from "next/cache";
import { readCommerceSettings, saveCommerceSettings } from "@/server/prices";
import { fail, guard, isAdmin, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => json({ status: "success", commerce: await readCommerceSettings() }));
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const body = (await req.json().catch(() => null)) as { shippingFee?: unknown; freeShippingThreshold?: unknown } | null;
    if (!body) return fail("Geçersiz istek");
    const commerce = await saveCommerceSettings(body);
    revalidatePath("/", "layout");
    return json({ status: "success", commerce });
  });
}
