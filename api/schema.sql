-- Umba API · D1 şeması
CREATE TABLE IF NOT EXISTS orders (
  order_no        TEXT PRIMARY KEY,
  merchant_oid    TEXT UNIQUE NOT NULL,
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  status          TEXT NOT NULL,            -- odeme-bekliyor | beklemede | onaylandi | hazirlaniyor | kargolandi | teslim-edildi | iptal | odeme-basarisiz
  payment_method  TEXT NOT NULL,            -- kart | havale | kapida
  payment_status  TEXT NOT NULL,            -- bekliyor | odendi | basarisiz | kapida
  paid_amount     REAL,
  total           REAL NOT NULL,
  subtotal        REAL NOT NULL,
  shipping        REAL NOT NULL,
  cod_fee         REAL NOT NULL,
  customer_json   TEXT NOT NULL,
  lines_json      TEXT NOT NULL,
  phone_digits    TEXT NOT NULL,            -- takip doğrulaması için son 10 hane
  email           TEXT NOT NULL,
  carrier         TEXT,
  tracking_no     TEXT,
  tracking_url    TEXT,
  admin_note      TEXT,
  test_mode       INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE TABLE IF NOT EXISTS order_events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no   TEXT NOT NULL,
  at         TEXT NOT NULL,
  type       TEXT NOT NULL,                 -- created | payment | status | cargo | note
  status     TEXT,
  message    TEXT,
  actor      TEXT NOT NULL DEFAULT 'system' -- system | paytr | admin | customer
);
CREATE INDEX IF NOT EXISTS idx_events_order ON order_events(order_no, id);
