# Umba Coffee — E-Ticaret Sitesi

Şurup, sos, püre, kahve, sıcak çikolata ve bar ürünleri satan **Umba Coffee** için
Next.js 16 ile geliştirilmiş, Türkçe, mobil uyumlu e-ticaret sitesi.

## Özellikler

- **Katalog:** 6 ürün grubu, 51 ürün, boy/fiyat varyantları (`src/lib/products.ts`)
- **Listeleme:** arama, kategori ve etiket filtreleri, sıralama (URL ile paylaşılabilir)
- **Ürün sayfası:** boy seçimi, adet, kullanım önerisi, ürün bilgileri, ilgili ürünler, Product JSON-LD
- **Sepet:** tarayıcıda saklanır (localStorage), sekmeler arası senkron, ücretsiz kargo çubuğu
- **Ödeme:** teslimat + fatura (bireysel/kurumsal) formu, Havale/EFT ve Kapıda Ödeme, zod ile doğrulama, fiyatlar katalogdan hesaplanır
- **Sipariş iletimi:** sipariş özeti hazır mesaj olarak **WhatsApp** veya **e-posta** ile mağazaya gönderilir; isteğe bağlı form servisi (Formspree / Web3Forms) tanımlanırsa otomatik iletilir
- **Kart ile ödeme:** PayTR iFrame API (3D Secure); token üretimi için `paytr-worker/` altında Cloudflare Worker
- **Ana sayfa:** otomatik akan, kaydırılabilir temalı hero slider; ürün kartlarında hover'da "bardakta görünüm" ve yuvarlanan fiyat
- **İçerik sayfaları:** Hakkımızda, Kurumsal & Bayilik (teklif formu), İletişim, SSS (FAQ JSON-LD)
- **Yasal sayfalar:** KVKK, Gizlilik & Çerez, Mesafeli Satış Sözleşmesi, Ön Bilgilendirme Formu, İptal & İade, Teslimat & Kargo
- **SEO:** sitemap.xml, robots.txt, Open Graph görseli, manifest, canonical adresler
- **Görseller:** Ürün fotoğrafı olmayan ürünler için otomatik vektörel ambalaj çizimi; fotoğraf eklendiğinde otomatik olarak fotoğraf kullanılır
- **Tamamen statik:** sunucu gerektirmez; GitHub Pages, Netlify, Vercel veya herhangi bir hosting'de çalışır

## Teknoloji

Next.js 16 (App Router, statik dışa aktarım), React 19, TypeScript, Tailwind CSS v4, lucide-react, zod.

## Yerel çalıştırma

```bash
npm install
cp .env.example .env.local   # değerleri düzenleyin
npm run dev                  # http://localhost:3000
```

Üretim derlemesi `out/` klasörüne statik dosyalar üretir:

```bash
npm run build
npx serve out                # veya herhangi bir statik sunucu
```

Kontroller: `npm run lint`, `npm run typecheck`, `npm run test:worker`.

## Yayın: GitHub Pages (otomatik)

`.github/workflows/deploy.yml` her push'ta siteyi derler ve GitHub Pages'e yayınlar.

1. Depo **Settings → Pages → Build and deployment → Source: GitHub Actions** seçili olmalı.
2. Push sonrası **Actions** sekmesinden "GitHub Pages'e yayınla" akışını izleyin.
3. Site `https://<kullanici>.github.io/<depo>/` adresinde yayınlanır. Alt dizin (`/<depo>`) otomatik ayarlanır.
4. **Özel alan adı** için Settings → Pages → Custom domain alanına alan adınızı yazın ve DNS'te CNAME kaydı ekleyin; bir sonraki yayında alt dizin otomatik kalkar.

Telefon, IBAN gibi bilgileri koda yazmadan vermek için **Settings → Secrets and variables → Actions → Variables** altında aşağıdaki değişkenleri tanımlayın (isimler `.env.example` ile aynı). Değişiklik sonrası akışı **Run workflow** ile yeniden çalıştırın.

## Yapılandırma

| Değişken | Açıklama |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canlı adres (sitemap, OG, canonical için). GitHub Actions otomatik verir. |
| `NEXT_PUBLIC_BASE_PATH` | Alt dizinde yayın (ör. `/umba`). GitHub Actions otomatik verir; kök alan adında boş. |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_ADDRESS` | İletişim bilgileri. WhatsApp numarası ülke koduyla, boşluksuz: `905xxxxxxxxx` |
| `NEXT_PUBLIC_INSTAGRAM`, `NEXT_PUBLIC_FACEBOOK` | Sosyal medya bağlantıları |
| `NEXT_PUBLIC_COMPANY_NAME`, `NEXT_PUBLIC_MERSIS` | Yasal sayfalarda görünen şirket bilgileri |
| `NEXT_PUBLIC_BANK_NAME`, `NEXT_PUBLIC_BANK_HOLDER`, `NEXT_PUBLIC_IBAN` | Havale/EFT bilgileri |
| `NEXT_PUBLIC_FORM_ENDPOINT`, `NEXT_PUBLIC_FORM_ACCESS_KEY` | İsteğe bağlı form servisi (aşağıya bakın) |
| `NEXT_PUBLIC_PAYTR_TOKEN_ENDPOINT` | PayTR Worker adresi (`.../token`); tanımlanınca kart ile ödeme açılır |

Kargo eşiği, kargo ücreti, kapıda ödeme bedeli ve teslimat süresi `src/lib/site.ts` → `commerce` altında.

## Siparişler nasıl ulaşır?

Site statik olduğu için sunucu tarafı yoktur; sipariş müşterinin tarayıcısında oluşturulur:

1. Müşteri "Siparişi tamamla" der; form doğrulanır, `UMB-YYAAGG-XXXX` numaralı sipariş özeti hazırlanır.
2. **Form servisi tanımlıysa** (`NEXT_PUBLIC_FORM_ENDPOINT`): sipariş otomatik olarak size e-posta ile gelir. Ücretsiz seçenekler:
   - Formspree: form oluşturun, `https://formspree.io/f/xxxx` adresini `NEXT_PUBLIC_FORM_ENDPOINT` olarak girin.
   - Web3Forms: e-postanız için anahtar alın; `NEXT_PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit` ve `NEXT_PUBLIC_FORM_ACCESS_KEY=anahtar`.
