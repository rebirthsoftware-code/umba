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

function syrup(b: Base, opts: { sugarFree?: boolean } = {}): Product {
  const sf = opts.sugarFree ?? false;
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "suruplar",
    art: "bottle",
    highlights: [
      "Doğal aroma, yapay renklendirici içermez",
      "Sıcak ve soğuk içeceklerde çökmeden karışır",
      "Pompa ile porsiyon kontrolü (1 pompa ≈ 10 ml)",
      sf ? "Şeker ilavesiz, düşük kalorili" : "Dengeli tatlılık, baskın olmayan aroma",
    ],
    usage: [
      "Latte / Cappuccino: 20–30 ml",
      "Soğuk kahve ve frappe: 30 ml",
      "Soda ve limonata: 30–40 ml",
      "Kokteyl: 15–20 ml",
    ],
    specs: [
      { label: "Hacim", value: "700 ml cam şişe / 1 L PET" },
      { label: "Raf ömrü", value: "24 ay (açıldıktan sonra 3 ay)" },
      { label: "Saklama", value: "Serin ve kuru yerde, doğrudan güneş ışığından uzak" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: sf
      ? [
          v("700ml", "700 ml", 369.9, `SRP-${code}-SF-700`),
          v("1l", "1 L", 469.9, `SRP-${code}-SF-1000`),
        ]
      : [
          v("700ml", "700 ml", 329.9, `SRP-${code}-700`),
          v("1l", "1 L", 419.9, `SRP-${code}-1000`),
        ],
    tags: [...(b.tags ?? []), ...(sf ? (["sekersiz"] as ProductTag[]) : [])],
    ...b,
  };
}

function sauce(b: Base): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "soslar",
    art: "sauce",
    highlights: [
      "Yoğun kıvam, soğukta bile akışkan",
      "Topping, mocha ve tatlı sosu olarak çok amaçlı",
      "Kolay sıkılabilir şişe, damlatmayan kapak",
      "Isıtmaya gerek olmadan kullanım",
    ],
    usage: [
      "Mocha / White mocha: 25–30 g",
      "Waffle, pankek ve dondurma üzeri: istenilen miktarda",
      "Bardak içi dekorasyon: 5–10 g",
    ],
    specs: [
      { label: "Ağırlık", value: "1 kg sıkılabilir şişe / 3 kg HoReCa bidon" },
      { label: "Raf ömrü", value: "18 ay" },
      { label: "Saklama", value: "Oda sıcaklığında, açıldıktan sonra kapağı kapalı" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [
      v("1kg", "1 kg", 389.9, `SOS-${code}-1000`),
      v("3kg", "3 kg (HoReCa)", 999.9, `SOS-${code}-3000`),
    ],
    tags: b.tags ?? [],
    ...b,
  };
}

function puree(b: Base): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  return {
    category: "pureler",
    art: "pouch",
    highlights: [
      "Yüksek meyve oranı (%70 ve üzeri)",
      "Gerçek meyve parçacıkları ve doğal renk",
      "Smoothie, frozen, limonata ve kokteyl için ideal",
      "Dondurulmuş meyve stoklamaya gerek bırakmaz",
    ],
    usage: [
      "Smoothie: 60–80 g püre + 150 ml süt/yoğurt + buz",
      "Frozen: 80 g püre + 200 g buz, blender",
      "Meyveli soda: 40 g püre + soda + buz",
      "Milkshake: 60 g püre + 2 top dondurma + 150 ml süt",
    ],
    specs: [
      { label: "Ağırlık", value: "1 kg stand-up poşet" },
      { label: "Raf ömrü", value: "12 ay (açıldıktan sonra buzdolabında 15 gün)" },
      { label: "Saklama", value: "Serin ve kuru yerde, açıldıktan sonra 2–6 °C" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [v("1kg", "1 kg", 449.9, `PUR-${code}-1000`)],
    tags: [...(b.tags ?? []), "vegan"],
    ...b,
  };
}

function coffee(
  b: Base & { notes: string; roast: string; origin: string },
  opts: { turkish?: boolean } = {},
): Product {
  const { notes, roast, origin, ...rest } = b;
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  const turkish = opts.turkish ?? false;
  return {
    category: "kahve",
    art: "bag",
    highlights: [
      `Tat notaları: ${notes}`,
      `Kavurma: ${roast}`,
      "Sipariş sonrası taze kavrulur, tek yönlü valfli poşet",
      turkish ? "Geleneksel ince öğütüm" : "Çekirdek veya istenilen öğütümde",
    ],
    usage: turkish
      ? ["Cezve: 7 g kahve + 60 ml su, kısık ateşte", "Türk kahvesi makinesi: 1 ölçek"]
      : [
          "Espresso: 18 g kahve → 36 g espresso, 25–30 sn",
          "Filtre / V60: 15 g kahve → 250 ml su",
          "French press: 30 g kahve → 500 ml su, 4 dk",
        ],
    specs: [
      { label: "Menşei", value: origin },
      { label: "Kavurma", value: roast },
      { label: "Ambalaj", value: turkish ? "100 g / 500 g valfli poşet" : "250 g / 1 kg valfli poşet" },
      { label: "Raf ömrü", value: "12 ay (en iyi tüketim: kavurmadan sonra 2 ay)" },
    ],
    variants: turkish
      ? [
          v("100g", "100 g", 129.9, `KHV-${code}-100`),
          v("500g", "500 g", 499.9, `KHV-${code}-500`),
        ]
      : [
          v("250g", "250 g", 349.9, `KHV-${code}-250`),
          v("1kg", "1 kg", 1149.9, `KHV-${code}-1000`),
        ],
    tags: rest.tags ?? [],
    ...rest,
  };
}

function hotChocolate(b: Base, opts: { sachets?: boolean } = {}): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  const sachets = opts.sachets ?? false;
  return {
    category: "sicak-cikolata",
    art: sachets ? "box" : "tin",
    highlights: [
      "Yüksek kakao oranı, gerçek çikolata tadı",
      "Süt veya su ile hazırlanabilir",
      "Topaklanmayan, kolay çözünen toz",
      "Kafe standardında kıvam ve parlaklık",
    ],
    usage: sachets
      ? ["1 poşet (25 g) + 150 ml sıcak süt, karıştırın"]
      : [
          "Sıcak çikolata: 30 g toz + 180 ml sıcak süt",
          "Soğuk çikolata: 30 g toz + 100 ml süt, buz ile blender",
          "Mocha: 15 g toz + 1 shot espresso + süt",
        ],
    specs: [
      { label: "Ambalaj", value: sachets ? "20 × 25 g tek kullanımlık poşet" : "1 kg teneke kutu" },
      { label: "Raf ömrü", value: "18 ay" },
      { label: "Alerjen", value: "Süt içerir; fındık ve soya izleri bulunabilir" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: sachets
      ? [v("20x25g", "20 × 25 g kutu", 299.9, `SCK-${code}-BOX`)]
      : [
          v("1kg", "1 kg", 489.9, `SCK-${code}-1000`),
          v("3kg", "3 kg (HoReCa)", 1299.9, `SCK-${code}-3000`),
        ],
    tags: b.tags ?? [],
    ...b,
  };
}

function bar(b: Base, opts: { liquid?: boolean } = {}): Product {
  const code = b.slug.replace(/-/g, "").slice(0, 8).toUpperCase();
  const liquid = opts.liquid ?? false;
  return {
    category: "bar-urunleri",
    art: liquid ? "bottle" : "tin",
    highlights: liquid
      ? [
          "Konsantre formül, 1 litre ile 8–10 litre içecek",
          "Buzlu servis için dengelenmiş tatlılık",
          "Pompa ile hızlı ve ölçülü servis",
          "Yapay renklendirici içermez",
        ]
      : [
          "Soğuk sütle bile topaklanmadan çözünür",
          "Hızlı servis için tek adımda hazırlık",
          "Tutarlı lezzet, her bardakta aynı sonuç",
          "Ekonomik 1 kg ambalaj",
        ],
    usage: liquid
      ? ["1 ölçek (100 ml) konsantre + 800 ml su + buz", "Soda ile: 40 ml konsantre + 200 ml soda"]
      : ["1 bardak: 35–40 g toz + 150 ml süt", "Frappe: 40 g toz + 150 ml süt + buz, blender"],
    specs: [
      { label: "Ambalaj", value: liquid ? "1 L PET şişe" : "1 kg teneke kutu" },
      { label: "Raf ömrü", value: liquid ? "12 ay" : "18 ay" },
      { label: "Saklama", value: "Serin ve kuru yerde" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: liquid
      ? [v("1l", "1 L", 359.9, `BAR-${code}-1000`)]
      : [
          v("1kg", "1 kg", 429.9, `BAR-${code}-1000`),
          v("3kg", "3 kg (HoReCa)", 1149.9, `BAR-${code}-3000`),
        ],
    tags: b.tags ?? [],
    ...b,
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
    slug: "vanilya-surubu",
    name: "Vanilya Şurubu",
    color: "#e9c98a",
    color2: "#c99a4d",
    short: "Yumuşak, kremamsı vanilya; her lattenin klasiği.",
    description:
      "Madagaskar vanilyası esintisiyle hazırlanan Vanilya Şurubu, kahvenin acılığını kırmadan yuvarlak ve sıcak bir tat katar. Vanilla latte, soğuk kahve ve milkshake'lerin vazgeçilmezi.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "karamel-surubu",
    name: "Karamel Şurubu",
    color: "#d9892c",
    color2: "#a85f12",
    short: "Yanık şeker notalarıyla derin, sıcak karamel.",
    description:
      "Kafe menülerinin en çok satan aroması. Karamel Şurubu; caramel macchiato, frappe ve soğuk kahvelerde yoğun ve dengeli bir tatlılık sağlar.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "findik-surubu",
    name: "Fındık Şurubu",
    color: "#b67c4a",
    color2: "#7a4a22",
    short: "Kavrulmuş fındığın sıcak, hafif tatlı aroması.",
    description:
      "Kavrulmuş Karadeniz fındığının karakterini taşıyan Fındık Şurubu, özellikle sütlü kahvelerde ve sıcak çikolatada öne çıkar.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "cikolata-surubu",
    name: "Çikolata Şurubu",
    color: "#5a3222",
    color2: "#2e170e",
    short: "Yoğun kakao, mocha için ideal akışkanlık.",
    description:
      "Gerçek kakao ile hazırlanan Çikolata Şurubu; mocha, soğuk çikolata ve soda bazlı içeceklerde çökmeden karışır.",
  }),
  syrup({
    slug: "beyaz-cikolata-surubu",
    name: "Beyaz Çikolata Şurubu",
    color: "#f3e6cf",
    color2: "#d9c39c",
    short: "Kremamsı, tatlı beyaz çikolata lezzeti.",
    description:
      "White mocha ve tatlı kahvelerin yıldızı. Beyaz Çikolata Şurubu, süt bazlı içeceklere ipeksi bir doku kazandırır.",
  }),
  syrup({
    slug: "cilek-surubu",
    name: "Çilek Şurubu",
    color: "#e0484f",
    color2: "#a81f2c",
    short: "Taze çilek aroması; soda ve limonatalarda canlı renk.",
    description:
      "Yaz menülerinin olmazsa olmazı. Çilek Şurubu, meyveli sodalar, limonatalar ve milkshake'lerde parlak renk ve taze meyve tadı sunar.",
    tags: ["cok-satan"],
  }),
  syrup({
    slug: "mango-surubu",
    name: "Mango Şurubu",
    color: "#f4a622",
    color2: "#e2731a",
    short: "Tropik mango; frozen ve ice tea için.",
    description:
      "Olgun mango aromasıyla hazırlanan Mango Şurubu, soğuk çaylarda, frozenlarda ve alkolsüz kokteyllerde tropik bir karakter verir.",
  }),
  syrup({
    slug: "yesil-elma-surubu",
    name: "Yeşil Elma Şurubu",
    color: "#9ccb4a",
    color2: "#5f9a1f",
    short: "Ekşimsi, ferahlatıcı yeşil elma.",
    description:
      "Granny Smith elmasının ekşimsi ferahlığı. Yeşil Elma Şurubu; soda, mojito ve soğuk çaylarda ağızda kalan canlı bir tat bırakır.",
  }),
  syrup({
    slug: "hindistan-cevizi-surubu",
    name: "Hindistan Cevizi Şurubu",
    color: "#f1ebe1",
    color2: "#cdbfa8",
    short: "Tropik, kremamsı hindistan cevizi.",
    description:
      "Soğuk kahve ve pina colada tarzı içeceklerde yumuşak, tropik bir tat. Süt bazlı içeceklerle mükemmel uyum.",
  }),
  syrup({
    slug: "tarcin-surubu",
    name: "Tarçın Şurubu",
    color: "#b8623b",
    color2: "#7d3a1c",
    short: "Sıcak baharat notaları; kış menülerinin favorisi.",
    description:
      "Seylan tarçınının sıcak, hafif tatlı aroması. Chai latte, cappuccino ve sıcak elma suyunda kış dokunuşu.",
  }),
  syrup({
    slug: "irish-cream-surubu",
    name: "Irish Cream Şurubu",
    color: "#c9a27a",
    color2: "#8f6a46",
    short: "Kremamsı, hafif karamelli Irish cream.",
    description:
      "Alkolsüz Irish cream aroması; kahve ve sıcak çikolataya zengin, kremamsı bir derinlik katar.",
  }),
  syrup({
    slug: "toffee-nut-surubu",
    name: "Toffee Nut Şurubu",
    color: "#c58a3b",
    color2: "#8b5a1a",
    short: "Tereyağlı karamel ve kavrulmuş kuruyemiş.",
    description:
      "Tereyağlı toffee ile kavrulmuş kuruyemişin buluşması. Sezonluk latte menüleri için güçlü bir seçim.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "lavanta-surubu",
    name: "Lavanta Şurubu",
    color: "#a98bd0",
    color2: "#7458a8",
    short: "Çiçeksi, zarif lavanta; limonata ve latte için.",
    description:
      "Hafif çiçeksi lavanta aroması, özellikle limonata ve honey-lavender latte tariflerinde fark yaratır. Dozaj hassasiyeti için pompa önerilir.",
    tags: ["yeni"],
  }),
  syrup({
    slug: "blue-curacao-surubu",
    name: "Blue Curaçao Şurubu",
    color: "#2f8fe0",
    color2: "#1b5fb0",
    short: "Portakal kabuğu aromalı, canlı mavi.",
    description:
      "Alkolsüz Blue Curaçao; mavi limonata, lagoon ve yaz kokteyllerinde çarpıcı renk ve turunçgil aroması.",
  }),
  syrup(
    {
      slug: "sekersiz-vanilya-surubu",
      name: "Şekersiz Vanilya Şurubu",
      color: "#e4d2b3",
      color2: "#b99c6c",
      short: "Şeker ilavesiz, aynı vanilya karakteri.",
      description:
        "Tatlandırıcı ile hazırlanan Şekersiz Vanilya Şurubu, kalori hassasiyeti olan müşteriler için klasik vanilya tadını korur.",
    },
    { sugarFree: true },
  ),
  syrup(
    {
      slug: "sekersiz-karamel-surubu",
      name: "Şekersiz Karamel Şurubu",
      color: "#d79a4e",
      color2: "#a06621",
      short: "Şeker ilavesiz karamel; düşük kalorili.",
      description:
        "Şeker ilavesiz formülüyle Karamel Şurubu'nun tüm sıcaklığını sunar. Fit menüler ve diyabetik müşteriler için.",
    },
    { sugarFree: true },
  ),

  /* ----------------------------------- Soslar ---------------------------------- */
  sauce({
    slug: "cikolata-sosu",
    name: "Çikolata Sosu",
    color: "#4a2a1a",
    color2: "#24120a",
    short: "Yoğun kakaolu, parlak çikolata sosu.",
    description:
      "Mocha, sıcak çikolata ve topping kullanımı için yüksek kakaolu Çikolata Sosu. Soğukta bile akışkan kalır, bardak içi dekorasyonda parlak görünüm verir.",
    tags: ["cok-satan"],
  }),
  sauce({
    slug: "beyaz-cikolata-sosu",
    name: "Beyaz Çikolata Sosu",
    color: "#f4e9d6",
    color2: "#d8c6a5",
    short: "Kremamsı beyaz çikolata; white mocha için.",
    description:
      "Süt ve beyaz çikolata tadı ön planda. White mocha, frappe ve waffle üstü için ipeksi kıvam.",
  }),
  sauce({
    slug: "karamel-sosu",
    name: "Karamel Sosu",
    color: "#d08437",
    color2: "#9a5a16",
    short: "Yoğun, tereyağlı karamel topping.",
    description:
      "Caramel macchiato'nun üstündeki o çizgiler bu sosla çekilir. Tereyağlı, yoğun ve parlak Karamel Sosu, tatlılarda da topping olarak kullanılır.",
    tags: ["cok-satan"],
  }),
  sauce({
    slug: "tuzlu-karamel-sosu",
    name: "Tuzlu Karamel Sosu",
    color: "#c1762d",
    color2: "#8a4f12",
    short: "Deniz tuzuyla dengelenmiş karamel.",
    description:
      "Deniz tuzu kristalleriyle dengelenen tatlılık. Salted caramel latte, dondurma ve cheesecake üzeri için.",
    tags: ["yeni"],
  }),
  sauce({
    slug: "findik-sosu",
    name: "Fındık Sosu",
    color: "#8c5a34",
    color2: "#5a3418",
    short: "Kakao-fındık kreması kıvamında sos.",
    description:
      "Kavrulmuş fındık ve kakao ile hazırlanan yoğun Fındık Sosu. Sütlü kahve, crepe ve waffle'da tam uyum.",
  }),
  sauce({
    slug: "cilek-sosu",
    name: "Çilek Sosu",
    color: "#d8353f",
    color2: "#951722",
    short: "Meyve parçacıklı çilek topping sosu.",
    description:
      "Meyve parçacıklı Çilek Sosu; cheesecake, pankek ve milkshake üzerinde canlı renk ve meyve dokusu sunar.",
  }),

  /* ----------------------------------- Püreler --------------------------------- */
  puree({
    slug: "cilek-puresi",
    name: "Çilek Püresi",
    color: "#b4232f",
    color2: "#7a1420",
    image: "/products/cilek-puresi.webp",
    short: "Yüksek meyveli çilek; smoothie ve frozen bazı.",
    description:
      "Olgun çileklerden hazırlanan, gerçek meyve parçacıklı çilek püresi. Smoothie, frozen, milkshake ve çilekli limonata için; damlatmayan dozaj kapaklı 1 L şişede.",
    tags: ["cok-satan"],
    specs: [
      { label: "Etiket adı", value: "Çilek Aromalı Meyveli Sos (Strawberry Fruity Sauce)" },
      { label: "Ambalaj", value: "1 L dozaj kapaklı şişe" },
      { label: "Raf ömrü", value: "12 ay (açıldıktan sonra buzdolabında 15 gün)" },
      { label: "Saklama", value: "Serin ve kuru yerde, açıldıktan sonra 2–6 °C" },
      { label: "Menşei", value: "Türkiye" },
    ],
    variants: [{ id: "1l", label: "1 L", price: 449.9, sku: "PUR-CILEKPUR-1000", inStock: true }],
  }),
  puree({
    slug: "mango-puresi",
    name: "Mango Püresi",
    color: "#f7a51c",
    color2: "#e06f12",
    short: "Alphonso mango; yoğun tropik tat.",
    description:
      "Alphonso mangosundan hazırlanan kıvamlı püre. Mango frozen, lassi ve smoothie bowl'larda altın sarısı renk ve tropik aroma.",
    tags: ["cok-satan"],
  }),
  puree({
    slug: "orman-meyveleri-puresi",
    name: "Orman Meyveleri Püresi",
    color: "#6a2c6e",
    color2: "#3d1442",
    short: "Böğürtlen, ahududu ve yaban mersini karışımı.",
    description:
      "Böğürtlen, ahududu, frenk üzümü ve yaban mersini karışımı. Ekşimsi, derin ve mor; smoothie ve soda için.",
  }),
  puree({
    slug: "seftali-puresi",
    name: "Şeftali Püresi",
    color: "#f3a56f",
    color2: "#d8732f",
    short: "Bursa şeftalisi; ice tea ve bellini için.",
    description:
      "Bursa şeftalisinin yumuşak tatlılığı. Şeftalili soğuk çay, smoothie ve alkolsüz bellini için ideal.",
  }),
  puree({
    slug: "ananas-puresi",
    name: "Ananas Püresi",
    color: "#f2cd3c",
    color2: "#d29b17",
    short: "Tropik, ekşimsi-tatlı ananas.",
    description:
      "Taze ananasın ekşimsi-tatlı dengesi. Pina colada, tropik smoothie ve meyveli sodalarda.",
  }),
  puree({
    slug: "yesil-elma-puresi",
    name: "Yeşil Elma Püresi",
    color: "#a6d35a",
    color2: "#6aa52a",
    short: "Ferah, ekşimsi yeşil elma.",
    description:
      "Yeşil elmanın ferahlığı; elmalı limonata ve smoothie'lerde canlı yeşil renk ve ekşimsi tat.",
  }),
  puree({
    slug: "karpuz-puresi",
    name: "Karpuz Püresi",
    color: "#f0566a",
    color2: "#c32b45",
    short: "Yazın en çok satanı; frozen ve limonata.",
    description:
      "Karpuzun serinletici tadını yıl boyu menünüzde tutun. Karpuz frozen ve karpuzlu limonata için.",
    tags: ["yeni"],
  }),
  puree({
    slug: "carkifelek-puresi",
    name: "Çarkıfelek (Passion Fruit) Püresi",
    color: "#e8a12f",
    color2: "#b96d0f",
    short: "Çekirdekli, ekşi-aromatik passion fruit.",
    description:
      "Çekirdekleriyle birlikte hazırlanan Çarkıfelek Püresi; passion fruit mojito, soda ve smoothie'lerde egzotik bir karakter.",
  }),

  /* ------------------------------------ Kahve ---------------------------------- */
  coffee({
    slug: "umba-signature-espresso",
    name: "Umba Signature Espresso Harmanı",
    color: "#3d2a1e",
    color2: "#1c110a",
    notes: "Bitter çikolata, karamel, fındık",
    roast: "Orta-koyu",
    origin: "Brezilya, Kolombiya, Etiyopya harmanı",
    short: "Dengeli gövde, kremamsı crema; kafe espresso'su.",
    description:
      "Umba'nın imza harmanı. Sütlü içeceklerde kaybolmayan gövde, espresso'da çikolata ve karamel notaları. Kafelerin günlük iş atı.",
    tags: ["cok-satan"],
  }),
  coffee({
    slug: "brezilya-santos",
    name: "Brezilya Santos",
    color: "#6b4a30",
    color2: "#3a2616",
    notes: "Fındık, sütlü çikolata, düşük asidite",
    roast: "Orta",
    origin: "Brezilya – Minas Gerais",
    short: "Yumuşak, düşük asiditeli günlük kahve.",
    description:
      "Minas Gerais bölgesinden doğal işlenmiş Santos çekirdekleri. Yumuşak gövde ve fındık notalarıyla filtre ve espresso için uyumlu.",
    tags: ["single-origin"],
  }),
  coffee({
    slug: "kolombiya-supremo",
    name: "Kolombiya Supremo",
    color: "#7d3f2a",
    color2: "#45200f",
    notes: "Kırmızı meyve, karamel, parlak asidite",
    roast: "Orta",
    origin: "Kolombiya – Huila",
    short: "Parlak, meyvemsi; filtre kahvede öne çıkar.",
    description:
      "Huila bölgesinin yüksek rakımlı Supremo çekirdekleri. Kırmızı meyve ve karamel notaları, canlı asidite. V60 ve Chemex için ideal.",
    tags: ["single-origin"],
  }),
  coffee({
    slug: "etiyopya-yirgacheffe",
    name: "Etiyopya Yirgacheffe",
    color: "#9a5f3b",
    color2: "#5c3518",
    notes: "Yasemin, bergamot, limon",
    roast: "Açık-orta",
    origin: "Etiyopya – Yirgacheffe",
    short: "Çiçeksi ve narenciyeli; üçüncü dalga favorisi.",
    description:
      "Yıkanmış Yirgacheffe; çiçeksi aroması ve çay benzeri gövdesiyle demleme kahve severlerin favorisi.",
    tags: ["single-origin", "yeni"],
  }),
  coffee({
    slug: "filtre-kahve-harmani",
    name: "Filtre Kahve Harmanı",
    color: "#5a3b26",
    color2: "#2e1c10",
    notes: "Kakao, kuru meyve, dengeli",
    roast: "Orta",
    origin: "Latin Amerika harmanı",
    short: "Tüm gün içilebilir, dengeli filtre harmanı.",
    description:
      "Filtre kahve makineleri ve toplu demleme için geliştirilen dengeli harman. Sabahtan akşama tutarlı tat.",
  }),
  coffee({
    slug: "decaf-espresso",
    name: "Kafeinsiz Espresso",
    color: "#8a6b55",
    color2: "#54402f",
    notes: "Sütlü çikolata, badem",
    roast: "Orta-koyu",
    origin: "Kolombiya – Swiss Water kafeinsizleştirme",
    short: "Swiss Water yöntemiyle, tadından ödün vermeden.",
    description:
      "Kimyasal kullanılmadan Swiss Water yöntemiyle kafeinsizleştirilmiş Kolombiya çekirdekleri. Geç saat kahveleri için.",
  }),
  coffee(
    {
      slug: "turk-kahvesi",
      name: "Umba Türk Kahvesi",
      color: "#4a2f1f",
      color2: "#22130b",
      notes: "Yoğun, bol köpüklü, hafif kakaolu",
      roast: "Orta-koyu, geleneksel",
      origin: "Brezilya – Orta Amerika harmanı",
      short: "Bol köpüklü, geleneksel ince öğütüm.",
      description:
        "Taş değirmende ince öğütülmüş, geleneksel kavrumlu Türk kahvesi. Bol köpüğü ve yoğun gövdesiyle her fincanda ikram standardı.",
      tags: ["cok-satan"],
    },
    { turkish: true },
  ),

  /* -------------------------------- Sıcak Çikolata ------------------------------ */
  hotChocolate({
    slug: "klasik-sicak-cikolata",
    name: "Klasik Sıcak Çikolata",
    color: "#5b2f1f",
    color2: "#2e150c",
    short: "Kıvamlı, sütlü, kafe standardı sıcak çikolata.",
    description:
      "Umba'nın en çok satan sıcak çikolatası. Sütlü, kıvamlı ve dengeli tatlılıkta; süt veya suyla hazırlanabilir.",
    tags: ["cok-satan"],
  }),
  hotChocolate({
    slug: "bitter-sicak-cikolata",
    name: "Bitter %54 Sıcak Çikolata",
    color: "#2d1710",
    color2: "#140906",
    short: "%54 kakaolu, daha az tatlı, yoğun.",
    description:
      "Yüksek kakao oranı ve düşük şekeriyle gerçek çikolata severler için. Bitter notalar, yoğun kıvam.",
  }),
  hotChocolate({
    slug: "beyaz-sicak-cikolata",
    name: "Beyaz Sıcak Çikolata",
    color: "#f2e5cf",
    color2: "#d2bd98",
    short: "Kremamsı, vanilyalı beyaz çikolata.",
    description:
      "Vanilya notalı, kremamsı Beyaz Sıcak Çikolata. Üzerine karamel sosu ile kış menülerinin imza içeceği.",
  }),
  hotChocolate({
    slug: "findikli-sicak-cikolata",
    name: "Fındıklı Sıcak Çikolata",
    color: "#7a4a2b",
    color2: "#452713",
    short: "Kavrulmuş fındık ile zengin sıcak çikolata.",
    description:
      "Klasik sıcak çikolataya kavrulmuş fındık aroması eşlik ediyor. Çocukların ve yetişkinlerin ortak favorisi.",
  }),
  hotChocolate({
    slug: "karamelli-sicak-cikolata",
    name: "Karamelli Sıcak Çikolata",
    color: "#a0602a",
    color2: "#633812",
    short: "Karamel notalı, tatlı ve yumuşak.",
    description:
      "Karamelin sıcaklığı ile çikolatanın yoğunluğu bir arada. Krem şanti ve karamel sosu ile servis edin.",
    tags: ["yeni"],
  }),
  hotChocolate(
    {
      slug: "tek-kullanimlik-sicak-cikolata",
      name: "Tek Kullanımlık Sıcak Çikolata (20 × 25 g)",
      color: "#5b2f1f",
      color2: "#2e150c",
      short: "Pratik porsiyon poşetler; ofis ve ev için.",
      description:
        "Klasik Sıcak Çikolata'nın 25 gramlık tek kullanımlık poşetleri. Ofis, otel odası ve ev kullanımı için pratik.",
    },
    { sachets: true },
  ),

  /* --------------------------------- Bar Ürünleri ------------------------------- */
  bar({
    slug: "vanilya-frappe-tozu",
    name: "Vanilya Frappe Tozu",
    color: "#e8d5a8",
    color2: "#c7a86a",
    short: "Kremamsı, buzlu frappe bazı.",
    description:
      "Soğuk sütle bile kolay çözünen Vanilya Frappe Tozu. Espresso ekleyerek kahveli, şurup ekleyerek meyveli frappe'lere baz oluşturur.",
    tags: ["cok-satan"],
  }),
  bar({
    slug: "cikolata-frappe-tozu",
    name: "Çikolata Frappe Tozu",
    color: "#5a3626",
    color2: "#301a10",
    short: "Kakaolu frappe ve milkshake bazı.",
    description:
      "Yoğun kakaolu Çikolata Frappe Tozu; milkshake, frappe ve soğuk çikolata için tek adımda hazırlık.",
  }),
  bar({
    slug: "chai-latte-tozu",
    name: "Chai Latte Tozu",
    color: "#c48a4f",
    color2: "#8a5a28",
    short: "Tarçın, kakule ve zencefilli baharatlı çay.",
    description:
      "Siyah çay, tarçın, kakule, zencefil ve karanfil. Sütle hazırlanan Chai Latte Tozu, kış menülerinin aromatik yıldızı.",
    tags: ["cok-satan"],
  }),
  bar({
    slug: "salep",
    name: "Salep",
    color: "#f1e6d2",
    color2: "#d4bf9c",
    short: "Geleneksel, kıvamlı kış içeceği.",
    description:
      "Gerçek salep aromalı, kıvam verici içerikli Salep tozu. Sütle pişirilerek hazırlanır, tarçınla servis edilir.",
  }),
  bar({
    slug: "matcha-latte-tozu",
    name: "Matcha Latte Tozu",
    color: "#86b04a",
    color2: "#4f7a23",
    short: "Japon yeşil çayı; iced matcha latte için.",
    description:
      "Tatlandırılmış matcha tozu; soğuk veya sıcak sütle canlı yeşil renkte matcha latte. Sade matcha için öğütülmüş çay oranı yüksek tutuldu.",
    tags: ["yeni"],
  }),
  bar({
    slug: "golden-latte-tozu",
    name: "Zerdeçallı Golden Latte Tozu",
    color: "#e6a722",
    color2: "#b87a0c",
    short: "Zerdeçal, zencefil ve karabiberli altın süt.",
    description:
      "Zerdeçal, zencefil, tarçın ve bir tutam karabiber. Kafeinsiz, ısıtan bir alternatif: Golden Latte.",
  }),
  bar(
    {
      slug: "seftalili-soguk-cay-konsantresi",
      name: "Şeftalili Soğuk Çay Konsantresi",
      color: "#e89a4a",
      color2: "#b5641e",
      short: "1 litre ile 10 litre ice tea.",
      description:
        "Demlenmiş siyah çay ve şeftali aromasıyla hazırlanan konsantre. Su ve buzla karıştırın, dakikalar içinde kafe standardında soğuk çay.",
      tags: ["cok-satan"],
    },
    { liquid: true },
  ),
  bar(
    {
      slug: "limonata-konsantresi",
      name: "Limonata Konsantresi",
      color: "#f3df4a",
      color2: "#d8b91a",
      short: "Gerçek limon suyu ile ev usulü limonata.",
      description:
        "Gerçek limon suyu ve limon kabuğu ile hazırlanan konsantre. Nane ve çilek püresiyle çeşitlendirilebilir.",
    },
    { liquid: true },
  ),
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
      partner = pick(product.slug.includes("karamel") ? "karamel-sosu" : product.slug.includes("cikolata") ? "cikolata-sosu" : "umba-signature-espresso");
      reason = partner?.category === "soslar" ? "Şurup içeride, sos üstte: tam kafe sunumu." : "Latte için şurup ve dengeli bir espresso harmanı.";
      break;
    case "soslar":
      partner = pick(product.slug.includes("cikolata") ? "klasik-sicak-cikolata" : "vanilya-surubu");
      reason = "Topping sos ile yanına yakışan içecek bazı.";
      break;
    case "pureler":
      partner = pick("limonata-konsantresi");
      reason = "Meyveli limonata ve frozen için püre + limonata konsantresi.";
      break;
    case "kahve":
      partner = pick("vanilya-surubu");
      reason = "Espresso'nun yanına en çok satan aroma: vanilya.";
      break;
    case "sicak-cikolata":
      partner = pick("findik-surubu");
      reason = "Fındıklı sıcak çikolata için klasik ikili.";
      break;
    case "bitki-cayi":
      partner = pick(product.slug === "limonata-konsantresi" ? "nane-limon-cayi" : "limonata-konsantresi");
      reason = "Buzlu çay için demleyin, limonata konsantresiyle tamamlayın.";
      break;
    case "bar-urunleri":
      partner = pick(product.slug.includes("frappe") ? "karamel-sosu" : product.slug.includes("konsantre") ? "cilek-puresi" : "vanilya-frappe-tozu");
      reason = "Bar ürününüzü çeşitlendirecek tamamlayıcı.";
      break;
  }
  return partner ? { partner, reason } : null;
}
