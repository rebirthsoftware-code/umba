import { trackOrder } from "@/server/orders";
import { fail, guard, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return guard(async () => {
    const url = new URL(req.url);
    const no = url.searchParams.get("no") ?? "";
    const phone = url.searchParams.get("phone") ?? "";
    if (!no.trim() || phone.replace(/\D/g, "").length < 10) return fail("Sipariş numarası ve telefon gerekli");
    const order = await trackOrder(no, phone);
    if (!order) return fail("Bu bilgilerle eşleşen sipariş bulunamadı", 404);
    return json({ status: "success", order });
  });
}
