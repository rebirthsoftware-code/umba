import { fail, json } from "@/server/http";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_PASSWORD) return fail("ADMIN_PASSWORD tanımlı değil (Vercel → Environment Variables)", 500);
  if (body.password !== process.env.ADMIN_PASSWORD) return fail("Şifre hatalı", 401);
  return json({ status: "success" });
}
