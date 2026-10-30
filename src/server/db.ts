import { createClient, type Client } from "@libsql/client";

/**
 * Sipariş veritabanı (libSQL / Turso — SQLite uyumlu).
 *  - Vercel'de: Turso entegrasyonu TURSO_DATABASE_URL ve TURSO_AUTH_TOKEN değişkenlerini verir.
 *  - Yerelde: DATABASE_URL=file:./data/umba.db (klasör otomatik oluşturulmaz; `mkdir data`).
 * Şema ilk istekte otomatik oluşturulur.
 */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS orders (
    order_no TEXT PRIMARY KEY,
    merchant_oid TEXT UNIQUE NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    status TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    paid_amount REAL,
    total REAL NOT NULL,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    cod_fee REAL NOT NULL,
    customer_json TEXT NOT NULL,
    lines_json TEXT NOT NULL,
    phone_digits TEXT NOT NULL,
    email TEXT NOT NULL,
    carrier TEXT,
    tracking_no TEXT,
    tracking_url TEXT,
    admin_note TEXT,
    test_mode INTEGER NOT NULL DEFAULT 0,
    discount REAL NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`,
  `CREATE TABLE IF NOT EXISTS order_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_no TEXT NOT NULL,
    at TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT,
    message TEXT,
    actor TEXT NOT NULL DEFAULT 'system'
  )`,
  `CREATE INDEX IF NOT EXISTS idx_events_order ON order_events(order_no, id)`,
  `CREATE TABLE IF NOT EXISTS price_overrides (
    sku TEXT PRIMARY KEY,
    price REAL NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS push_subscriptions (
    endpoint TEXT PRIMARY KEY,
    subscription_json TEXT NOT NULL,
    label TEXT,
    created_at TEXT NOT NULL
  )`,
];

declare global {
  var __umbaDb: { client: Client; ready: Promise<void> } | undefined;
}

export function dbConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL);
}

export async function db(): Promise<Client> {
  if (!globalThis.__umbaDb) {
    const url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL;
    if (!url) throw new Error("Veritabanı tanımlı değil: TURSO_DATABASE_URL (Vercel → Turso) veya DATABASE_URL=file:./data/umba.db");
    const client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    const ready = (async () => {
      for (const sql of SCHEMA) await client.execute(sql);
      // Eski tablolara sonradan eklenen sütunlar
      await client.execute("ALTER TABLE orders ADD COLUMN discount REAL NOT NULL DEFAULT 0").catch(() => {});
    })();
    globalThis.__umbaDb = { client, ready };
  }
  await globalThis.__umbaDb.ready;
  return globalThis.__umbaDb.client;
}
