import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "suruplar",
    name: "Şuruplar",
    tagline: "Latte, soda ve kokteyller için aroma şurupları",
    description:
      "Doğal aromalarla hazırlanan, sıcak ve soğuk içeceklerde dengeli tat veren bar şurupları. 700 ml cam şişe ve 1 litre ekonomik seçenekleriyle.",
    color: "#d08f2e",
    colorSoft: "#fbf0dc",
    art: "bottle",
    order: 1,
  },
  {
    slug: "soslar",
    name: "Soslar",
    tagline: "Yoğun kıvamlı topping ve içecek sosları",
    description:
      "Kahve, waffle, pankek ve tatlılarda kullanılan yoğun çikolata, karamel ve fındık sosları. Kolay akışkan şişe ile pratik kullanım.",
    color: "#6b3e26",
    colorSoft: "#f1e5dc",
    art: "sauce",
    order: 2,
  },
  {
    slug: "pureler",
    name: "Püreler",
    tagline: "Gerçek meyve ile smoothie ve frozen bazları",
    description:
      "Yüksek meyve oranlı, katkısız kıvamlı püreler. Smoothie, frozen, limonata ve kokteyllerde gerçek meyve lezzeti.",
    color: "#d9484f",
    colorSoft: "#fde6e7",
    art: "pouch",
    order: 3,
  },
  {
    slug: "kahve",
    name: "Kahve",
    tagline: "Taze kavrulmuş çekirdek ve öğütülmüş kahveler",
    description:
      "Seçilmiş çekirdeklerden küçük partiler hâlinde kavrulan espresso harmanları, single origin kahveler ve Türk kahvesi.",
    color: "#3d2a1e",
    colorSoft: "#efe6dd",
    art: "bag",
    order: 4,
  },
  {
    slug: "sicak-cikolata",
    name: "Sıcak Çikolata",
    tagline: "Kıvamlı, gerçek kakaolu sıcak çikolatalar",
    description:
      "Yüksek kakao oranlı, süt veya suyla hazırlanabilen sıcak çikolata tozları. Kafe standardında kıvam ve parlaklık.",
    color: "#4a2318",
    colorSoft: "#efdfd8",
    art: "tin",
    order: 5,
  },
  {
    slug: "bar-urunleri",
    name: "Bar Ürünleri",
    tagline: "Frappe, chai, salep, matcha ve konsantreler",
    description:
      "Kafe barının vazgeçilmezleri: frappe tozları, chai latte, salep, matcha ve soğuk içecek konsantreleri. Hızlı servis, tutarlı lezzet.",
    color: "#2f6f5e",
    colorSoft: "#e1efea",
    art: "tin",
    order: 6,
  },
  {
    slug: "bitki-cayi",
    name: "Bitki Çayları",
    image: "/categories/bitki-cayi.webp",
    tagline: "Doğal meyve ve bitki çayları, kilitli poşette",
    description:
      "Ümba Premium serisi meyve ve bitki çayları: nane limon, kuşburnu, hibiskus, ıhlamur, ada çayı, yeşil çay, elma ve orman meyveli. Katkısız, pencereli kilitli poşetlerde.",
    color: "#5c8a3c",
    colorSoft: "#e6efdc",
    art: "pouch",
    order: 7,
  },
];

export const categoryMap: Record<CategorySlug, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
