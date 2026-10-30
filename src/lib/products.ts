import type { Product, ProductTag, Spec, Variant } from "./types";

/* -------------------------------------------------------------------------- */
/*  Yardımcı kurucular — her kategori için standart varyant ve özellikler      */
/* -------------------------------------------------------------------------- */

type Base = {
  slug: string;
  name: string;
  color: string;
  color2?: string;
  short: string;
  description: string;
  tags?: ProductTag[];
  image?: string;
  imageHover?: string;
  imageFit?: "cover" | "contain";
  imageCutout?: string;
  highlights?: string[];
  usage?: string[];
  specs?: Spec[];
  variants?: Variant[];
};

const v = (
  id: string,
  label: string,
  price: number,
  sku: string,
  extra: Partial<Variant> = {},
): Variant => ({ id, label, price, sku, inStock: true, ...extra });

function syrup(b: Base): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "suruplar",
    art: "bottle",
    highlights: [
      "Premium kalite, doğal aroma",
      "Sıcak ve soğuk içeceklerde çökmeden karışır",
      "Pompa ile porsiyon kontrolü (1 pompa ≈ 10 ml)",
      "Dengeli tatlılık, baskın olmayan aroma",
    ],
    usage: [
      "Latte / Cappuccino: 20–30 ml",
      "Soğuk kahve ve frappe: 30 ml",
      "Soda ve limonata: 30–40 ml",
      "Kokteyl: 15–20 ml",
    ],
    specs: [
      { label: "Hacim", value: "750 ml PET şişe" },
      { label: "Raf ömrü", value: "24 ay (açıldıktan sonra 3 ay)" },
      { label: "Saklama", value: "Serin ve kuru yerde, doğrudan güneş ışığından uzak" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [v("750ml", "750 ml", 329.9, `SRP-${code}-750`)],
    tags: b.tags ?? [],
    ...b,
  };
}

function sauce(b: Base): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "soslar",
    art: "sauce",
    imageFit: "cover",
    highlights: [
      "Bardak içi ve üstü dekorasyon için ideal kıvam",
      "İnce uçlu sıkma şişe; damlatmadan çizgi ve desen",
      "Mocha, frappe, milkshake ve tatlılarda aroma sosu",
      "Isıtmaya gerek olmadan kullanım",
    ],
    usage: [
      "Bardak içi dekor: 5–10 g, bardağı döndürerek",
      "Krem şanti üstü: ince çizgiler hâlinde",
      "Mocha / frappe: 20–25 g",
      "Waffle, pankek ve dondurma üzeri: istenilen miktarda",
    ],
    specs: [
      { label: "Ambalaj", value: "Sıkma şişe, ince uçlu kapak" },
      { label: "Raf ömrü", value: "18 ay" },
      { label: "Saklama", value: "Oda sıcaklığında, açıldıktan sonra kapağı kapalı" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [v("sise", "Şişe", 249.9, `SOS-${code}`)],
    tags: b.tags ?? [],
    ...b,
  };
}

function puree(b: Base): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "pureler",
    art: "bottle",
    imageFit: "cover",
    highlights: [
      "Gerçek meyve parçacıkları ve doğal renk",
      "Smoothie, frozen, limonata ve kokteyl için ideal",
      "Damlatmayan pompalı dozaj kapağı; porsiyon kontrolü",
      "Dondurulmuş meyve stoklamaya gerek bırakmaz",
    ],
    usage: [
      "Smoothie: 60–80 ml püre + 150 ml süt/yoğurt + buz",
      "Frozen: 80 ml püre + 200 g buz, blender",
      "Meyveli soda: 40 ml püre + soda + buz",
      "Kokteyl: 30 ml püre, shaker",
    ],
    specs: [
      { label: "Ambalaj", value: "1 L pompalı PET şişe" },
      { label: "Raf ömrü", value: "12 ay (açıldıktan sonra buzdolabında 15 gün)" },
      { label: "Saklama", value: "Serin ve kuru yerde, açıldıktan sonra 2–6 °C" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [v("1l", "1 L", 449.9, `PUR-${code}-1000`)],
    tags: [...(b.tags ?? []), "vegan"],
    ...b,
  };
}

function coffee(b: Base & { notes: string; roast: string; origin: string }): Product {
  const { notes, roast, origin, ...rest } = b;
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "kahve",
    art: "bag",
    highlights: [
      `Tat notaları: ${notes}`,
      `Kavurma: ${roast}`,
      "Çekirdek kahve, tek yönlü valfli 1 kg poşet",
      "Espresso makinesi, moka pot ve filtre için uygun",
    ],
    usage: [
      "Espresso: 18 g kahve → 36 g espresso, 25–30 sn",
      "Filtre / V60: 15 g kahve → 250 ml su",
      "French press: 30 g kahve → 500 ml su, 4 dk",
    ],
    specs: [
      { label: "Menşei", value: origin },
      { label: "Kavurma", value: roast },
      { label: "Form", value: "Çekirdek (Whole Bean)" },
      { label: "Ambalaj", value: "1 kg (35.2 oz) valfli poşet" },
      { label: "Raf ömrü", value: "12 ay (en iyi tüketim: kavurmadan sonra 2 ay)" },
    ],
    variants: [v("1kg", "1 kg", 1149.9, `KHV-${code}-1000`)],
    tags: rest.tags ?? [],
    ...rest,
  };
}

function hotChocolate(b: Base): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "sicak-cikolata",
    art: "tin",
    imageFit: "cover",
    highlights: [
      "Yüksek kakao oranı, gerçek çikolata tadı",
      "Süt veya su ile hazırlanabilir",
      "Topaklanmayan, kolay çözünen toz",
      "Kafe standardında kıvam ve parlaklık",
    ],
    usage: [
      "Sıcak çikolata: 30 g toz + 180 ml sıcak süt",
      "Soğuk çikolata: 30 g toz + 100 ml süt, buz ile blender",
      "Mocha: 15 g toz + 1 shot espresso + süt",
    ],
    specs: [
      { label: "Ambalaj", value: "1 kg kutu" },
      { label: "Raf ömrü", value: "18 ay" },
      { label: "Alerjen", value: "Süt içerir; fındık ve soya izleri bulunabilir" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [v("1kg", "1 kg", 489.9, `SCK-${code}-1000`)],
    tags: b.tags ?? [],
    ...b,
  };
}

