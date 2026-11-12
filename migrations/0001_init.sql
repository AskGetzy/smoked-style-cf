-- Smoked Style schema v1
-- Money is whole cents. Timestamps are ISO-8601 UTC text.

-- ───────────── Better Auth (staff login) ─────────────
CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL DEFAULT 0,
  "image" TEXT,
  "role" TEXT NOT NULL DEFAULT 'staff' CHECK ("role" IN ('boss', 'admin', 'staff')),
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE TABLE "session" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "expiresAt" DATE NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);
CREATE INDEX "session_userId_idx" ON "session" ("userId");

CREATE TABLE "account" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" DATE,
  "refreshTokenExpiresAt" DATE,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);
CREATE INDEX "account_userId_idx" ON "account" ("userId");

CREATE TABLE "verification" (
  "id" TEXT PRIMARY KEY NOT NULL,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" DATE NOT NULL,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");

-- ───────────── Catalog ─────────────
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Jerky', 'jerky', 1),
  ('Steaks', 'steaks', 2),
  ('Boards', 'boards', 3),
  ('Smoked', 'smoked', 4),
  ('Non-Smoked', 'non-smoked', 5);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER REFERENCES categories (id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  unit_label TEXT NOT NULL DEFAULT '',          -- e.g. "per lb", "1 board"
  photo_keys TEXT NOT NULL DEFAULT '[]',        -- JSON array of R2 keys, first = main photo
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- Item controls
  active INTEGER NOT NULL DEFAULT 1,            -- 0 hides it from the shop
  needs_approval INTEGER NOT NULL DEFAULT 0,    -- order waits for boss approval
  max_per_order INTEGER CHECK (max_per_order IS NULL OR max_per_order > 0),   -- NULL = no cap
  stock_remaining INTEGER CHECK (stock_remaining IS NULL OR stock_remaining >= 0), -- NULL = unlimited
  low_stock_at INTEGER NOT NULL DEFAULT 5,      -- show "Only N left" at or below this
  taxable INTEGER NOT NULL DEFAULT 1,

  order_count INTEGER NOT NULL DEFAULT 0,       -- for Best Sellers
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX products_category_idx ON products (category_id, sort_order);
CREATE INDEX products_active_idx ON products (active);

-- ───────────── Customers and orders ─────────────
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  vip INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE UNIQUE INDEX customers_email_idx ON customers (email) WHERE email IS NOT NULL;

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  public_token TEXT NOT NULL UNIQUE,            -- for the emailed order-status link
  customer_id INTEGER REFERENCES customers (id),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN
    ('awaiting_approval', 'new', 'in_progress', 'ready', 'completed', 'cancelled', 'declined')),
  source TEXT NOT NULL DEFAULT 'web' CHECK (source IN ('web', 'phone', 'catering')),
  fulfillment TEXT NOT NULL DEFAULT 'pickup' CHECK (fulfillment IN ('pickup', 'delivery')),
  due_date TEXT,                                -- YYYY-MM-DD the customer wants it
  delivery_address TEXT,
  gift_message TEXT,
  notes TEXT,
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  payment_mode TEXT NOT NULL DEFAULT 'hold' CHECK (payment_mode IN ('hold', 'charge', 'offline')),
  stripe_payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN
    ('unpaid', 'held', 'paid', 'refunded', 'released')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX orders_status_idx ON orders (status, created_at);
CREATE INDEX orders_due_idx ON orders (due_date);

CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products (id) ON DELETE SET NULL,
  name TEXT NOT NULL,                           -- copied at time of sale
  unit_price_cents INTEGER NOT NULL,            -- copied at time of sale
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  taxable INTEGER NOT NULL DEFAULT 1
);
CREATE INDEX order_items_order_idx ON order_items (order_id);

-- ───────────── Printing and push ─────────────
CREATE TABLE print_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER REFERENCES orders (id) ON DELETE SET NULL,
  zpl TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'printed', 'failed')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  printed_at TEXT
);
CREATE INDEX print_jobs_status_idx ON print_jobs (status, created_at);

CREATE TABLE push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ───────────── Staff invites ─────────────
-- Sign-up is closed except for the very first account (the boss)
-- and for emails the boss has invited here.
CREATE TABLE staff_invites (
  email TEXT PRIMARY KEY NOT NULL COLLATE NOCASE,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
