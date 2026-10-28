/**
 * Site genel ayarları.
 * Değerler ortam değişkenleri ile (.env.local veya GitHub Actions "Variables") ezilebilir.
 * Not: Next.js yalnızca `process.env.NEXT_PUBLIC_X` biçimindeki sabit erişimleri istemci paketine
 * gömer; bu yüzden değişkenler burada tek tek, dinamik anahtar kullanılmadan okunur.
 * Bkz. README.md → "Yapılandırma".
 */
const pick = (value: string | undefined, fallback: string): string => (value && value.trim() ? value.trim() : fallback);

const phone = pick(process.env.NEXT_PUBLIC_PHONE, "0507 684 49 93");
/** WhatsApp hatları: virgülle ayrılmış, ülke kodlu ve boşluksuz (905xxxxxxxxx). */
const whatsappNumbers = pick(process.env.NEXT_PUBLIC_WHATSAPP, "905076844993,905438999474")
  .split(",")
  .map((n) => n.replace(/\D/g, ""))
  .filter(Boolean);

export const site = {
  name: "Umba Coffee",
  shortName: "Umba",
  tagline: "Barınızın lezzet ortağı",
  description:
    "Umba Coffee; kafeler, oteller ve evler için şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri üretir. Türkiye'nin her yerine hızlı teslimat.",
  url: pick(process.env.NEXT_PUBLIC_SITE_URL, "https://umbagida.com").replace(/\/$/, ""),
  locale: "tr_TR",
  contact: {
    phone,
    phoneHref: phone.replace(/[^\d+]/g, ""),
    whatsapp: whatsappNumbers[0] ?? "",
    whatsappNumbers,
    email: pick(process.env.NEXT_PUBLIC_EMAIL, "info@umbagida.com"),
    address: pick(process.env.NEXT_PUBLIC_ADDRESS, "Karıt Sanayi Sitesi, 12. Sokak No: 45, Safranbolu / Karabük"),
    workingHours: "Hafta içi 09:00 – 18:00",
  },
  social: {
    instagram: pick(process.env.NEXT_PUBLIC_INSTAGRAM, "https://instagram.com/umbagida"),
    facebook: pick(process.env.NEXT_PUBLIC_FACEBOOK, "https://facebook.com/umbagida"),
  },
  legal: {
    companyName: pick(process.env.NEXT_PUBLIC_COMPANY_NAME, "Umba Gıda Sanayi ve Ticaret Ltd. Şti."),
    mersis: pick(process.env.NEXT_PUBLIC_MERSIS, "0000000000000000"),
  },
  bank: {
    holder: pick(process.env.NEXT_PUBLIC_BANK_HOLDER, "Umba Gıda Sanayi ve Ticaret Ltd. Şti."),
    bankName: pick(process.env.NEXT_PUBLIC_BANK_NAME, "Banka Adı"),
    iban: pick(process.env.NEXT_PUBLIC_IBAN, "TR00 0000 0000 0000 0000 0000 00"),
  },
  /**
   * Sipariş ve form gönderimleri için isteğe bağlı form servisi (Formspree, Web3Forms, Getform vb.).
   * Boş bırakılırsa siparişler WhatsApp / e-posta ile iletilir.
   */
  forms: {
    endpoint: pick(process.env.NEXT_PUBLIC_FORM_ENDPOINT, ""),
    accessKey: pick(process.env.NEXT_PUBLIC_FORM_ACCESS_KEY, ""),
  },
  /** Sipariş API'si aynı uygulamada (src/app/api). NEXT_PUBLIC_ORDERS_API=0 ile kapatılabilir. */
  api: {
    url: pick(process.env.NEXT_PUBLIC_ORDERS_API, "1") === "0" ? "" : "/api",
  },
  commerce: {
    currency: "TRY",
    freeShippingThreshold: 1500,
    shippingFee: 89.9,
    codFee: 29.9, // kapıda ödeme hizmet bedeli
    deliveryEstimate: "1–3 iş günü",
    cardPaymentsEnabled: pick(process.env.NEXT_PUBLIC_CARD_PAYMENTS, "1") !== "0",
  },
} as const;

export type Site = typeof site;
