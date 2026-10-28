import { test } from "node:test";
import assert from "node:assert/strict";
import { computeOrder, hmacBase64 } from "./worker.js";

const catalog = {
  commerce: { freeShippingThreshold: 1500, shippingFee: 89.9, codFee: 29.9 },
  items: [
    { slug: "karamel-surubu", variantId: "700ml", name: "Karamel Şurubu (700 ml)", price: 329.9, inStock: true },
    { slug: "mango-puresi", variantId: "1kg", name: "Mango Püresi (1 kg)", price: 449.9, inStock: true },
    { slug: "tukenen", variantId: "1kg", name: "Tükenen", price: 10, inStock: false },
  ],
};

test("sepet katalog fiyatlarıyla hesaplanır, stokta olmayan ürün atlanır", () => {
  const o = computeOrder(catalog, [
    { productSlug: "karamel-surubu", variantId: "700ml", quantity: 2 },
    { productSlug: "mango-puresi", variantId: "1kg", quantity: 1 },
    { productSlug: "tukenen", variantId: "1kg", quantity: 5 },
    { productSlug: "yok", variantId: "x", quantity: 1 },
  ]);
  assert.equal(o.lines.length, 2);
  assert.equal(o.subtotal, 1109.7);
  assert.equal(o.shipping, 89.9);
  assert.equal(o.total, 1199.6);
});

test("ücretsiz kargo eşiği uygulanır", () => {
  const o = computeOrder(catalog, [{ productSlug: "mango-puresi", variantId: "1kg", quantity: 4 }]);
  assert.equal(o.shipping, 0);
  assert.equal(o.total, 1799.6);
});

test("HMAC-SHA256 base64 (PayTR imza formatı)", async () => {
  const sig = await hmacBase64("mesaj", "anahtar");
  assert.equal(sig.length, 44);
  assert.notEqual(sig, await hmacBase64("mesaj", "baska"));
});
