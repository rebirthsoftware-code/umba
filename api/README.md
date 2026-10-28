# Umba Sipariş API'si (Cloudflare Worker + D1)

Site statik (GitHub Pages) olduğu için siparişler, PayTR anahtarları, sipariş takibi ve yönetim paneli
bu küçük sunucuda çalışır. Cloudflare'in ücretsiz planı yeterlidir (günde 100.000 istek, 5 GB D1).

| Uç nokta | Ne yapar |
|---|---|
| `POST /orders` | Siparişi katalog fiyatlarıyla hesaplar, veritabanına yazar; kart ödemesinde PayTR iFrame token'ı döner |
| `POST /callback` | PayTR ödeme bildirimi (hash doğrulanır, sipariş "Onaylandı" olur, `OK` döner) |
| `GET /track?no=&phone=` | Müşteri sipariş takibi: durum, geçmiş, kargo firması ve takip bağlantısı |
| `POST /admin/login`, `GET/PATCH /admin/orders…`, `GET /admin/stats` | Yönetim paneli (`Authorization: Bearer <ADMIN_PASSWORD>`) |

Sipariş durumları: `odeme-bekliyor` → `onaylandi` → `hazirlaniyor` → `kargolandi` → `teslim-edildi`; ayrıca `beklemede` (havale), `iptal`, `odeme-basarisiz`.

## Kurulum (yaklaşık 15 dakika)

1. [Cloudflare](https://dash.cloudflare.com) hesabı açın (ücretsiz). Bu klasörde:
   ```bash
   npx wrangler login
   npx wrangler d1 create umba-orders
   ```
   Çıktıdaki `database_id` değerini `wrangler.toml` içine yazın, sonra şemayı yükleyin:
   ```bash
   npx wrangler d1 execute umba-orders --remote --file=schema.sql
   ```
2. Gizli değerleri girin (PayTR mağaza paneli → **Bilgi** sayfasından):
   ```bash
   npx wrangler secret put PAYTR_MERCHANT_ID
   npx wrangler secret put PAYTR_MERCHANT_KEY
   npx wrangler secret put PAYTR_MERCHANT_SALT
   npx wrangler secret put ADMIN_PASSWORD      # yönetim paneli şifresi, uzun ve tahmin edilemez olsun
   ```
3. Yayınlayın: `npx wrangler deploy` → çıktıda `https://umba-api.<hesap>.workers.dev` görünür.
4. PayTR panelinde **Ayarlar → Bildirim URL** alanına `https://umba-api.<hesap>.workers.dev/callback` yazın.
5. GitHub deposunda **Settings → Secrets and variables → Actions → Variables** altına
   `NEXT_PUBLIC_API_URL = https://umba-api.<hesap>.workers.dev` ekleyin ve yayın akışını yeniden çalıştırın
   (Actions → Deploy → Run workflow). Bu değişken tanımlı olunca sitede kart ödemesi, `/siparis-takip` ve `/yonetim` aktif olur.

Özel alan adına geçerseniz `wrangler.toml` içindeki `SITE_URL` ve `ALLOWED_ORIGIN` değerlerini güncelleyip tekrar `npx wrangler deploy` çalıştırın.

## Demo / test modu

`wrangler.toml` içinde `TEST_MODE = "1"` iken PayTR işlemleri test olarak yapılır; gerçek tahsilat olmaz,
sipariş yine sisteme düşer ve yönetim panelinde **TEST** etiketiyle görünür. Test kart numaralarını PayTR
mağaza panelindeki **Test Kart Bilgileri** sayfasından alın (PayTR bu bilgileri yalnızca panelde yayınlar).
Canlıya geçerken `TEST_MODE = "0"` yapıp `npx wrangler deploy` çalıştırın.

PayTR ayrıca mağaza canlıdayken tek tek test işlem yapılmasına da izin verir; bu Worker `TEST_MODE` değerini
`test_mode` parametresi olarak PayTR'ye iletir.

## Bildirim (isteğe bağlı)

Yeni sipariş ve ödemelerde e-posta almak için `wrangler.toml` içindeki `NOTIFY_WEBHOOK` satırını açıp bir
Formspree / Web3Forms adresi verin. Her bildirimde yönetim panelindeki sipariş bağlantısı gönderilir.

## Yerel test

```bash
node --test test.mjs                       # birim testleri
cp .dev.vars.example .dev.vars             # yerel gizli değerler
npx wrangler dev --local                   # http://localhost:8787
npx wrangler d1 execute umba-orders --local --file=schema.sql
```