3. **Form servisi yoksa:** sipariş sayfasında "WhatsApp ile gönder" / "E-posta ile gönder" butonları çıkar; sipariş özeti hazır mesaj olarak WhatsApp numaranıza gelir.
4. Havale seçildiyse müşteri IBAN bilgilerini görür ve dekontu WhatsApp'tan iletir.

İletişim ve teklif formları da aynı mantıkla çalışır (form servisi varsa otomatik, yoksa e-posta/WhatsApp).

## Kart ile ödeme (PayTR)

Kart ödemesi **PayTR iFrame API** ile çalışır. Site statik olduğu için merchant anahtarları tarayıcıya verilemez; token üretimi ve ödeme bildirimi `paytr-worker/` klasöründeki küçük Cloudflare Worker (ücretsiz) tarafından yapılır.

Akış: müşteri "Güvenli ödemeye geç" der → site Worker'dan token ister (Worker sepeti `catalog.json` fiyatlarıyla yeniden hesaplar) → `/odeme/kart/` sayfasında PayTR ödeme penceresi açılır → sonuç `/odeme/basarili/` veya `/odeme/basarisiz/` sayfasına döner; PayTR ayrıca Worker'ın `/callback` adresine imzalı bildirim gönderir.

Kurulum adımları `paytr-worker/README.md` dosyasında. Özetle: `npx wrangler deploy`, PayTR paneline bildirim URL'si, GitHub Variables'a `NEXT_PUBLIC_PAYTR_TOKEN_ENDPOINT`. Endpoint tanımlı değilken ödeme adımında kart seçeneği "Çok yakında" olarak kapalı görünür.

## Ürünleri düzenleme

- Ürünler `src/lib/products.ts` içinde; her kategori için `syrup()`, `sauce()`, `puree()`, `coffee()`, `hotChocolate()`, `bar()` yardımcıları standart varyant ve özellikleri üretir. Fiyatlar bu yardımcıların içindedir.
- Yeni ürün eklemek için ilgili diziye bir kayıt ekleyin; `slug` benzersiz olmalı.
- **Fotoğraf eklemek için:** `python3 scripts/urun-foto.py cekim.jpg public/products/urun-adi.webp` komutu arka planı kaldırıp şeffaf 900×1200 WebP üretir (gereksinimler: `pip install opencv-python-headless pillow numpy`). Ardından ürüne `image: "/products/urun-adi.webp"` alanı ekleyin. Stüdyo/sahne çekimi için `image` + `imageFit: "cover"` (tam kaplama), şeffaf kesim için `imageCutout` (slider, arama, sepet) ve kart hover'ı için `imageHover` kullanılır; örnek: `cilek-puresi`. Fotoğrafı olmayan ürünlerde vektörel çizim otomatik gösterilir; fotoğrafı olanlar kart, ürün sayfası, slider ve aramada fotoğrafla görünür.
- Kategoriler `src/lib/categories.ts` içinde.

## Yayın öncesi kontrol listesi

- [ ] GitHub Variables: telefon, WhatsApp, e-posta, adres, IBAN, şirket unvanı, MERSİS
- [ ] (İsteğe bağlı) Form servisi anahtarı, siparişlerin e-posta ile gelmesi için
- [ ] Fiyatların ve stok kodlarının gözden geçirilmesi (`src/lib/products.ts`)
- [ ] Ürün fotoğraflarının eklenmesi (isteğe bağlı)
- [ ] Yasal metinlerin (KVKK, mesafeli satış vb.) hukuk danışmanınızca onaylanması
- [ ] Test siparişi verip WhatsApp mesajının doğru numaraya düştüğünü kontrol etme
- [ ] Google Search Console'a `sitemap.xml` gönderimi

## Dizin yapısı

```
.github/workflows/  GitHub Pages yayın akışı
paytr-worker/       PayTR token/bildirim Worker'ı (Cloudflare)
scripts/            derleme öncesi katalog dışa aktarımı
src/
  app/            sayfalar
  components/     layout, ürün, sepet, ödeme, form bileşenleri
  lib/            site ayarları, katalog, sepet mantığı, sipariş ve form yardımcıları
public/           statik dosyalar (ürün fotoğrafları için public/products/)
```
