# Umba PayTR Worker

Statik sitede kart ödemesi için PayTR iFrame token'ı üreten ve ödeme bildirimlerini doğrulayan küçük Cloudflare Worker (ücretsiz plan yeterli).

## Kurulum (yaklaşık 10 dakika)

1. PayTR mağaza panelinden **Merchant ID, Merchant Key, Merchant Salt** değerlerini alın.
2. [Cloudflare](https://dash.cloudflare.com) hesabı açın (ücretsiz).
3. Bu klasörde:
   ```bash
   npx wrangler login
   npx wrangler secret put PAYTR_MERCHANT_ID
   npx wrangler secret put PAYTR_MERCHANT_KEY
   npx wrangler secret put PAYTR_MERCHANT_SALT
   npx wrangler deploy
   ```
   Çıktıda `https://umba-paytr.<hesap>.workers.dev` gibi bir adres görünür.
4. PayTR panelinde **Bildirim URL'si** olarak `https://umba-paytr.<hesap>.workers.dev/callback` girin.
5. GitHub deposunda **Settings → Secrets and variables → Actions → Variables** altına
   `NEXT_PUBLIC_PAYTR_TOKEN_ENDPOINT = https://umba-paytr.<hesap>.workers.dev/token` ekleyip yayın akışını yeniden çalıştırın.
6. `wrangler.toml` içinde `TEST_MODE = "1"` iken PayTR test kartlarıyla deneyin; canlıya geçerken `"0"` yapıp tekrar `npx wrangler deploy` çalıştırın.

Özel alan adına geçerseniz `SITE_URL` ve `ALLOWED_ORIGIN` değerlerini güncelleyin.

## Sipariş bildirimi

Başarılı ödemede siparişin size ulaşması için `NOTIFY_WEBHOOK` değerine bir Formspree/Web3Forms adresi verin; Worker ödeme onayında sipariş detaylarını bu adrese POST eder (e-posta olarak gelir). KV bağlarsanız sipariş kayıtları Cloudflare'de de saklanır.

## Yerel test

```bash
node --test test.mjs
```
