# Umba Coffee — E-Ticaret Sitesi

Şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri satan **Umba Coffee** için
Next.js 16 ile geliştirilmiş, Türkçe, mobil uyumlu e-ticaret sitesi.

## Özellikler

- **Katalog:** 7 ürün grubu (şurup, dekor sos, püre, kahve, sıcak çikolata, bar ürünleri, bitki çayı), boy/fiyat varyantları (`src/lib/products.ts`)
- **Listeleme:** anında arama, kategori ve etiket filtreleri, sıralama (URL ile paylaşılabilir)
- **Ürün sayfası:** boy seçimi, adet, kullanım önerisi, ürün bilgileri, ilgili ürünler, Product JSON-LD
- **Sepet:** tarayıcıda saklanır (localStorage), sekmeler arası senkron, ücretsiz kargo çubuğu
- **Ödeme:** teslimat + fatura (bireysel/kurumsal) formu; Kredi kartı (PayTR, 3D Secure), Havale/EFT ve Kapıda Ödeme; fiyatlar sunucuda katalogdan hesaplanır
- **Sipariş sistemi:** siparişler veritabanına yazılır; `/yonetim` panelinden durum (Onaylandı → Hazırlanıyor → Kargoya verildi → Teslim edildi), kargo takip numarası ve notlar yönetilir; müşteri `/siparis-takip` sayfasından üyeliksiz takip eder
- **Ana sayfa:** temalı hero slider, kaydırmaya bağlı fotoğraflı kahve hikâyesi, bitki çayları bölümü, ürün kartlarında hover görseli ve yuvarlanan fiyat
- **İçerik sayfaları:** Hakkımızda, Kurumsal & Bayilik (teklif formu), İletişim (iki WhatsApp hattı), SSS (FAQ JSON-LD)
- **Yasal sayfalar:** KVKK, Gizlilik & Çerez, Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu, İptal & İade, Teslimat & Kargo
- **SEO:** sitemap.xml, robots.txt, Open Graph görseli, manifest, canonical adresler

## Teknoloji

Next.js 16 (App Router, Route Handlers), React 19, TypeScript, Tailwind CSS v4, lucide-react, zod, libSQL/Turso (sipariş veritabanı). Yayın: **Vercel** (umbagida.com).

## Yerel çalıştırma

```bash
npm install
cp .env.example .env.local   # değerleri düzenleyin; yerel veritabanı için DATABASE_URL=file:./data/umba.db
mkdir -p data
npm run dev                  # http://localhost:3000
```

Üretim derlemesi ve API testleri:

```bash
npm run build && npm start
BASE=http://localhost:3000 npm run test:api
```

## Yayın: Vercel + umbagida.com

1. Vercel'de projeyi GitHub deposuna bağlayın (her push otomatik yayınlanır). Framework: Next.js, ek ayar gerekmez.
2. **Veritabanı:** Vercel → Storage (Marketplace) → **Turso** ekleyin; `TURSO_DATABASE_URL` ve `TURSO_AUTH_TOKEN` projeye otomatik gelir. Tablolar ilk istekte kendiliğinden oluşur.
3. **Ortam değişkenleri** (Settings → Environment Variables; liste `.env.example` içinde):
   - `ADMIN_PASSWORD` – yönetim paneli şifresi
   - `PAYTR_MERCHANT_ID`, `PAYTR_MERCHANT_KEY`, `PAYTR_MERCHANT_SALT` – PayTR mağaza paneli → Bilgi
   - `PAYTR_TEST_MODE` – `1` test (gerçek tahsilat yok), `0` canlı
   - `NEXT_PUBLIC_SITE_URL=https://umbagida.com` ve iletişim/banka bilgileri
4. **Alan adı:** Vercel → Domains → `umbagida.com` ve `www.umbagida.com` ekleyin; Vercel'in verdiği A/CNAME kayıtlarını alan adı sağlayıcınıza girin. SSL otomatik.
5. **PayTR bildirim adresi:** PayTR paneli → Ayarlar → Bildirim URL: `https://umbagida.com/api/paytr/callback`
6. Değişkenleri girdikten sonra Deployments → Redeploy. Kontrol: `https://umbagida.com/api/health` → `{"ok":true,"db":true,"paytr":true,...}`

## Sepet indirimi

Ara toplama göre kademeli indirim (`src/lib/discount.ts`, hem sepet hem sunucu aynı tabloyu kullanır):

