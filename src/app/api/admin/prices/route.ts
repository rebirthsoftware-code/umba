import { revalidatePath } from "next/cache";
import { listPrices, savePrices } from "@/server/prices";
import { fail, guard, isAdmin, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => json({ status: "success", rows: await listPrices() }));
}

export async function PUT(req: Request) {
  if (!isAdmin(req)) return fail("Yetkisiz", 401);
  return guard(async () => {
    const body = (await req.json().catch(() => null)) as { items?: { sku: string; price: number | null }[] } | null;
    if (!body || !Array.isArray(body.items) || body.items.length === 0) return fail("Geçersiz istek");
    if (body.items.length > 2000) return fail("Çok fazla kayıt");
    const result = await savePrices(body.items);
    // Statik üretilen mağaza sayfaları (ürün, kategori, ana sayfa) yeni fiyatla tekrar üretilsin
    revalidatePath("/", "layout");
    return json({ status: "success", ...result, rows: await listPrices() });
  });
}
