import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartToast } from "@/components/cart/CartToast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { StoreChrome } from "@/components/layout/Chrome";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { PriceProvider } from "@/components/PriceSync";
import { loadPriceOverrides } from "@/server/prices";
import { getCommerceSettings } from "@/lib/prices";
import { InstallBanner } from "@/components/pwa/InstallBanner";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  await loadPriceOverrides();
  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} | Kahve Şurubu, Meyve Püresi, Dekor Sos, Espresso ve Bitki Çayı`,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    keywords: [
      "kahve şurubu",
      "aromalı şurup",
      "bar şurubu",
      "latte şurubu",
      "soda şurubu",
      "karamel şurubu",
      "vanilya şurubu",
      "dekor sos",
      "kahve sosu",
      "meyve püresi",
      "smoothie püresi",
      "frozen püresi",
      "espresso çekirdek kahve",
      "arabica kahve",
      "sıcak çikolata tozu",
      "milkshake tozu",
      "salep tozu",
      "salep",
      "bitki çayı",
      "kuşburnu çayı",
      "kafe malzemeleri",
      "barista ürünleri",
      "horeca tedarik",
      "toptan kahve şurubu",
      "umba coffee",
      "umba gıda",
      "safranbolu",
    ],
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      url: site.url,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: "/" },
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      title: site.shortName,
      statusBarStyle: "default",
    },
    applicationName: site.name,
  };
}

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icons/icon-512.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Karıt Sanayi Sitesi, 12. Sokak No: 45",
    addressLocality: "Safranbolu",
    addressRegion: "Karabük",
    addressCountry: "TR",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: site.contact.phoneHref,
      contactType: "customer service",
      areaServed: "TR",
      availableLanguage: ["Turkish"],
    },
  ],
  sameAs: [site.social.instagram, site.social.facebook].filter(Boolean),
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const prices = await loadPriceOverrides();
  const commerce = getCommerceSettings();
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-espresso-900 focus:px-4 focus:py-2 focus:text-cream-50"
        >
          İçeriğe atla
        </a>
        <PriceProvider initial={{ prices, commerce }}>
          <CartProvider>
            <StoreChrome>
              <Header />
            </StoreChrome>
            <main id="icerik" className="flex-1">
              {children}
            </main>
            <StoreChrome>
              <Footer />
              <CartDrawer />
              <CartToast />
              <WhatsAppButton />
              <InstallBanner />
            </StoreChrome>
            <PwaRegister />
          </CartProvider>
        </PriceProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd()),
          }}
        />
      </body>
    </html>
  );
}
