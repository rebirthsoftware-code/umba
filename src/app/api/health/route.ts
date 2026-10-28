import { dbConfigured } from "@/server/db";
import { paytrConfigured, paytrTestMode } from "@/server/paytr";
import { json } from "@/server/http";

export const dynamic = "force-dynamic";

export function GET() {
  return json({ ok: true, db: dbConfigured(), paytr: paytrConfigured(), test_mode: paytrTestMode(), admin: Boolean(process.env.ADMIN_PASSWORD) });
}
