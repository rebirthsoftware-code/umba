/**
 * Site genel ayarları.
 * Buradaki değerlerin çoğu ortam değişkenleri ile (.env.local veya GitHub Actions "Variables") ezilebilir.
 * Bkz. README.md → "Yapılandırma".
 */
const env = (key: string, fallback: string): string => {
  const v = process.env[key];
  return v && v.trim() ? v.trim() : fallback;
};

export const site = {
  name: "Umba Coffee",
  shortName: "Umba",
  tagline: "Barınızın lezzet ortağı",
  description:
    "Umba Coffee; kafeler, oteller ve evler için şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri üretir. Türkiye'nin her yerine hızlı teslimat.",
  url: env("NEXT_PUBLIC_SITE_URL", "https://umbacoffee.com.tr").replace(/\/$/, ""),
  locale: "tr_TR",
  contact: {
    phone: env("NEXT_PUBLIC_PHONE", "+90 (850) 000 00 00"),
    phoneHref: env("NEXT_PUBLIC_PHONE", "+908500000000").replace(/[^\d+]/g, ""),
    whatsapp: env("NEXT_PUBLIC_WHATSAPP", "905000000000").replace(/\D/g, ""),
    email: env("NEXT_PUBLIC_EMAIL", "info@umbacoffee.com.tr"),
    address: env("NEXT_PUBLIC_ADDRESS", "Organize Sanayi Bölgesi, 1. Cadde No: 1, İstanbul / Türkiye"),
    workingHours: "Hafta içi 09:00 – 18:00",
  },
  social: {
    instagram: env("NEXT_PUBLIC_INSTAGRAM", "https://instagram.com/umbacoffee"),
    facebook: env("NEXT_PUBLIC_FACEBOOK", "https://facebook.com/umbacoffee"),
  },
  legal: {
    companyName: env("NEXT_PUBLIC_COMPANY_NAME", "Umba Gıda Sanayi ve Ticaret Ltd. Şti."),
    mersis: env("NEXT_PUBLIC_MERSIS", "0000000000000000"),
  },
  bank: {
    holder: env("NEXT_PUBLIC_BANK_HOLDER", "Umba Gıda Sanayi ve Ticaret Ltd. Şti."),
    bankName: env("NEXT_PUBLIC_BANK_NAME", "Banka Adı"),
    iban: env("NEXT_PUBLIC_IBAN", "TR00 0000 0000 0000 0000 0000 00"),
  },
  /**
   * Sipariş ve form gönderimleri için isteğe bağlı form servisi (Formspree, Web3Forms, Getform vb.).
   * Boş bırakılırsa siparişler WhatsApp / e-posta ile iletilir.
   */
  forms: {
    endpoint: env("NEXT_PUBLIC_FORM_ENDPOINT", ""),
    accessKey: env("NEXT_PUBLIC_FORM_ACCESS_KEY", ""),
  },
  commerce: {
    currency: "TRY",
    freeShippingThreshold: 1500,
    shippingFee: 89.9,
    codFee: 29.9, // kapıda ödeme hizmet bedeli
    deliveryEstimate: "1–3 iş günü",
    cardPaymentsEnabled: env("NEXT_PUBLIC_CARD_PAYMENTS", "false") === "true",
  },
} as const;

export type Site = typeof site;