function bar(b: Base & { kind?: "salep" | "milkshake" | "sos" }): Product {
  const { kind = "salep", ...rest } = b;
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  const byKind = {
    salep: {
      art: "tin" as const,
      highlights: ["Gerçek salep ve süt tozuyla kıvamlı içim", "Sıcak sütle topaklanmadan çözünür", "Tutarlı lezzet, her bardakta aynı sonuç", "Ekonomik 1 kg kutu"],
      usage: ["1 bardak: 35–40 g toz + 180 ml sıcak süt, kaynatmadan karıştırın", "Üzerine tarçın serpin"],
      specs: [{ label: "Ambalaj", value: "1 kg kutu" }, { label: "Raf ömrü", value: "18 ay" }, { label: "Alerjen", value: "Süt içerir" }, { label: "Menşei", value: "Türkiye" }],
      variants: [v("1kg", "1 kg", 429.9, `BAR-${code}-1000`)],
    },
    milkshake: {
      art: "pouch" as const,
      highlights: ["Soğuk sütle blender'da 30 saniyede milkshake", "Kremamsı doku, dengeli tatlılık", "Frappe ve smoothie bazı olarak da kullanılır", "1 kg valfli poşet"],
      usage: ["Milkshake: 40 g toz + 150 ml soğuk süt + 100 g buz, blender", "Frappe: 35 g toz + 1 shot espresso + süt + buz"],
      specs: [{ label: "Ambalaj", value: "1 kg (35.2 oz) poşet" }, { label: "Raf ömrü", value: "18 ay" }, { label: "Alerjen", value: "Süt içerir" }, { label: "Menşei", value: "Türkiye" }],
      variants: [v("1kg", "1 kg", 429.9, `BAR-${code}-1000`)],
    },
    sos: {
      art: "sauce" as const,
      highlights: ["Yoğun kıvam, soğukta bile akışkan", "Topping, mocha ve tatlı sosu olarak çok amaçlı", "HoReCa için ekonomik 2,5 kg şişe", "Isıtmaya gerek olmadan kullanım"],
      usage: ["Caramel macchiato / frappe: 25–30 g", "Waffle, pankek ve dondurma üzeri: istenilen miktarda", "Bardak içi dekorasyon: 5–10 g"],
      specs: [{ label: "Ambalaj", value: "2,5 kg şişe" }, { label: "Raf ömrü", value: "18 ay" }, { label: "Saklama", value: "Oda sıcaklığında, açıldıktan sonra kapağı kapalı" }, { label: "Menşei", value: "Türkiye" }],
      variants: [v("2-5kg", "2,5 kg", 699.9, `BAR-${code}-2500`)],
    },
  }[kind];
  return {
    category: "bar-urunleri",
    imageFit: "cover",
    ...byKind,
    tags: rest.tags ?? [],
    ...rest,
  };
}