| Ara toplam | İndirim |
|---|---|
| 2.000 ₺ | 50 ₺ |
| 2.400 ₺ | 70 ₺ |
| 2.900 ₺ | 140 ₺ |
| 3.500 ₺ | 200 ₺ |
| 4.100 ₺ | 246 ₺ |
| 4.700 ₺ | 329 ₺ |
| 5.300 ₺ | 424 ₺ |
| 5.900 ₺ | 531 ₺ |
| 6.500 ₺ | 650 ₺ |
| sonra her 600 ₺ | +60 ₺ (20.000 ₺'de 2.000 ₺ ile sabitlenir) |

Sepet, uygulanan indirimi TL olarak gösterir ve bir sonraki basamak için kaç TL eklenmesi gerektiğini yazar. Basamakları değiştirmek için `discountTiers` dizisini düzenleyin.

## Sipariş akışı

| Ödeme | Sipariş oluşunca | Sonra |
|---|---|---|
| Kredi kartı | `odeme-bekliyor`; PayTR penceresi açılır | PayTR bildirimi gelince `onaylandi` (imza doğrulanır, ilk bildirim işlenir) |
| Havale / EFT | `beklemede` (havale bekleniyor) | Dekont gelince panelden "Havale geldi, onayla" |
| Kapıda ödeme | `onaylandi` | — |

Sonrası panelden: **Hazırlanıyor → Kargoya verildi (kargo firması + takip no) → Teslim edildi**; gerekirse **İptal**. Takip numarası girince müşteri `/siparis-takip` sayfasında kargo firmasının takip bağlantısını görür (Yurtiçi, Aras, MNG, PTT, Sürat, HepsiJET, UPS; diğerleri için bağlantı elle girilir).

`NOTIFY_WEBHOOK` tanımlarsanız her yeni sipariş ve ödemede bu adrese (Formspree/Web3Forms) bildirim gider.

## Demo / test modu

PayTR anahtarları girilmemişken (veya `PAYMENT_DEMO=1` ile) kart ödemesi **demo ekranıyla** simüle edilir: müşteri kart formunu görür, "öde" deyince sipariş ödenmiş sayılır ve panelde TEST etiketiyle düşer; kart bilgisi hiçbir yere gönderilmez. PayTR anahtarları girildiğinde demo otomatik kapanır ve gerçek PayTR penceresi açılır.

`PAYTR_TEST_MODE=1` iken kart ödemeleri PayTR test modunda yapılır: gerçek tahsilat olmaz, sipariş yine düşer ve panelde **TEST** etiketiyle görünür. Test kart numaraları PayTR mağaza panelindeki **Test Kart Bilgileri** sayfasındadır. Canlıya geçerken `0` yapıp yeniden yayınlayın.

## Uygulama (PWA) ve bildirimler

- **Mağaza uygulaması:** site ana ekrana / masaüstüne "Umba" olarak eklenebilir (`/manifest.webmanifest`); Android/Chrome'da alt köşede "Uygulama olarak ekle" şeridi çıkar, iOS'ta Paylaş → Ana Ekrana Ekle yönergesi gösterilir. Çevrimdışıyken `/offline` sayfası ve önbellekteki görseller sunulur (`public/sw.js`).
- **Yönetim uygulaması:** `/yonetim` ayrı bir uygulama olarak kurulur ("Umba Yönetim", kendi ikonu, mağaza üst/alt çerçevesi gizli).
- **Anlık bildirim:** Yönetim panelindeki **Bildirimleri aç** düğmesi cihazı kaydeder; her yeni sipariş (havale) ve her alınan kart ödemesinde kayıtlı tüm cihazlara bildirim gider, dokununca ilgili sipariş açılır. iOS'ta bildirim için panelin ana ekrana eklenmiş olması gerekir (iOS 16.4+).
  Anahtar: `npx web-push generate-vapid-keys` → yalnızca `WEB_PUSH_PRIVATE_KEY` (public key otomatik türetilir) ve `WEB_PUSH_SUBJECT` (Vercel ortam değişkenleri).

## API uç noktaları

| Uç nokta | Açıklama |
|---|---|
| `POST /api/orders` | Sipariş oluşturur (fiyatlar sunucuda); kartta PayTR token'ı döner |
| `POST /api/paytr/callback` | PayTR ödeme bildirimi; `OK` döner |
| `GET /api/track?no=&phone=` | Müşteri sipariş takibi |
| `POST /api/admin/login`, `GET /api/admin/orders`, `GET|PATCH /api/admin/orders/:no`, `GET /api/admin/stats` | Yönetim (`Authorization: Bearer <ADMIN_PASSWORD>`) |
| `GET /api/health` | Yapılandırma kontrolü |

## Ürünleri düzenleme

- Ürünler `src/lib/products.ts` içinde; her kategori için `syrup()`, `sauce()`, `puree()`, `coffee()`, `hotChocolate()`, `bar()` yardımcıları standart varyant ve özellikleri üretir. Fiyatlar bu yardımcıların içindedir.
- Yeni ürün eklemek için ilgili diziye bir kayıt ekleyin; `slug` benzersiz olmalı.
- **Fotoğraf eklemek için:** `python3 scripts/urun-foto.py cekim.jpg public/products/urun-adi.webp` komutu arka planı kaldırıp şeffaf 900×1200 WebP üretir (gereksinimler: `pip install opencv-python-headless pillow numpy`). Ardından ürüne `image: "/products/urun-adi.webp"` alanı ekleyin. Stüdyo/sahne çekimi için `image` + `imageFit: "cover"` (tam kaplama), şeffaf kesim için `imageCutout` (slider, arama, sepet) ve kart hover'ı için `imageHover` kullanılır; örnek: `cilek-puresi`. Fotoğrafı olmayan ürünlerde vektörel çizim otomatik gösterilir; fotoğrafı olanlar kart, ürün sayfası, slider ve aramada fotoğrafla görünür.
- Kategoriler `src/lib/categories.ts` içinde.

## Yayın öncesi kontrol listesi

- [ ] Vercel ortam değişkenleri: `ADMIN_PASSWORD`, PayTR anahtarları, Turso, iletişim/banka bilgileri
- [ ] `PAYTR_TEST_MODE=1` ile test kartıyla bir sipariş verip panelde "Onaylandı" olduğunu görme
- [ ] PayTR panelinde bildirim URL'sinin `https://umbagida.com/api/paytr/callback` olduğunu kontrol etme
- [ ] Fiyatların ve stok kodlarının gözden geçirilmesi (`src/lib/products.ts`)
- [ ] Yasal metinlerin (KVKK, mesafeli satış vb.) hukuk danışmanınızca onaylanması
- [ ] Google Search Console'a `sitemap.xml` gönderimi
- [ ] Canlıya geçiş: `PAYTR_TEST_MODE=0` + Redeploy

## Dizin yapısı

```
src/
  app/            sayfalar ve API (src/app/api)
  components/     layout, ürün, sepet, ödeme, yönetim, sipariş takip bileşenleri
  lib/            site ayarları, katalog, sepet, sipariş ve API istemcisi
  server/         veritabanı (libSQL/Turso), PayTR, sipariş mantığı
tests/            API uçtan uca testleri
public/           statik dosyalar (ürün fotoğrafları: public/products/)
```

## Fiyat yönetimi

Yönetim paneli (`/yonetim`) → **Fiyatlar** sekmesinden tüm ürün/varyant fiyatları düzenlenir. Kaydedilen fiyatlar Turso'daki `price_overrides` tablosuna yazılır; katalogdaki (`src/lib/products.ts`) fiyatlar yalnızca varsayılandır. Kayıt sonrası mağaza sayfaları (`revalidatePath`) anında yenilenir, sepet ve sipariş hesabı da aynı tabloyu kullanır. "Katalog fiyatına dön" ile kayıt silinir. Toplu oran aracı listedeki ürünlere yüzde uygular (0,10 ₺ yuvarlama).

## Görseller (GitHub → jsDelivr CDN)

Vercel görsel optimizasyonu ve bant genişliği kotasını kullanmamak için `/public/products|hero|categories|story|brand` altındaki dosyalar GitHub deposundan jsDelivr CDN ile sunulur; boyutlandırma `wsrv.nl` üzerinden yapılır (`src/lib/image-loader.ts`). Taban adres Vercel derlemesinde otomatik olarak o anki commit'e sabitlenir (`next.config.ts → assetBase()`); yeni görsel eklemek için dosyayı `public/` altına koyup push etmek yeterlidir. Kapatmak için Vercel'de `NEXT_PUBLIC_ASSET_BASE` değişkenini boş tanımlayın.
