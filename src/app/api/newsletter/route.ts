import { NextResponse } from "next/server";
import { z } from "zod";
import { appendLine } from "@/lib/storage";

const schema = z.object({ email: z.string().trim().email().max(120) });

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });
  await appendLine("newsletter.jsonl", JSON.stringify({ createdAt: new Date().toISOString(), email: parsed.data.email }));
  return NextResponse.json({ ok: true });
}
