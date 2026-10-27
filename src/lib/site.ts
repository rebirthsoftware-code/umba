/**
 * Site genel ayarları.
 * Buradaki değerlerin çoğu ortam değişkenleri ile (.env) ezilebilir.
 * Bkz. README.md → "Yapılandırma".
 */
export const site = {
  name: "Umba Coffee",
  shortName: "Umba",
  tagline: "Barınızın lezzet ortağı",
  description:
    "Umba Coffee; kafeler, oteller ve evler için şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri üretir. Türkiye'nin her yerine hızlı teslimat.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://umbacoffee.com.tr",
  locale: "tr_TR",
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE ?? "+90 (850) 000 00 00",
    phoneHref: (process.env.NEXT_PUBLIC_PHONE ?? "+908500000000").replace(/[^\d+]/g, ""),
    whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "905000000000").replace(/\D/g, ""),
    email: process.env.NEXT_PUBLIC_EMAIL ?? "info@umbacoffee.com.tr",
    address:
      process.env.NEXT_PUBLIC_ADDRESS ??
      "Organize Sanayi Bölgesi, 1. Cadde No: 1, İstanbul / Türkiye",
    workingHours: "Hafta içi 09:00 – 18:00",
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "https://instagram.com/umbacoffee",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK ?? "https://facebook.com/umbacoffee",
    youtube: process.env.NEXT_PUBLIC_YOUTUBE ?? "",
  },
  legal: {
    companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Umba Gıda Sanayi ve Ticaret Ltd. Şti.",
    mersis: process.env.NEXT_PUBLIC_MERSIS ?? "0000000000000000",
    taxOffice: process.env.NEXT_PUBLIC_TAX_OFFICE ?? "—",
    taxNo: process.env.NEXT_PUBLIC_TAX_NO ?? "—",
  },
  bank: {
    holder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? "Umba Gıda Sanayi ve Ticaret Ltd. Şti.",
    bankName: process.env.NEXT_PUBLIC_BANK_NAME ?? "Banka Adı",
    iban: process.env.NEXT_PUBLIC_IBAN ?? "TR00 0000 0000 0000 0000 0000 00",
  },
  commerce: {
    currency: "TRY",
    freeShippingThreshold: 1500,
    shippingFee: 89.9,
    codFee: 29.9, // kapıda ödeme hizmet bedeli
    deliveryEstimate: "1–3 iş günü",
    cardPaymentsEnabled: process.env.NEXT_PUBLIC_CARD_PAYMENTS === "true",
  },
} as const;

export type Site = typeof site;
