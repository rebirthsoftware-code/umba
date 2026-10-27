export type CategorySlug =
  | "bar-urunleri"
  | "soslar"
  | "pureler"
  | "suruplar"
  | "kahve"
  | "sicak-cikolata";

export type ArtKind = "bottle" | "sauce" | "pouch" | "bag" | "tin" | "box";

export type ProductTag =
  | "cok-satan"
  | "yeni"
  | "sekersiz"
  | "vegan"
  | "horeca"
  | "single-origin";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  color: string;
  colorSoft: string;
  art: ArtKind;
  order: number;
}

export interface Variant {
  id: string;
  label: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inStock: boolean;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Ürün görseli için ana renk (ör. meyve/aroma rengi). */
  color: string;
  /** Opsiyonel ikinci renk (gradyan). */
  color2?: string;
  art?: ArtKind;
  /** /public altında gerçek bir fotoğraf varsa buraya yolu yazın: "/products/vanilya.jpg" */
  image?: string;
  short: string;
  description: string;
  highlights: string[];
  usage: string[];
  specs: Spec[];
  variants: Variant[];
  tags: ProductTag[];
}

export interface CartItem {
  productSlug: string;
  variantId: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
  variant: Variant;
  lineTotal: number;
}
