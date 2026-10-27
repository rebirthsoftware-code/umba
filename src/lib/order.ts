import { z } from "zod";

export const paymentMethods = ["havale", "kapida", "kart"] as const;

export const checkoutSchema = z.object({
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
}).superRefine((data, ctx) => {
  if (data.invoiceType === "kurumsal") {
    if (!data.companyName) ctx.addIssue({ code: "custom", path: ["companyName"], message: "Firma adı gerekli" });
    if (!data.taxOffice) ctx.addIssue({ code: "custom", path: ["taxOffice"], message: "Vergi dairesi gerekli" });
    if (!data.taxNo || data.taxNo.length < 10)
      ctx.addIssue({ code: "custom", path: ["taxNo"], message: "Vergi numarası 10–11 haneli olmalı" });
  }
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export interface OrderRecord {
  orderNo: string;
  createdAt: string;
  customer: Omit<CheckoutInput, "items" | "acceptTerms" | "acceptKvkk">;
  lines: {
    productSlug: string;
    name: string;
    variantId: string;
    variantLabel: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  totals: {
    subtotal: number;
    shipping: number;
    codFee: number;
    total: number;
    itemCount: number;
  };
  paymentMethod: (typeof paymentMethods)[number];
  status: "beklemede";
}

export const paymentLabels: Record<(typeof paymentMethods)[number], string> = {
  havale: "Havale / EFT",
  kapida: "Kapıda ödeme",
  kart: "Kredi kartı",
};

export const cities = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya","Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik","Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum","Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir","Gaziantep","Giresun","Gümüşhane","Hakkâri","Hatay","Iğdır","Isparta","İstanbul","İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kırıkkale","Kırklareli","Kırşehir","Kilis","Kocaeli","Konya","Kütahya","Malatya","Manisa","Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye","Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak","Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak",
];
