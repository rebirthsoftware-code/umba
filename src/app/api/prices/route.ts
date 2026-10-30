import { NextResponse } from "next/server";
import { loadPriceOverrides } from "@/server/prices";

export const dynamic = "force-dynamic";

/** Mağaza için güncel fiyat tablosu (SKU → ₺). Kısa süre CDN'de önbelleklenir. */
export async function GET() {
  const prices = await loadPriceOverrides();
  return NextResponse.json({ status: "success", prices }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" } });
}
