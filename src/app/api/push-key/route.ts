import { pushPublicKey } from "@/server/push";
import { json } from "@/server/http";

export const dynamic = "force-dynamic";

/** Web Push public key'i (gizli değildir); yönetim paneli abonelik için kullanır. */
export function GET() {
  return json({ status: "success", key: pushPublicKey() });
}
