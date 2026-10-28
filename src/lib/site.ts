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
  url: pick(process.env.NEXT_PUBLIC_SITE_URL, "https://umbacoffee.com.tr").replace(/\/$/, ""),
  locale: "tr_TR",
  contact: {
    phone,
    phoneHref: phone.replace(/[^\d+]/g, ""),
    whatsapp: whatsappNumbers[0] ?? "",
    whatsappNumbers,
    email: pick(process.env.NEXT_PUBLIC_EMAIL, "info@umbacoffee.com.tr"),
    address: pick(process.env.NEXT_PUBLIC_ADDRESS, "Organize Sanayi Bölgesi, 1. Cadde No: 1, İstanbul / Türkiye"),
    workingHours: "Hafta içi 09:00 – 18:00",
  },
  social: {
    instagram: pick(process.env.NEXT_PUBLIC_INSTAGRAM, "https://instagram.com/umbacoffee"),
    facebook: pick(process.env.NEXT_PUBLIC_FACEBOOK, "https://facebook.com/umbacoffee"),
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
  /** Sipariş API'si (Cloudflare Worker, bkz. api/): siparişler, PayTR, takip ve yönetim paneli. */
  api: {
    url: pick(process.env.NEXT_PUBLIC_API_URL, "").replace(/\/$/, ""),
  },
  commerce: {
    currency: "TRY",
    freeShippingThreshold: 1500,
    shippingFee: 89.9,
    codFee: 29.9, // kapıda ödeme hizmet bedeli
    deliveryEstimate: "1–3 iş günü",
    cardPaymentsEnabled: Boolean(pick(process.env.NEXT_PUBLIC_API_URL, "")),
  },
} as const;

export type Site = typeof site;
