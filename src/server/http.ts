import { NextResponse } from "next/server";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (reason: string, status = 400) => NextResponse.json({ status: "failed", reason }, { status });

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "127.0.0.1";
}

export function isAdmin(req: Request): boolean {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return Boolean(process.env.ADMIN_PASSWORD) && token === process.env.ADMIN_PASSWORD;
}

/** Beklenmeyen hataları JSON'a çevirir. */
export async function guard(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Sunucu hatası", 500);
  }
}
