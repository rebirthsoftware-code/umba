import { completeDemoPayment } from "@/server/orders";
import { fail, guard, json } from "@/server/http";

export const dynamic = "force-dynamic";

/** Demo kart ödemesi (PayTR yapılandırılmadığında). Gerçek tahsilat yapılmaz. */
export async function POST(req: Request) {
  return guard(async () => {
    const body = await req.json().catch(() => ({}));
    if (!body.orderNo) return fail("Sipariş numarası gerekli");
    const res = await completeDemoPayment(String(body.orderNo), body.approve !== false);
    return res.ok ? json({ status: "success" }) : fail(res.reason, res.status);
  });
}
