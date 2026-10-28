import { dbConfigured } from "@/server/db";
import { paymentDemoMode, paytrConfigured, paytrTestMode } from "@/server/paytr";
import { pushConfigured } from "@/server/push";
import { json } from "@/server/http";

export const dynamic = "force-dynamic";

export function GET() {
  return json({ ok: true, db: dbConfigured(), paytr: paytrConfigured(), test_mode: paytrTestMode(), demo_payment: paymentDemoMode(), admin: Boolean(process.env.ADMIN_PASSWORD), push: pushConfigured() });
}
