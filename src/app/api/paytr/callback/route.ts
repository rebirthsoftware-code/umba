import { applyPaymentCallback } from "@/server/orders";
import { verifyCallbackHash } from "@/server/paytr";

export const dynamic = "force-dynamic";

/** PayTR ödeme bildirimi: yalnızca düz metin "OK" döner; aksi hâlde PayTR tekrar dener. */
export async function POST(req: Request) {
  const form = await req.formData();
  const merchantOid = String(form.get("merchant_oid") ?? "");
  const status = String(form.get("status") ?? "");
  const totalAmount = String(form.get("total_amount") ?? "");
  const hash = String(form.get("hash") ?? "");
  if (!verifyCallbackHash(merchantOid, status, totalAmount, hash)) return new Response("PAYTR notification failed: bad hash", { status: 400 });
  try {
    await applyPaymentCallback(merchantOid, status, totalAmount, { failedReason: form.get("failed_reason_msg")?.toString(), testMode: form.get("test_mode") === "1" });
  } catch {
    return new Response("PAYTR notification failed: db", { status: 500 });
  }
  return new Response("OK");
}
