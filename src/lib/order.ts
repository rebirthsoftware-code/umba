import { z } from "zod";
import type { CartItem } from "./types";
import { computeTotals, resolveLines } from "./cart";
import { formatPrice } from "./format";
import { site } from "./site";

export const paymentMethods = ["havale", "kapida", "kart"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalı").max(80),
    email: z.string().trim().email("Geçerli bir e-posta girin").max(120),
    phone: z
      .string()
      .trim()
      .regex(/^(\+90|0)?\s?5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, "Geçerli bir cep telefonu girin (05xx xxx xx xx)"),
    address: z.string().trim().min(10, "Adres en az 10 karakter olmalı").max(400),
    district: z.string().trim().min(2, "İlçe girin").max(60),
    city: z.string().trim().min(2, "İl seçin").max(60),
    postalCode: z.string().trim().max(10).optional().or(z.literal("")),
    note: z.string().trim().max(500).optional().or(z.literal("")),
    invoiceType: z.enum(["bireysel", "kurumsal"]),
    companyName: z.string().trim().max(120).optional().or(z.literal("")),
    taxOffice: z.string().trim().max(80).optional().or(z.literal("")),
    taxNo: z.string().trim().max(11).optional().or(z.literal("")),
    paymentMethod: z.enum(paymentMethods),
    acceptTerms: z.literal(true, { error: "Mesafeli satış sözleşmesini onaylamalısınız" }),
    acceptKvkk: z.literal(true, { error: "KVKK aydınlatma metnini onaylamalısınız" }),
    items: z
      .array(
        z.object({
          productSlug: z.string().min(1),
          variantId: z.string().min(1),
          quantity: z.number().int().min(1).max(99),
        }),
      )
      .min(1, "Sepetiniz boş"),
  })
  .superRefine((data, ctx) => {
    if (data.invoiceType === "kurumsal") {
      if (!data.companyName) ctx.addIssue({ code: "custom", path: ["companyName"], message: "Firma adı gerekli" });
      if (!data.taxOffice) ctx.addIssue({ code: "custom", path: ["taxOffice"], message: "Vergi dairesi gerekli" });
      if (!data.taxNo || data.taxNo.length < 10)
        ctx.addIssue({ code: "custom", path: ["taxNo"], message: "Vergi numarası 10–11 haneli olmalı" });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface OrderLine {
  productSlug: string;
  name: string;
  variantId: string;
  variantLabel: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderRecord {
  orderNo: string;
  createdAt: string;
  customer: Omit<CheckoutInput, "items" | "acceptTerms" | "acceptKvkk">;
  lines: OrderLine[];
  totals: {
    subtotal: number;
    shipping: number;
    codFee: number;
    total: number;
    itemCount: number;
  };
  paymentMethod: PaymentMethod;
  status: "beklemede";
  /** Form servisi üzerinden mağazaya otomatik iletildi mi? */
  delivered: boolean;
}

export const paymentLabels: Record<PaymentMethod, string> = {
  havale: "Havale / EFT",
  kapida: "Kapıda ödeme",
  kart: "Kredi kartı",
};

export function generateOrderNo(date = new Date()): string {
  const ymd = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");
  return `UMB-${ymd}-${rand}`;
}

/** Doğrulanmış form verisi + sepetten sipariş kaydı üretir. Fiyatlar katalogdan alınır. */
export function createOrder(data: CheckoutInput, items: CartItem[]): OrderRecord | { error: string } {
  const lines = resolveLines(items);
  if (lines.length === 0) return { error: "Sepetinizdeki ürünler bulunamadı" };
  const outOfStock = lines.find((l) => !l.variant.inStock);
  if (outOfStock) return { error: `${outOfStock.product.name} şu anda stokta değil` };
  if (data.paymentMethod === "kart" && !site.commerce.cardPaymentsEnabled) {
    return { error: "Kredi kartı ile ödeme henüz aktif değil. Lütfen Havale/EFT veya Kapıda Ödeme seçin." };
  }
  const totals = computeTotals(lines, data.paymentMethod);
  const { items: _items, acceptTerms: _t, acceptKvkk: _k, ...customer } = data;
  void _items;
  void _t;
  void _k;
  return {
    orderNo: generateOrderNo(),
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
    delivered: false,
  };
}

/** WhatsApp / e-posta için düz metin sipariş özeti. */
export function orderToText(order: OrderRecord): string {
  const c = order.customer;
  const lines = order.lines.map((l) => `• ${l.name} (${l.variantLabel}) x${l.quantity} = ${formatPrice(l.lineTotal)}`);
  const out = [
    `${site.name} – Sipariş ${order.orderNo}`,
    "",
    ...lines,
    "",
    `Ara toplam: ${formatPrice(order.totals.subtotal)}`,
    `Kargo: ${order.totals.shipping ? formatPrice(order.totals.shipping) : "Ücretsiz"}`,
    order.totals.codFee ? `Kapıda ödeme bedeli: ${formatPrice(order.totals.codFee)}` : null,
    `TOPLAM: ${formatPrice(order.totals.total)}`,
    `Ödeme: ${paymentLabels[order.paymentMethod]}`,
    "",
    `Ad Soyad: ${c.fullName}`,
    `Telefon: ${c.phone}`,
    `E-posta: ${c.email}`,
    `Adres: ${c.address}, ${c.district} / ${c.city}${c.postalCode ? ` ${c.postalCode}` : ""}`,
    c.invoiceType === "kurumsal" ? `Fatura: ${c.companyName} – ${c.taxOffice} – VKN ${c.taxNo}` : "Fatura: Bireysel",
    c.note ? `Not: ${c.note}` : null,
  ];
  return out.filter((l): l is string => l !== null).join("\n");
}

/** Form servisine gönderilecek alanlar. */
export function orderToFormPayload(order: OrderRecord): Record<string, string | number> {
  const c = order.customer;
  return {
    subject: `Yeni sipariş ${order.orderNo} · ${formatPrice(order.totals.total)}`,
    from_name: c.fullName,
    orderNo: order.orderNo,
    name: c.fullName,
    email: c.email,
    phone: c.phone,
    total: order.totals.total,
    payment: paymentLabels[order.paymentMethod],
    message: orderToText(order),
    order_json: JSON.stringify(order),
  };
}

export const cities = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak",
];