function tea(b: Base & { brew: string }): Product {
  const { brew, ...rest } = b;
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "bitki-cayi",
    art: "pouch",
    imageFit: "cover",
    highlights: [
      "Katkısız, doğal kurutulmuş bitki ve meyve",
      "Pencereli, kilitli (zip) poşet; aromayı korur",
      "Demlik ve bardak demlemeye uygun iri kesim",
      "Ümba Premium · Safranbolu",
    ],
    usage: [brew, "Demlik: 3 yemek kaşığı / 1 L su, 8–10 dk", "Soğuk çay: demleyip soğutun, buz ve limon ekleyin"],
    specs: [
      { label: "Ambalaj", value: "Kilitli, pencereli stand-up poşet" },
      { label: "Raf ömrü", value: "24 ay" },
      { label: "Saklama", value: "Serin, kuru ve kokusuz ortamda, ağzı kapalı" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [
      v("100g", "100 g", 149.9, `CAY-${code}-100`),
      v("250g", "250 g", 329.9, `CAY-${code}-250`),
    ],
    tags: [...(rest.tags ?? []), "vegan"],
    ...rest,
  };
}

/* -------------------------------------------------------------------------- */
/*  Katalog                                                                   */
/* -------------------------------------------------------------------------- */

export const products: Product[] = [
  /* ---------------------------------- Şuruplar --------------------------------- */
  syrup({
    slug: "cilek-surubu",
    name: "Çilek Şurubu",
    color: "#c41e3a",
    color2: "#7e1024",
    image: "/products/cilek-surubu.webp",
    imageFit: "cover",
    short: "Olgun çilek; limonata ve sodanın yıldızı.",
    description: "Taze çilek aromasıyla parlak kırmızı şurup. Çilekli limonata, soda, milkshake ve frozen için; sütlü içeceklerde kesilmeden karışır.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "seftali-surubu",
    name: "Şeftali Şurubu",
    color: "#f4a53a",
    color2: "#c77214",
    image: "/products/seftali-surubu.webp",
    imageFit: "cover",
    short: "Güneşli, sulu şeftali; buzlu çayın klasiği.",
    description: "Şeftali aromasıyla hazırlanan altın sarısı şurup. Peach iced tea, soda ve kokteyllerde yaz menüsünün vazgeçilmezi.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "visne-surubu",
    name: "Vişne Şurubu",
    color: "#8b0a2a",
    color2: "#4f0516",
    image: "/products/visne-surubu.webp",
    imageFit: "cover",
    short: "Ekşi tatlı dengesiyle derin vişne.",
    description: "Yoğun vişne aromalı, koyu kırmızı şurup. Vişneli soda, limonata ve kokteyllerde; sütlü içeceklerde cherry latte için.",
    tags: [],
  }),
  syrup({
    slug: "chai-tea-surubu",
    name: "Chai Tea Şurubu",
    color: "#5a3a22",
    color2: "#2f1c0f",
    image: "/products/chai-tea-surubu.webp",
    imageFit: "cover",
    short: "Tarçın, kakule ve karanfil; baharatlı çay.",
    description: "Siyah çay ve baharat karışımı aromalı şurup. Süt ile chai latte, buz ile iced chai; kış ve yaz menüsünde.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "cookies-surubu",
    name: "Cookies Şurubu",
    color: "#2a1d18",
    color2: "#120b08",
    image: "/products/cookies-surubu.webp",
    imageFit: "cover",
    short: "Kakaolu kurabiye ve krema; tatlı menüsü.",
    description: "Kakaolu kurabiye aromalı şurup. Cookies frappe, milkshake ve soğuk kahvelerde; krem şanti ile tatlı menüsünün favorisi.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "tuzlu-karamel-surubu",
    name: "Tuzlu Karamel Şurubu",
    color: "#b8651f",
    color2: "#7a3f0e",
    image: "/products/tuzlu-karamel-surubu.webp",
    imageFit: "cover",
    short: "Yanık karamel ve deniz tuzu dengesi.",
    description: "Karamelin tatlılığını bir tutam tuzla dengeleyen şurup. Salted caramel latte, frappe ve soğuk kahvelerde.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "damla-sakizi-surubu",
    name: "Damla Sakızı Şurubu",
    color: "#3f8fa3",
    color2: "#22596a",
    image: "/products/damla-sakizi-surubu.webp",
    imageFit: "cover",
    short: "Ege'nin damla sakızı; ferah ve reçineli.",
    description: "Damla sakızı aromalı, açık renkli şurup. Sakızlı limonata, soda ve sütlü içeceklerde; Türk kahvesi ve sütlü tatlılarla uyumlu.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "irish-cream-surubu",
    name: "Irish Cream Şurubu",
    color: "#b9773c",
    color2: "#7a4a1e",
    image: "/products/irish-cream-surubu.webp",
    imageFit: "cover",
    short: "Kremamsı, hafif viski esintili.",
    description: "Irish cream aromasıyla kremamsı ve yuvarlak şurup. Latte, soğuk kahve ve sıcak çikolatada bar klasiği.",
    tags: [],
  }),
  syrup({
    slug: "muz-surubu",
    name: "Muz Şurubu",
    color: "#e8c227",
    color2: "#b48f0d",
    image: "/products/muz-surubu.webp",
    imageFit: "cover",
    short: "Olgun muz; milkshake ve smoothie bazı.",
    description: "Muz aromalı, altın sarısı şurup. Muzlu süt, milkshake ve frappe için; kahveyle de uyumlu.",
    tags: [],
  }),
  syrup({
    slug: "karpuz-surubu",
    name: "Karpuz Şurubu",
    color: "#e0313d",
    color2: "#9f1620",
    image: "/products/karpuz-surubu.webp",
    imageFit: "cover",
    short: "Sulu karpuz; yaz sodasının favorisi.",
    description: "Karpuz aromalı, canlı kırmızı şurup. Karpuzlu soda, limonata ve frozen içeceklerde yaz menüsü için.",
    tags: [],
  }),
  syrup({
    slug: "kivi-surubu",
    name: "Kivi Şurubu",
    color: "#5c9a2b",
    color2: "#366117",
    image: "/products/kivi-surubu.webp",
    imageFit: "cover",
    short: "Ekşi tatlı kivi; yeşil ve ferah.",
    description: "Kivi aromalı yeşil şurup. Kivili soda, limonata ve mojito çeşitlemelerinde renk ve ferahlık.",
    tags: [],
  }),
  syrup({
    slug: "mango-surubu",
    name: "Mango Şurubu",
    color: "#f08a24",
    color2: "#b85d0b",
    image: "/products/mango-surubu.webp",
    imageFit: "cover",
    short: "Tropikal, yoğun mango.",
    description: "Mango aromalı turuncu şurup. Mango soda, frozen ve kokteyllerde; buzlu çaya tropik dokunuş.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "frambuaz-surubu",
    name: "Frambuaz Şurubu",
    color: "#c2185b",
    color2: "#7d0d39",
    image: "/products/frambuaz-surubu.webp",
    imageFit: "cover",
    short: "Ekşi tatlı frambuaz; soda ve kokteyl.",
    description: "Frambuaz aromalı pembe-kırmızı şurup. Frambuazlı soda, limonata ve beyaz çikolatalı içeceklerle uyumlu.",
    tags: [],
  }),
  syrup({
    slug: "findik-surubu",
    name: "Fındık Şurubu",
    color: "#a9652c",
    color2: "#6e3f16",
    image: "/products/findik-surubu.webp",
    imageFit: "cover",
    short: "Kavrulmuş fındık; latte ve sıcak çikolata.",
    description: "Kavrulmuş fındık aromalı şurup. Hazelnut latte, sıcak çikolata ve soğuk kahvelerde kış ve yaz klasiği.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "blue-curacao-surubu",
    name: "Blue Curaçao Şurubu",
    color: "#1e3fae",
    color2: "#102466",
    image: "/products/blue-curacao-surubu.webp",
    imageFit: "cover",
    short: "Turunç aromalı, parlak mavi.",
    description: "Portakal kabuğu (turunç) aromalı, canlı mavi şurup. Blue lagoon, soda ve alkolsüz kokteyllerde göz alıcı renk.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "mojito-surubu",
    name: "Mojito Şurubu",
    color: "#7fbf6a",
    color2: "#4e8a3b",
    image: "/products/mojito-surubu.webp",
    imageFit: "cover",
    short: "Nane ve lime; alkolsüz mojito bazı.",
    description: "Nane ve lime aromalı şurup. Soda ve buz ile virgin mojito, limonatalara ferah bir dokunuş.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "nar-surubu",
    name: "Nar Şurubu",
    color: "#9b1030",
    color2: "#5c0719",
    image: "/products/nar-surubu.webp",
    imageFit: "cover",
    short: "Ekşi tatlı nar; soda ve kokteyl.",
    description: "Nar aromalı, koyu kırmızı şurup. Narlı soda, limonata ve kokteyllerde; buzlu çaya derinlik katar.",
    tags: [],
  }),
  syrup({
    slug: "hindistan-cevizi-surubu",
    name: "Hindistan Cevizi Şurubu",
    color: "#e9d7a0",
    color2: "#b89a4b",
    image: "/products/hindistan-cevizi-surubu.webp",
    imageFit: "cover",
    short: "Tropik hindistan cevizi; piña colada bazı.",
    description: "Hindistan cevizi aromalı şurup. Piña colada tarzı frozen, sütlü soğuk kahveler ve smoothie'lerde tropik tat.",
    tags: [],
  }),
  syrup({
    slug: "cool-lime-surubu",
    name: "Cool Lime Şurubu",
    color: "#9bd13a",
    color2: "#5f8f16",
    image: "/products/cool-lime-surubu.webp",
    imageFit: "cover",
    short: "Lime ve nane; buz gibi yaz içeceği.",
    description: "Lime ve nane aromalı canlı yeşil şurup. Soda ve bol buzla cool lime; limonata ve mojito çeşitlemelerinde.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "portakal-surubu",
    name: "Portakal Şurubu",
    color: "#f07a1f",
    color2: "#b4500a",
    image: "/products/portakal-surubu.webp",
    imageFit: "cover",
    short: "Güneşli portakal; soda ve buzlu çay.",
    description: "Portakal aromalı turuncu şurup. Portakallı soda, buzlu çay ve kokteyllerde; çikolatalı içeceklerle de uyumlu.",
    tags: [],
  }),
  syrup({
    slug: "lime-surubu",
    name: "Lime Şurubu",
    color: "#8fae2e",
    color2: "#5b7318",
    image: "/products/lime-surubu.webp",
    imageFit: "cover",
    short: "Keskin ve ferah lime.",
    description: "Lime aromalı şurup. Soda, limonata ve alkolsüz kokteyllerin ekşi dengesi; mojito ve margarita tarzı içecekler için.",
    tags: [],
  }),
  syrup({
    slug: "toffee-nut-surubu",
    name: "Toffee Nut Şurubu",
    color: "#b5702c",
    color2: "#7a4612",
    image: "/products/toffee-nut-surubu.webp",
    imageFit: "cover",
    short: "Şekerleme ve kavrulmuş fındık; kış klasiği.",
    description: "Şekerleme fındık aromalı şurup. Toffee nut latte, frappe ve sıcak çikolatada kış menüsünün favorisi.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "karamel-surubu",
    name: "Karamel Şurubu",
    color: "#c9782a",
    color2: "#8a4a10",
    image: "/products/karamel-surubu.webp",
    imageFit: "cover",
    short: "Yanık şeker notalarıyla derin, sıcak karamel.",
    description: "Karamel aromalı şurup. Caramel macchiato, soğuk kahve ve frappe için; her kafenin en çok satan aroması.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "kirmizi-orman-meyveleri-surubu",
    name: "Kırmızı Orman Meyveleri Şurubu",
    color: "#b2144a",
    color2: "#6d0a2c",
    image: "/products/kirmizi-orman-meyveleri-surubu.webp",
    imageFit: "cover",
    short: "Frenk üzümü, ahududu ve böğürtlen karışımı.",
    description: "Kırmızı orman meyveleri aromalı şurup. Meyveli soda, limonata ve buzlu çayda yoğun renk ve ekşi tatlı denge.",
    tags: [],
  }),
  syrup({
    slug: "yesil-elma-surubu",
    name: "Yeşil Elma Şurubu",
    color: "#5fb834",
    color2: "#357a18",
    image: "/products/yesil-elma-surubu.webp",
    imageFit: "cover",
    short: "Ekşi tatlı yeşil elma; soda favorisi.",
    description: "Yeşil elma aromalı parlak yeşil şurup. Elmalı soda, limonata ve alkolsüz kokteyllerde ferahlık.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "bogurtlen-surubu",
    name: "Böğürtlen Şurubu",
    color: "#4a1458",
    color2: "#2a0a33",
    image: "/products/bogurtlen-surubu.webp",
    imageFit: "cover",
    short: "Koyu mor böğürtlen; soda ve kokteyl.",
    description: "Böğürtlen aromalı mor şurup. Böğürtlenli soda, limonata ve beyaz çikolatalı içeceklerle uyumlu.",
    tags: [],
  }),
  syrup({
    slug: "ananas-surubu",
    name: "Ananas Şurubu",
    color: "#f2cf2a",
    color2: "#c09a0d",
    image: "/products/ananas-surubu.webp",
    imageFit: "cover",
    short: "Tropik ananas; frozen ve soda.",
    description: "Ananas aromalı sarı şurup. Piña colada, tropik soda ve smoothie'lerde yaz menüsünün tatlısı.",
    tags: [],
  }),
  syrup({
    slug: "vanilya-surubu",
    name: "Vanilya Şurubu",
    color: "#e4b86a",
    color2: "#b3813a",
    image: "/products/vanilya-surubu.webp",
    imageFit: "cover",
    short: "Yumuşak, kremamsı vanilya; her lattenin klasiği.",
    description: "Vanilya aromalı şurup. Vanilla latte, soğuk kahve ve milkshake'lerin vazgeçilmezi; kahvenin acılığını yuvarlar.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "kavun-surubu",
    name: "Kavun Şurubu",
    color: "#f1c232",
    color2: "#b88a10",
    image: "/products/kavun-surubu.webp",
    imageFit: "cover",
    short: "Tatlı, sulu kavun; yaz sodası.",
    description: "Kavun aromalı altın sarısı şurup. Kavunlu soda, limonata ve frozen içeceklerde yazın hafif tatlısı.",
    tags: [],
  }),
  syrup({
    slug: "nane-surubu",
    name: "Nane Şurubu",
    color: "#1f8a5b",
    color2: "#0f5236",
    image: "/products/nane-surubu.webp",
    imageFit: "cover",
    short: "Ferah nane; mojito ve soda bazı.",
    description: "Nane aromalı yeşil şurup. Virgin mojito, naneli limonata ve soda için; sıcak çikolatada mint mocha dokunuşu.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "beyaz-cikolata-surubu",
    name: "Beyaz Çikolata Şurubu",
    color: "#efe3c2",
    color2: "#c9b07a",
    image: "/products/beyaz-cikolata-surubu.webp",
    imageFit: "cover",
    short: "Kremamsı beyaz çikolata; latte ve mocha.",
    description: "Beyaz çikolata aromalı şurup. White mocha, frappe ve milkshake için; meyveli şuruplarla yumuşak kombinasyonlar.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "berry-hibiscus-surubu",
    name: "Berry Hibiscus Şurubu",
    color: "#a0133f",
    color2: "#5c0822",
    image: "/products/berry-hibiscus-surubu.webp",
    imageFit: "cover",
    short: "Orman meyveleri ve hibiskus; çiçeksi ekşi.",
    description: "Orman meyveleri ve hibiskus aromalı şurup. Buzlu çay, soda ve limonatada çiçeksi, ekşi tatlı derinlik.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "cikolata-surubu",
    name: "Çikolata Şurubu",
    color: "#3b1f12",
    color2: "#1d0e08",
    image: "/products/cikolata-surubu.webp",
    imageFit: "cover",
    short: "Yoğun kakao; mocha ve milkshake.",
    description: "Çikolata aromalı koyu şurup. Mocha, çikolatalı frappe ve milkshake için; sıcak çikolatayı derinleştirir.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "seker-surubu",
    name: "Şeker Şurubu",
    color: "#efe6c3",
    color2: "#c6b784",
    image: "/products/seker-surubu.webp",
    imageFit: "cover",
    short: "Sade şeker şurubu; her içeceğin tatlandırıcısı.",
    description: "Nötr şeker şurubu. Soğuk kahve, buzlu çay, limonata ve kokteyllerde anında çözünen tatlandırıcı; aroma katmaz.",
    tags: [],
  }),
  syrup({
    slug: "limon-surubu",
    name: "Limon Şurubu",
    color: "#f2d733",
    color2: "#bfa30c",
    image: "/products/limon-surubu.webp",
    imageFit: "cover",
    short: "Taze sıkılmış limon; limonata bazı.",
    description: "Limon aromalı sarı şurup. Limonata, soda ve buzlu çayın ekşi dengesi; mojito ve lemon iced tea için.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "hibiskus-surubu",
    name: "Hibiskus Şurubu",
    color: "#a8123c",
    color2: "#5e0820",
    image: "/products/hibiskus-surubu.webp",
    imageFit: "cover",
    short: "Çiçeksi ve ekşi hibiskus; buzlu çay favorisi.",
    description: "Hibiskus aromalı koyu kırmızı şurup. Hibiskuslu buzlu çay, soda ve limonatada parlak renk ve ferah ekşilik.",
    tags: [],
  }),
  syrup({
    slug: "karadut-surubu",
    name: "Karadut Şurubu",
    color: "#4b1a5e",
    color2: "#2a0d36",
    image: "/products/karadut-surubu.webp",
    imageFit: "cover",
    short: "Koyu mor karadut; soda ve limonata.",
    description: "Karadut aromalı mor şurup. Karadutlu soda, limonata ve kokteyllerde yoğun renk ve ekşi tatlı tat.",
    tags: ["yeni"],
  }),
  /* ----------------------------------- Soslar ---------------------------------- */
  sauce({
    slug: "cikolata-sosu",
    name: "Çikolata Dekor Sosu",
    color: "#6e1f24",
    color2: "#3d0f12",
    image: "/products/cikolata-sosu.webp",
    short: "Yoğun kakaolu dekor sos; mocha ve bardak süsleme.",
    description: "Çikolata aromalı dekor sos. Mocha, sıcak çikolata ve frappe bardaklarında çizgi ve desen; krem şanti üstü süsleme.",
    tags: ["cok-satan"],
  }),
  sauce({
    slug: "muz-sosu",
    name: "Muz Dekor Sosu",
    color: "#e3d53a",
    color2: "#a89a12",
    image: "/products/muz-sosu.webp",
    short: "Muz aromalı dekor sos; milkshake ve tatlı.",
    description: "Muz aromalı dekor sos. Muzlu milkshake, dondurma ve waffle üzerinde tatlı, meyveli dokunuş.",
    tags: [],
  }),
  sauce({
    slug: "blue-curacao-sosu",
    name: "Blue Curaçao Dekor Sosu",
    color: "#5a9ec2",
    color2: "#2d6a8c",
    image: "/products/blue-curacao-sosu.webp",
    short: "Turunç aromalı mavi dekor sos.",
    description: "Turunç aromalı blue curaçao dekor sos. Soda ve kokteyl bardaklarında mavi çizgi ve renk geçişi.",
    tags: ["yeni"],
  }),
  sauce({
    slug: "visne-sosu",
    name: "Vişne Dekor Sosu",
    color: "#a9192e",
    color2: "#660c1a",
    image: "/products/visne-sosu.webp",
    short: "Ekşi tatlı vişne dekor sos.",
    description: "Vişne aromalı dekor sos. Cheesecake, milkshake ve soda bardaklarında yoğun kırmızı dekor.",
    tags: [],
  }),
  sauce({
    slug: "beyaz-cikolata-sosu",
    name: "Beyaz Çikolata Dekor Sosu",
    color: "#efe4c4",
    color2: "#c8b27c",
    image: "/products/beyaz-cikolata-sosu.webp",
    short: "Kremamsı beyaz çikolata dekor sos.",
    description: "Beyaz çikolata aromalı dekor sos. White mocha ve frappe bardaklarında; krem şanti üstü süsleme.",
    tags: ["cok-satan"],
  }),
  sauce({
    slug: "karamel-sosu",
    name: "Karamel Dekor Sosu",
    color: "#d9a35a",
    color2: "#9c6a24",
    image: "/products/karamel-sosu.webp",
    short: "Sıcak karamel dekor sos; macchiato klasiği.",
    description: "Karamel aromalı dekor sos. Caramel macchiato, frappe ve waffle üzerinde çizgiler; tuz tanesiyle salted caramel.",
    tags: ["cok-satan"],
  }),
  sauce({
    slug: "frambuaz-sosu",
    name: "Frambuaz Dekor Sosu",
    color: "#d9377a",
    color2: "#8f1c4c",
    image: "/products/frambuaz-sosu.webp",
    short: "Pembe frambuaz dekor sos.",
    description: "Frambuaz aromalı dekor sos. Milkshake, soda ve tatlı bardaklarında pembe dekor.",
    tags: [],
  }),
  sauce({
    slug: "cilek-sosu",
    name: "Çilek Dekor Sosu",
    color: "#e8a0a8",
    color2: "#c4505c",
    image: "/products/cilek-sosu.webp",
    short: "Çilek aromalı dekor sos; milkshake ve tatlı.",
    description: "Çilek aromalı dekor sos. Çilekli milkshake, dondurma ve pankek üzerinde; bardak içi çizgi.",
    tags: ["cok-satan"],
  }),
  sauce({
    slug: "kivi-sosu",
    name: "Kivi Dekor Sosu",
    color: "#7cb83a",
    color2: "#4b7a1e",
    image: "/products/kivi-sosu.webp",
    short: "Yeşil kivi dekor sos.",
    description: "Kivi aromalı dekor sos. Soda, smoothie ve tatlı bardaklarında yeşil dekor.",
    tags: [],
  }),
  sauce({
    slug: "bogurtlen-sosu",
    name: "Böğürtlen Dekor Sosu",
    color: "#a898b8",
    color2: "#6e5e82",
    image: "/products/bogurtlen-sosu.webp",
    short: "Mor böğürtlen dekor sos.",
    description: "Böğürtlen aromalı dekor sos. Milkshake, soda ve cheesecake üzerinde mor dekor.",
    tags: ["yeni"],
  }),

  /* ----------------------------------- Püreler --------------------------------- */
  puree({
    slug: "visne-puresi",
    name: "Vişne Püresi",
    color: "#8b0a2a",
    color2: "#4f0516",
    image: "/products/visne-puresi.webp",
    short: "Ekşi tatlı vişne; soda ve kokteyl.",
    description: "Vişne parçacıklı koyu kırmızı püre. Vişneli soda, limonata, frozen ve kokteyllerde yoğun meyve tadı.",
    tags: [],
  }),
  puree({
    slug: "carkifelek-puresi",
    name: "Çarkıfelek Püresi",
    color: "#8e1b43",
    color2: "#4f0c25",
    image: "/products/carkifelek-puresi.webp",
    short: "Tropik, çekirdekli çarkıfelek.",
    description: "Çarkıfelek (passion fruit) çekirdekli püre. Passion soda, frozen ve kokteyllerde egzotik ekşi tatlılık.",
    tags: ["yeni"],
  }),
  puree({
    slug: "lime-puresi",
    name: "Lime Püresi",
    color: "#2f6b2e",
    color2: "#1b3f1a",
    image: "/products/lime-puresi.webp",
    short: "Keskin lime; mojito ve margarita bazı.",
    description: "Lime püresi. Virgin mojito, margarita tarzı frozen içecekler ve limonatalarda ekşi denge.",
    tags: [],
  }),
  puree({
    slug: "yaban-mersini-puresi",
    name: "Yaban Mersini Püresi",
    color: "#5a3d8c",
    color2: "#33215a",
    image: "/products/yaban-mersini-puresi.webp",
    short: "Yaban mersini; smoothie ve soda.",
    description: "Yaban mersini parçacıklı mor püre. Blueberry smoothie, soda ve frozen içeceklerde doğal renk ve tat.",
    tags: [],
  }),
  puree({
    slug: "karadut-puresi",
    name: "Karadut Püresi",
    color: "#4a2158",
    color2: "#2a0f33",
    image: "/products/karadut-puresi.webp",
    short: "Koyu mor karadut; soda ve limonata.",
    description: "Karadut püresi. Karadutlu soda, limonata, frozen ve kokteyllerde yoğun renk.",
    tags: [],
  }),
  puree({
    slug: "kavun-puresi",
    name: "Kavun Püresi",
    color: "#e9966a",
    color2: "#b2623a",
    image: "/products/kavun-puresi.webp",
    short: "Tatlı, sulu kavun; yaz içecekleri.",
    description: "Kavun püresi. Kavunlu soda, frozen ve smoothie'lerde yazın hafif tatlısı.",
    tags: [],
  }),
  puree({
    slug: "cilek-puresi",
    name: "Çilek Püresi",
    color: "#b4232f",
    color2: "#7a1420",
    image: "/products/cilek-puresi.webp",
    imageCutout: "/products/cilek-puresi-cutout.webp",
    imageHover: "/products/cilek-puresi-cutout.webp",
    short: "Yüksek meyveli çilek; smoothie ve frozen bazı.",
    description: "Olgun çileklerden hazırlanan, gerçek meyve parçacıklı çilek püresi. Smoothie, frozen, milkshake ve çilekli limonata için.",
    tags: ["cok-satan"],
  }),
  puree({
    slug: "karpuz-puresi",
    name: "Karpuz Püresi",
    color: "#e0313d",
    color2: "#9f1620",
    image: "/products/karpuz-puresi.webp",
    short: "Sulu karpuz; frozen ve soda.",
    description: "Karpuz püresi. Karpuz frozen, soda ve limonatada yaz menüsünün en çok döneni.",
    tags: ["cok-satan"],
  }),
  puree({
    slug: "kirmizi-orman-meyveleri-puresi",
    name: "Kırmızı Orman Meyveleri Püresi",
    color: "#a8183f",
    color2: "#5e0a22",
    image: "/products/kirmizi-orman-meyveleri-puresi.webp",
    short: "Çilek, ahududu, böğürtlen ve yaban mersini karışımı.",
    description: "Kırmızı orman meyveleri püresi. Berry smoothie, soda ve frozen içeceklerde yoğun, ekşi tatlı meyve.",
    tags: ["cok-satan"],
  }),
  puree({
    slug: "ananas-puresi",
    name: "Ananas Püresi",
    color: "#c98a3a",
    color2: "#8f5b18",
    image: "/products/ananas-puresi.webp",
    short: "Tropik ananas; piña colada ve frozen.",
    description: "Ananas püresi. Piña colada tarzı frozen, tropik soda ve smoothie'lerde güneşli tat.",
    tags: [],
  }),
  puree({
    slug: "muz-puresi",
    name: "Muz Püresi",
    color: "#e8cf7a",
    color2: "#b29a3d",
    image: "/products/muz-puresi.webp",
    short: "Olgun muz; milkshake ve smoothie.",
    description: "Muz püresi. Muzlu milkshake, smoothie ve frozen içeceklerde kremamsı doku.",
    tags: [],
  }),
  puree({
    slug: "seftali-puresi",
    name: "Şeftali Püresi",
    color: "#ef6b5a",
    color2: "#b43d2e",
    image: "/products/seftali-puresi.webp",
    short: "Sulu şeftali; buzlu çay ve frozen.",
    description: "Şeftali püresi. Peach iced tea, frozen ve soda için yumuşak, meyveli tat.",
    tags: [],
  }),
  puree({
    slug: "mango-puresi",
    name: "Mango Püresi",
    color: "#e5543a",
    color2: "#a9321c",
    image: "/products/mango-puresi.webp",
    short: "Yoğun tropik mango; smoothie yıldızı.",
    description: "Mango püresi. Mango smoothie, frozen, lassi ve soda için yoğun tropik tat; her bardakta aynı renk.",
    tags: ["cok-satan"],
  }),
  puree({
    slug: "kivi-puresi",
    name: "Kivi Püresi",
    color: "#8bb33c",
    color2: "#587420",
    image: "/products/kivi-puresi.webp",
    short: "Ekşi tatlı kivi; yeşil ve ferah.",
    description: "Kivi püresi. Kivili soda, frozen ve smoothie'lerde canlı yeşil renk ve ferahlık.",
    tags: [],
  }),
  puree({
    slug: "yesil-elma-puresi",
    name: "Yeşil Elma Püresi",
    color: "#8aa84a",
    color2: "#56702a",
    image: "/products/yesil-elma-puresi.webp",
    short: "Ekşi tatlı yeşil elma; soda ve frozen.",
    description: "Yeşil elma püresi. Elmalı soda, frozen ve mojito çeşitlemelerinde ferah ekşilik.",
    tags: [],
  }),
  puree({
    slug: "frambuaz-puresi",
    name: "Frambuaz Püresi",
    color: "#c2185b",
    color2: "#7d0d39",
    image: "/products/frambuaz-puresi.webp",
    short: "Ekşi tatlı frambuaz; soda ve kokteyl.",
    description: "Frambuaz püresi. Frambuazlı soda, frozen ve kokteyllerde pembe renk ve ekşi tatlı tat.",
    tags: [],
  }),
  puree({
    slug: "bogurtlen-puresi",
    name: "Böğürtlen Püresi",
    color: "#3b3f9c",
    color2: "#232561",
    image: "/products/bogurtlen-puresi.webp",
    short: "Koyu böğürtlen; soda ve frozen.",
    description: "Böğürtlen püresi. Böğürtlenli soda, frozen ve kokteyllerde yoğun meyve.",
    tags: ["yeni"],
  }),
  puree({
    slug: "limon-puresi",
    name: "Limon Püresi",
    color: "#e9c83a",
    color2: "#b4961a",
    image: "/products/limon-puresi.webp",
    short: "Taze sıkılmış limon; limonata bazı.",
    description: "Limon püresi. Limonata, frozen limon ve soda için taze sıkılmış limon tadı.",
    tags: ["cok-satan"],
  }),

  /* ------------------------------------ Kahve ---------------------------------- */
  coffee({
    slug: "espresso-daily",
    name: "Espresso Daily",
    color: "#1e3a8a",
    color2: "#0f1f4d",
    image: "/products/espresso-daily.webp",
    imageFit: "cover",
    short: "Yumuşak, çiçeksi ve baharatlı; günlük espresso harmanı.",
    description: "Her gün içilecek dengeli espresso harmanı. Yumuşak gövde, çiçeksi ve hafif baharatlı notalar; sütlü kahvelerde de karakterini korur. Çekirdek, 1 kg.",
    notes: "Yumuşak, çiçeksi, baharatlı",
    roast: "Orta",
    origin: "Harman",
    tags: ["cok-satan"],
  }),
  coffee({
    slug: "espresso-colombian",
    name: "Espresso Colombian",
    color: "#8b1a1a",
    color2: "#4d0d0d",
    image: "/products/espresso-colombian.webp",
    imageFit: "cover",
    short: "%100 Arabica; meyvemsi, tatlı ve narenciye notalı.",
    description: "Kolombiya yüksek rakım %100 Arabica. Meyvemsi, tatlı ve narenciye notalı, parlak asiditeli espresso; filtre ve V60'ta da öne çıkar. Çekirdek, 1 kg.",
    notes: "Meyvemsi, tatlı, narenciye",
    roast: "Orta",
    origin: "Kolombiya · %100 Arabica",
    tags: ["single-origin"],
  }),
  coffee({
    slug: "espresso-reserve",
    name: "Espresso Reserve",
    color: "#2f5e2a",
    color2: "#1a3a17",
    image: "/products/espresso-reserve.webp",
    imageFit: "cover",
    short: "%100 Arabica; çikolata, fındık ve karamel.",
    description: "Reserve seçkisi %100 Arabica: çikolata, fındık ve karamel notalı, yoğun ve uzun bitişli espresso. Kalın krema, sütlü içeceklerde dolgun gövde. Çekirdek, 1 kg.",
    notes: "Çikolata, fındık, karamel",
    roast: "Orta-koyu",
    origin: "%100 Arabica",
    tags: ["yeni"],
  }),

  /* -------------------------------- Sıcak Çikolata ------------------------------ */
  hotChocolate({
    slug: "sicak-cikolata-klasik",
    name: "Hot Chocolate Classic",
    color: "#4a2318",
    color2: "#2a120a",
    image: "/products/sicak-cikolata-klasik.webp",
    short: "Klasik, kıvamlı, gerçek kakaolu sıcak çikolata.",
    description: "Umba Hot Chocolate Classic: yüksek kakaolu, kıvamlı ve parlak klasik sıcak çikolata tozu. Kafe standardında, 1 kg kutu.",
    tags: ["cok-satan"],
  }),
  hotChocolate({
    slug: "sicak-cikolata-premium",
    name: "Hot Chocolate Premium",
    color: "#3a1a10",
    color2: "#1c0c06",
    image: "/products/sicak-cikolata-premium.webp",
    short: "Daha yoğun kakao ve çikolata parçacıklı premium seçki.",
    description: "Umba Hot Chocolate Premium: yüksek kakao oranı ve daha yoğun çikolata tadıyla premium sıcak çikolata tozu. Kalın kıvam, uzun bitiş. 1 kg kutu.",
    tags: ["yeni"],
  }),
  hotChocolate({
    slug: "sicak-cikolata-beyaz",
    name: "Hot Chocolate Beyaz",
    color: "#e9dcc0",
    color2: "#c2ad7d",
    image: "/products/sicak-cikolata-beyaz.webp",
    short: "Kremamsı beyaz çikolata; white mocha bazı.",
    description: "Umba Hot Chocolate Beyaz: kremamsı, yumuşak beyaz çikolata tozu. Beyaz sıcak çikolata ve white mocha için. 1 kg kutu.",
    tags: [],
  }),
  hotChocolate({
    slug: "sicak-cikolata-safranbolu",
    name: "Ümba Premium Sıcak Çikolata",
    color: "#8b1a1a",
    color2: "#4d0d0d",
    image: "/products/sicak-cikolata-safranbolu.webp",
    short: "Ümba Premium Safranbolu serisi; hediyelik kutu.",
    description: "Ümba Premium'dan Sıcak Çikolata: Safranbolu serisinin şık kutusunda, gerçek kakaolu kıvamlı sıcak çikolata. Hediyelik ve kafe kullanımı için.",
    tags: ["yeni"],
  }),
  /* --------------------------------- Bar Ürünleri ------------------------------- */
  bar({
    slug: "salep-klasik",
    name: "Sahlep Classic",
    color: "#d98a2a",
    color2: "#9a5a10",
    kind: "salep",
    image: "/products/salep-klasik.webp",
    short: "Klasik kıvamlı salep; tarçınla servis.",
    description: "Umba Sahlep Classic: gerçek salep ve süt tozuyla hazırlanan kıvamlı, klasik salep tozu. Sıcak sütle karıştırın, tarçın serpin. 1 kg kutu.",
    tags: ["cok-satan"],
  }),
  bar({
    slug: "salep-premium",
    name: "Sahlep Premium",
    color: "#c0272d",
    color2: "#7a1216",
    kind: "salep",
    image: "/products/salep-premium.webp",
    short: "Daha yoğun salep oranı, daha kıvamlı içim.",
    description: "Umba Sahlep Premium: yüksek salep oranıyla daha kıvamlı ve daha aromalı premium salep tozu. Kafe ve otel kış menüsü için. 1 kg kutu.",
    tags: ["yeni"],
  }),
  bar({
    slug: "salep-damla-sakizli",
    name: "Sahlep Damla Sakızlı",
    color: "#3fb3c9",
    color2: "#1f7a8c",
    kind: "salep",
    image: "/products/salep-damla-sakizli.webp",
    short: "Damla sakızı aromalı salep.",
    description: "Umba Sahlep Damla Sakızlı: Ege damla sakızının ferah aromasıyla salep tozu. Kış menüsünde fark yaratan tat. 1 kg kutu.",
    tags: ["yeni"],
  }),
  bar({
    slug: "salep-cikolatali",
    name: "Sahlep Çikolatalı",
    color: "#5a2d1a",
    color2: "#331708",
    kind: "salep",
    image: "/products/salep-cikolatali.webp",
    short: "Çikolata aromalı salep.",
    description: "Umba Sahlep Çikolatalı: kakaolu, çikolata aromalı salep tozu. Sıcak çikolata ile salebin buluşması. 1 kg kutu.",
    tags: [],
  }),
  bar({
    slug: "salep-findikli",
    name: "Sahlep Fındıklı",
    color: "#a9652c",
    color2: "#6e3f16",
    kind: "salep",
    image: "/products/salep-findikli.webp",
    short: "Fındık aromalı salep.",
    description: "Umba Sahlep Fındıklı: kavrulmuş fındık aromalı salep tozu. Kremamsı ve dolgun. 1 kg kutu.",
    tags: [],
  }),
  bar({
    slug: "milkshake-vanilya",
    name: "Milkshake Tozu Vanilya",
    color: "#efe0b8",
    color2: "#c9b27a",
    kind: "milkshake",
    image: "/products/milkshake-vanilya.webp",
    short: "Vanilya aromalı milkshake ve frappe tozu.",
    description: "Umba Milkshake Vanilya Aromalı: soğuk sütle blender'da 30 saniyede kremamsı milkshake. Frappe ve smoothie bazı olarak da kullanılır. 1 kg poşet.",
    tags: ["cok-satan"],
  }),
  bar({
    slug: "milkshake-karamel",
    name: "Milkshake Tozu Karamel",
    color: "#d9892c",
    color2: "#a85f12",
    kind: "milkshake",
    image: "/products/milkshake-karamel.webp",
    short: "Karamel aromalı milkshake ve frappe tozu.",
    description: "Umba Milkshake Karamel Aromalı: karamel tadında kremamsı milkshake tozu; frappe ve soğuk kahvelerde. 1 kg poşet.",
    tags: [],
  }),
  bar({
    slug: "milkshake-cikolata",
    name: "Milkshake Tozu Çikolata",
    color: "#4a2a1a",
    color2: "#2a150a",
    kind: "milkshake",
    image: "/products/milkshake-cikolata.webp",
    short: "Çikolata aromalı milkshake ve frappe tozu.",
    description: "Umba Milkshake Çikolata Aromalı: kakaolu, kremamsı milkshake tozu; çikolatalı frappe ve soğuk mocha için. 1 kg poşet.",
    tags: ["cok-satan"],
  }),
  bar({
    slug: "karamel-sosu-2-5kg",
    name: "Karamel Sos 2,5 kg (Chef's Collection)",
    color: "#b8651f",
    color2: "#7a3f0e",
    kind: "sos",
    image: "/products/karamel-sosu-2-5kg.webp",
    short: "HoReCa için 2,5 kg karamel aromalı sos.",
    description: "Umba Chef's Collection Caramel Flavored Sauce: yoğun kıvamlı karamel sos, 2,5 kg ekonomik şişe. Caramel macchiato, frappe, waffle ve dondurma için.",
    tags: ["cok-satan"],
  }),

  /* --------------------------------- Bitki Çayları ------------------------------ */
  tea({
    slug: "nane-limon-cayi",
    name: "Nane Limon Çayı",
    color: "#a7c957",
    color2: "#6a994e",
    image: "/products/nane-limon-cayi.webp",
    brew: "1 tatlı kaşığı / fincan, 90 °C su, 5–7 dk",
    short: "Ferah nane ve kurutulmuş limon dilimleri.",
    description: "Kurutulmuş nane yaprağı ve limon dilimleriyle hazırlanan ferahlatıcı bitki çayı. Kış akşamlarında sıcak, yazın buzlu çay olarak.",
    tags: ["cok-satan"],
  }),
  tea({
    slug: "kusburnu-cayi",
    name: "Kuşburnu Çayı",
    color: "#c1272d",
    color2: "#7a1a1f",
    image: "/products/kusburnu-cayi.webp",
    brew: "1 tatlı kaşığı / fincan, 95 °C su, 7–8 dk",
    short: "C vitamini zengini, hafif ekşi kuşburnu.",
    description: "Kuşburnu, hibiskus ve meyve parçalarıyla kırmızı, hafif ekşi ve dolgun bir çay. Bal ile tatlandırarak servis edin.",
    tags: ["cok-satan"],
  }),
  tea({
    slug: "yesil-cay",
    name: "Yeşil Çay",
    color: "#7a9a3c",
    color2: "#4e6b23",
    image: "/products/yesil-cay.webp",
    brew: "1 tatlı kaşığı / fincan, 75–80 °C su, 2–3 dk",
    short: "Kıvrılmış tane yeşil çay; taze ve hafif.",
    description: "Kıvrılmış tane (gunpowder) yeşil çay. Düşük sıcaklıkta kısa demleme ile acılaşmadan açılan taze, çimensi tat.",
  }),
  tea({
    slug: "hibiskus-cayi",
    name: "Hibiskus Çayı",
    color: "#b8102e",
    color2: "#6b0b1d",
    image: "/products/hibiskus-cayi.webp",
    brew: "1 tatlı kaşığı / fincan, 95 °C su, 5–6 dk",
    short: "Canlı kırmızı, ekşimsi hibiskus yaprakları.",
    description: "Bütün hibiskus (bamya çiçeği) yapraklarından; yakut kırmızısı, ekşimsi ve ferahlatıcı. Buzlu servis için de ideal.",
  }),
  tea({
    slug: "ada-cayi",
    name: "Ada Çayı",
    color: "#9fb08a",
    color2: "#6f8260",
    image: "/products/ada-cayi.webp",
    brew: "1 tatlı kaşığı / fincan, 90 °C su, 5 dk",
    short: "Anadolu ada çayı; yumuşak, aromatik.",
    description: "El toplama, doğal kurutulmuş ada çayı yaprakları. Yumuşak, hafif reçineli aroma; limon ve bal ile.",
  }),
  tea({
    slug: "orman-meyveli-cay",
    name: "Orman Meyveli Çay",
    color: "#8e1b3a",
    color2: "#4c0f22",
    image: "/products/orman-meyveli-cay.webp",
    brew: "1 tatlı kaşığı / fincan, 95 °C su, 6–8 dk",
    short: "Böğürtlen, ahududu, kuşüzümü ve hibiskus.",
    description: "Kurutulmuş orman meyveleri, elma parçaları ve hibiskus ile yoğun meyveli, kırmızı bir çay. Sıcak ve buzlu.",
    tags: ["yeni"],
  }),
  tea({
    slug: "elma-cayi",
    name: "Elma Çayı",
    color: "#d9a441",
    color2: "#a86f1f",
    image: "/products/elma-cayi.webp",
    brew: "2–3 dilim / fincan, 95 °C su, 6–8 dk",
    short: "Kurutulmuş elma dilimleri; tatlı ve hafif.",
    description: "Kurutulmuş elma dilimlerinden doğal, hafif tatlı elma çayı. Tarçın çubuğu ile kış menüsünün klasiği.",
  }),
  tea({
    slug: "ihlamur-cayi",
    name: "Ihlamur",
    color: "#c9b55a",
    color2: "#8f7d2c",
    image: "/products/ihlamur-cayi.webp",
    brew: "1 yemek kaşığı / fincan, 90 °C su, 7–8 dk",
    short: "Çiçekli ve yapraklı ıhlamur; sakinleştirici.",
    description: "Çiçek ve yapraklarıyla birlikte kurutulmuş ıhlamur. Bal ile akşam çayı; kış aylarının vazgeçilmezi.",
    tags: ["cok-satan"],
  }),
  tea({
    slug: "bogurtlen-cayi",
    name: "Böğürtlen Çayı",
    color: "#5b1e3a",
    color2: "#2e0f1f",
    image: "/products/bogurtlen-cayi.webp",
    imageHover: "/products/bogurtlen-cayi-cutout.webp",
    brew: "1 yemek kaşığı / fincan, 95 °C su, 6–8 dk",
    short: "Böğürtlen, hibiskus ve elma parçalı meyve çayı.",
    description: "Kurutulmuş böğürtlen, hibiskus yaprağı ve elma parçalarıyla hazırlanan koyu kırmızı, meyvemsi çay. Sıcak ya da buzlu; şeker gerektirmeyen doğal tatlılık.",
    tags: ["yeni"],
  }),
];

/* -------------------------------------------------------------------------- */
/*  Sorgu yardımcıları                                                        */
/* -------------------------------------------------------------------------- */

const bySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(limit = 8): Product[] {
  const featured = products.filter((p) => p.tags.includes("cok-satan"));
  return featured.slice(0, limit);
}

export function getNewProducts(limit = 4): Product[] {
  return products.filter((p) => p.tags.includes("yeni")).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const same = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug,
  );
  return same.slice(0, limit);
}

