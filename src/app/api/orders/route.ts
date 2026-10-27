import { NextResponse } from "next/server";
import { checkoutSchema, type OrderRecord } from "@/lib/order";
import { resolveLines, computeTotals } from "@/lib/cart";
import { sendOrderMails } from "@/lib/mailer";
import { saveJson } from "@/lib/storage";
import { site } from "@/lib/site";

function orderNumber(): string {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `UMB-${ymd}-${rand}`;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Geçersiz istek" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, error: "Form hatalı", fieldErrors }, { status: 422 });
  }

  const data = parsed.data;

  if (data.paymentMethod === "kart" && !site.commerce.cardPaymentsEnabled) {
    return NextResponse.json(
      { ok: false, error: "Kredi kartı ile ödeme henüz aktif değil. Lütfen Havale/EFT veya Kapıda Ödeme seçin." },
      { status: 400 },
    );
  }

  // Fiyatlar istemciden değil, katalogdan hesaplanır.
  const lines = resolveLines(data.items);
  if (lines.length === 0) {
    return NextResponse.json({ ok: false, error: "Sepetinizdeki ürünler bulunamadı" }, { status: 400 });
  }
  const outOfStock = lines.find((l) => !l.variant.inStock);
  if (outOfStock) {
    return NextResponse.json(
      { ok: false, error: `${outOfStock.product.name} şu anda stokta değil` },
      { status: 409 },
    );
  }
  const totals = computeTotals(lines, data.paymentMethod);

  const { items: _items, acceptTerms: _t, acceptKvkk: _k, ...customer } = data;
  void _items;
  void _t;
  void _k;

  const order: OrderRecord = {
    orderNo: orderNumber(),
    createdAt: new Date().toISOString(),
    customer,
    lines: lines.map((l) => ({
      productSlug: l.product.slug,
      name: l.product.name,
      variantId: l.variant.id,
      variantLabel: l.variant.label,
      sku: l.variant.sku,
      unitPrice: l.variant.price,
      quantity: l.quantity,
      lineTotal: l.lineTotal,
    })),
    totals: {
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      codFee: totals.codFee,
      total: totals.total,
      itemCount: totals.itemCount,
    },
    paymentMethod: data.paymentMethod,
    status: "beklemede",
  };

  const [saved, mailed] = await Promise.all([saveJson("orders", order.orderNo, order), sendOrderMails(order)]);
  console.info(`[order] ${order.orderNo} toplam=${order.totals.total} kayıt=${saved} mail=${JSON.stringify(mailed)}`);

  return NextResponse.json({ ok: true, order });
}
