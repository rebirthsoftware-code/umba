import { NextResponse } from "next/server";
import { z } from "zod";
import { sendPlainMail } from "@/lib/mailer";
import { appendLine } from "@/lib/storage";

const schema = z.object({
  type: z.enum(["iletisim", "kurumsal"]).default("iletisim"),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  businessType: z.string().trim().max(60).optional().or(z.literal("")),
  monthlyVolume: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Lütfen zorunlu alanları doldurun" }, { status: 422 });
  }
  const d = parsed.data;
  const createdAt = new Date().toISOString();
  const text = [
    `Tür: ${d.type}`,
    `Ad: ${d.name}`,
    `E-posta: ${d.email}`,
    d.phone && `Telefon: ${d.phone}`,
    d.company && `Firma: ${d.company}`,
    d.city && `Şehir: ${d.city}`,
    d.businessType && `İşletme türü: ${d.businessType}`,
    d.monthlyVolume && `Aylık tüketim: ${d.monthlyVolume}`,
    "",
    d.message,
  ]
    .filter(Boolean)
    .join("\n");

  await Promise.all([
    appendLine("messages.jsonl", JSON.stringify({ createdAt, ...d })),
    sendPlainMail(d.type === "kurumsal" ? `Kurumsal teklif talebi · ${d.company || d.name}` : `İletişim formu · ${d.name}`, text),
  ]);

  return NextResponse.json({ ok: true });
}