export function minPrice(p: Product): number {
  return Math.min(...p.variants.map((x) => x.price));
}

export function getVariant(p: Product, variantId: string) {
  return p.variants.find((x) => x.id === variantId) ?? p.variants[0];
}

/** "Birlikte daha iyi" eşleştirmesi: ürüne en çok yakışan tamamlayıcı ürün ve gerekçesi. */
export function getBundlePartner(product: Product): { partner: Product; reason: string } | null {
  const pick = (slug: string) => (slug !== product.slug ? getProduct(slug) : undefined);
  let partner: Product | undefined;
  let reason = "";
  switch (product.category) {
    case "suruplar":
      partner = pick(product.slug.includes("karamel") ? "karamel-sosu" : product.slug.includes("cikolata") || product.slug.includes("cookies") ? "cikolata-sosu" : "espresso-daily");
      reason = partner?.category === "soslar" ? "Şurup içeride, sos üstte: tam kafe sunumu." : "Latte için şurup ve dengeli bir espresso harmanı.";
      break;
    case "soslar":
      partner = pick(product.slug.includes("cikolata") ? "sicak-cikolata-klasik" : "tuzlu-karamel-surubu");
      reason = "Topping sos ile yanına yakışan içecek bazı.";
      break;
    case "pureler":
      partner = pick("milkshake-vanilya");
      reason = "Püre + milkshake tozu: kremamsı meyveli milkshake.";
      break;
    case "kahve":
      partner = pick("tuzlu-karamel-surubu");
      reason = "Espresso'nun yanına en çok satan aroma: tuzlu karamel.";
      break;
    case "sicak-cikolata":
      partner = pick("findik-surubu");
      reason = "Fındıklı sıcak çikolata için klasik ikili.";
      break;
    case "bitki-cayi":
      partner = pick("limon-surubu");
      reason = "Buzlu çay için demleyin, limon şurubuyla tatlandırın.";
      break;
    case "bar-urunleri":
      partner = pick(product.slug.startsWith("milkshake") ? "cilek-puresi" : product.slug.startsWith("salep") ? "sicak-cikolata-klasik" : "karamel-surubu");
      reason = product.slug.startsWith("milkshake") ? "Milkshake tozu + meyve püresi: gerçek meyveli milkshake." : product.slug.startsWith("salep") ? "Kış menüsünün ikilisi: salep ve sıcak çikolata." : "Karamel sos ve karamel şurubu: tam caramel macchiato.";
      break;
  }
  return partner ? { partner, reason } : null;
}
