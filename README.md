# Umba Coffee — E-Ticaret Sitesi

Şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri satan **Umba Coffee** için
Next.js 16 ile geliştirilmiş, Türkçe, mobil uyumlu e-ticaret sitesi.

## Özellikler

- **Katalog:** 6 ürün grubu, 51 ürün, boy/fiyat varyantları (`src/lib/products.ts`)
- **Listeleme:** arama, kategori ve etiket filtreleri, sıralama (URL ile paylaşılabilir)
- **Ürün sayfası:** boy seçimi, adet, kullanım önerisi, ürün bilgileri, ilgili ürünler, Product JSON-LD
- **Sepet:** tarayıcıda saklanır (localStorage), sekmeler arası senkron, ücretsiz kargo çubuğu
- **Ödeme:** teslimat + fatura (bireysel/kurumsal) formu, Havale/EFT ve Kapıda Ödeme, sunucu tarafı doğrulama (zod), fiyatlar katalogdan yeniden hesaplanır
- **Sipariş sonrası:** sipariş numarası, IBAN bilgileri, WhatsApp ile dekont gönderme, yazdırma
- **Bildirim:** SMTP tanımlanırsa müşteriye ve mağazaya e-posta; her sipariş `data/orders/` altına JSON olarak kaydedilir
- **İçerik sayfaları:** Hakkımızda, Kurumsal & Bayilik (teklif formu), İletişim, SSS (FAQ JSON-LD)
- **Yasal sayfalar:** KVKK, Gizlilik & Çerez, Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu, İptal & İade, Teslimat & Kargo
- **SEO:** sitemap.xml, robots.txt, Open Graph görseli, manifest, canonical adresler
- **Görseller:** Ürün fotoğrafı olmayan ürünler için otomatik vektörel ambalaj çizimi; fotoğraf eklendiğinde otomatik olarak fotoğraf kullanılır

## Teknoloji

Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, lucide-react, zod, nodemailer.

## Yerel çalıştırma

```bash
npm install
cp .env.example .env.local   # değerleri düzenleyin
npm run dev                  # http://localhost:3000
```

Üretim derlemesi:

```bash
npm run build
npm run start
```

Kontroller: `npm run lint` ve `npm run typecheck`.

## Yapılandırma

Tüm iletişim, banka ve yasal bilgiler ortam değişkenleriyle verilir; `.env.example` dosyasını kopyalayıp doldurun.

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canlı alan adı (sitemap, OG, canonical için) |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_ADDRESS` | İletişim bilgileri |
| `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_FACEBOOK` | Sosyal medya bağlantıları |
| `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_MERSIS` | Yasal sayfalarda görünen şirket bilgileri |
| `NEXT_PUBLIC_BANK_NAME`, `NEXT_PUBLIC_BANK_HOLDER`, `NEXT_PUBLIC_IBAN` | Havale/EFT bilgileri |
| `NEXT_PUBLIC_CARD_PAYMENTS` | `true` yapılınca kart ile ödeme seçeneği açılır (entegrasyon gerekir, aşağıya bakın) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Sipariş ve form e-postaları için SMTP |
| `ORDER_NOTIFY_EMAIL` | Yeni sipariş/form bildirimlerinin gideceği adres |
| `ORDERS_DIR` | Sipariş ve form kayıtlarının yazılacağı dizin (varsayılan `./data`) |

Kargo eşiği, kargo ücreti, kapıda ödeme bedeli ve teslimat süresi `src/lib/site.ts` → `commerce` altında.

## Ürünleri düzenleme

- Ürünler `src/lib/products.ts` içinde; her kategori için `syrup()`, `sauce()`, `puree()`, `coffee()`, `hotChocolate()`, `bar()` yardımcıları standart varyant ve özellikleri üretir. Fiyatlar bu yardımcıların içindedir.
- Yeni ürün eklemek için ilgili diziye bir kayıt ekleyin; `slug` benzersiz olmalı.
- **Fotoğraf eklemek için:** görseli `public/products/` altına koyun ve ürüne `image: "/products/dosya.jpg"` alanı ekleyin. Fotoğrafı olmayan ürünlerde vektörel çizim (`ProductArt`) otomatik gösterilir.
- Kategoriler `src/lib/categories.ts` içinde.

## Siparişler nereye gider?

1. `POST /api/orders` formu doğrular, fiyatları katalogdan yeniden hesaplar ve `UMB-YYAAGG-XXXX` formatında numara üretir.
2. Sipariş `data/orders/<no>.json` dosyasına yazılır (dosya sistemi yazılabilir ise; Vercel'de yazılamaz, e-posta kullanın).
3. SMTP tanımlıysa müşteriye onay, mağazaya bildirim e-postası gider.
4. Müşteri sipariş sayfasında IBAN bilgilerini görür ve WhatsApp ile dekont gönderebilir.

İletişim/teklif formları `data/messages.jsonl`, bülten kayıtları `data/newsletter.jsonl` dosyasına eklenir ve e-posta ile iletilir.

## Kart ile ödeme (iyzico / PayTR)

Kart ödemesi için altyapı hazır, entegrasyon yapılmadı. Önerilen adımlar:

1. iyzico veya PayTR'den API anahtarlarını alın.
2. `src/app/api/orders/route.ts` içinde `paymentMethod === "kart"` durumunda sağlayıcıdan ödeme formu/URL alıp yanıtta döndürün; müşteriyi oraya yönlendirin.
3. Sağlayıcının geri dönüş (callback) adresi için `src/app/api/payment/callback/route.ts` oluşturup siparişi "ödendi" olarak işaretleyin.
4. `NEXT_PUBLIC_CARD_PAYMENTS=true` yapın.

## Yayına alma

**Vercel (önerilen):** Depoyu Vercel'e bağlayın, ortam değişkenlerini girin, alan adını ekleyin. Her push otomatik yayınlanır.

**Kendi sunucunuz / Node destekli hosting:**

```bash
npm ci
npm run build
PORT=3000 npm run start
```

PM2 ile: `pm2 start npm --name umba -- start`. Nginx ile 3000 portuna ters vekil (reverse proxy) yapın. Node.js 20.9+ gerekir. Klasik paylaşımlı (PHP) hosting Node çalıştıramaz; bu durumda Vercel ücretsiz planı en pratik seçenektir.

## Yayın öncesi kontrol listesi

- [ ] `.env` değerleri: telefon, WhatsApp, e-posta, adres, IBAN, şirket unvanı, MERSİS
- [ ] Fiyatların ve stok kodlarının gözden geçirilmesi (`src/lib/products.ts`)
- [ ] Ürün fotoğraflarının eklenmesi (isteğe bağlı)
- [ ] Yasal metinlerin (KVKK, mesafeli satış vb.) hukuk danışmanınızca onaylanması
- [ ] SMTP ayarları ile test siparişi
- [ ] Google Search Console'a `https://alanadiniz/sitemap.xml` gönderimi

## Dizin yapısı

```
src/
  app/            sayfalar ve API rotaları
  components/     layout, ürün, sepet, ödeme, form bileşenleri
  lib/            site ayarları, katalog, sepet mantığı, sipariş şeması, e-posta
public/           statik dosyalar (ürün fotoğrafları için public/products/)
```
