-- ============================================================
-- Cafe Management System — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Role
CREATE TABLE IF NOT EXISTS "Role" (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  description       TEXT,
  permissions       JSONB NOT NULL DEFAULT '[]',
  "isSystem"        BOOLEAN NOT NULL DEFAULT false,
  "defaultRoute"    TEXT,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User
CREATE TABLE IF NOT EXISTS "User" (
  id                     TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name                   TEXT NOT NULL,
  email                  TEXT NOT NULL UNIQUE,
  phone                  TEXT,
  role                   TEXT NOT NULL REFERENCES "Role"(id) ON DELETE RESTRICT,
  "passwordHash"         TEXT NOT NULL,
  avatar                 TEXT,
  "defaultRoute"         TEXT,
  "monthlySalary"        NUMERIC(12,2),
  active                 BOOLEAN NOT NULL DEFAULT true,
  "overtimeRate"         NUMERIC(12,2) NOT NULL DEFAULT 0,
  "standardWorkingDays"  INTEGER NOT NULL DEFAULT 26,
  "createdAt"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Workspace (singleton — id is always 'default')
CREATE TABLE IF NOT EXISTS "Workspace" (
  id               TEXT PRIMARY KEY DEFAULT 'default',
  name             TEXT NOT NULL,
  "legalEntity"    TEXT,
  "taxId"          TEXT,
  phone            TEXT,
  currency         TEXT NOT NULL DEFAULT 'PKR',
  timezone         TEXT NOT NULL DEFAULT 'Asia/Karachi',
  city             TEXT,
  "addressLine"    TEXT,
  "receiptFooter"  TEXT,
  "receiptWidth"   TEXT NOT NULL DEFAULT '80',
  "hoursMonOpen"   TEXT, "hoursMonClose"  TEXT,
  "hoursTueOpen"   TEXT, "hoursTueClose"  TEXT,
  "hoursWedOpen"   TEXT, "hoursWedClose"  TEXT,
  "hoursThuOpen"   TEXT, "hoursThuClose"  TEXT,
  "hoursFriOpen"   TEXT, "hoursFriClose"  TEXT,
  "hoursSatOpen"   TEXT, "hoursSatClose"  TEXT,
  "hoursSunOpen"   TEXT, "hoursSunClose"  TEXT,
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KitchenStation
CREATE TABLE IF NOT EXISTS "KitchenStation" (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  printer  TEXT,
  color    TEXT NOT NULL DEFAULT '#6b7280',
  active   BOOLEAN NOT NULL DEFAULT true
);

-- MenuCategory
CREATE TABLE IF NOT EXISTS "MenuCategory" (
  id     TEXT PRIMARY KEY,
  name   TEXT NOT NULL,
  slug   TEXT NOT NULL UNIQUE,
  color  TEXT NOT NULL DEFAULT '#6b7280'
);

-- Dining table
CREATE TABLE IF NOT EXISTS "Table" (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  capacity    INTEGER NOT NULL DEFAULT 4,
  occupancy   INTEGER NOT NULL DEFAULT 0,
  "waiterId"  TEXT REFERENCES "User"(id) ON DELETE SET NULL
);

-- Supplier
CREATE TABLE IF NOT EXISTS "Supplier" (
  id       TEXT PRIMARY KEY,
  name     TEXT NOT NULL,
  contact  TEXT NOT NULL,
  email    TEXT NOT NULL,
  phone    TEXT NOT NULL,
  address  TEXT,
  rating   NUMERIC(3,1) NOT NULL DEFAULT 5.0
);

-- InventoryItem
CREATE TABLE IF NOT EXISTS "InventoryItem" (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  sku              TEXT NOT NULL UNIQUE,
  category         TEXT NOT NULL,
  unit             TEXT NOT NULL,
  stock            NUMERIC(12,3) NOT NULL DEFAULT 0,
  "reorderLevel"   NUMERIC(12,3) NOT NULL DEFAULT 0,
  "costPerUnit"    NUMERIC(12,2) NOT NULL DEFAULT 0,
  "supplierId"     TEXT REFERENCES "Supplier"(id) ON DELETE SET NULL,
  "lastRestocked"  TIMESTAMPTZ,
  "expiresAt"      TIMESTAMPTZ
);

-- MenuItem
CREATE TABLE IF NOT EXISTS "MenuItem" (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  description       TEXT,
  "categoryId"      TEXT NOT NULL REFERENCES "MenuCategory"(id) ON DELETE RESTRICT,
  "stationId"       TEXT NOT NULL REFERENCES "KitchenStation"(id) ON DELETE RESTRICT,
  price             NUMERIC(12,2) NOT NULL,
  cost              NUMERIC(12,2),
  sku               TEXT UNIQUE,
  "pctCode"         TEXT,
  image             TEXT,
  available         BOOLEAN NOT NULL DEFAULT true,
  "posVisible"      BOOLEAN NOT NULL DEFAULT true,
  popular           BOOLEAN NOT NULL DEFAULT false,
  "prepTimeMinutes" INTEGER,
  modifiers         JSONB NOT NULL DEFAULT '[]'
);

-- RecipeIngredient (join table)
CREATE TABLE IF NOT EXISTS "RecipeIngredient" (
  "menuItemId"       TEXT NOT NULL REFERENCES "MenuItem"(id) ON DELETE CASCADE,
  "inventoryItemId"  TEXT NOT NULL REFERENCES "InventoryItem"(id) ON DELETE CASCADE,
  quantity           NUMERIC(12,3) NOT NULL,
  unit               TEXT NOT NULL,
  PRIMARY KEY ("menuItemId", "inventoryItemId")
);

-- PaymentChannel
CREATE TABLE IF NOT EXISTS "PaymentChannel" (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL UNIQUE,
  kind              TEXT NOT NULL,
  "openingBalance"  NUMERIC(14,2) NOT NULL DEFAULT 0,
  "currentBalance"  NUMERIC(14,2) NOT NULL DEFAULT 0,
  archived          BOOLEAN NOT NULL DEFAULT false,
  "archivedAt"      TIMESTAMPTZ,
  "createdAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order
CREATE TABLE IF NOT EXISTS "Order" (
  id                    TEXT PRIMARY KEY,
  number                TEXT NOT NULL UNIQUE,
  status                TEXT NOT NULL DEFAULT 'pending',
  channel               TEXT NOT NULL DEFAULT 'dine-in',
  "customerName"        TEXT,
  "customerPhone"       TEXT,
  notes                 TEXT,
  "tableId"             TEXT REFERENCES "Table"(id) ON DELETE SET NULL,
  "staffId"             TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  "assignedStaffId"     TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  subtotal              NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax                   NUMERIC(14,2) NOT NULL DEFAULT 0,
  tip                   NUMERIC(14,2) NOT NULL DEFAULT 0,
  discount              NUMERIC(14,2) NOT NULL DEFAULT 0,
  total                 NUMERIC(14,2) NOT NULL DEFAULT 0,
  payment               TEXT,
  "paymentChannelId"    TEXT REFERENCES "PaymentChannel"(id) ON DELETE SET NULL,
  "paidAt"              TIMESTAMPTZ,
  guests                INTEGER NOT NULL DEFAULT 1,
  "fiscalInvoiceNumber" TEXT,
  "fiscalLastError"     TEXT,
  "fiscalSubmittedAt"   TIMESTAMPTZ,
  "fiscalAttempts"      INTEGER NOT NULL DEFAULT 0,
  "createdAt"           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OrderItem
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id            TEXT PRIMARY KEY,
  "orderId"     TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "menuItemId"  TEXT REFERENCES "MenuItem"(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  note          TEXT,
  quantity      INTEGER NOT NULL DEFAULT 1,
  "unitPrice"   NUMERIC(12,2) NOT NULL,
  modifiers     JSONB NOT NULL DEFAULT '[]',
  "preparedAt"  TIMESTAMPTZ
);

-- KitchenTicket
CREATE TABLE IF NOT EXISTS "KitchenTicket" (
  id           TEXT PRIMARY KEY,
  "orderId"    TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "stationId"  TEXT NOT NULL REFERENCES "KitchenStation"(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending',
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE ("orderId", "stationId")
);

-- InventoryMovement
CREATE TABLE IF NOT EXISTS "InventoryMovement" (
  id                 TEXT PRIMARY KEY,
  "inventoryItemId"  TEXT NOT NULL REFERENCES "InventoryItem"(id) ON DELETE CASCADE,
  "orderId"          TEXT REFERENCES "Order"(id) ON DELETE SET NULL,
  "supplierId"       TEXT REFERENCES "Supplier"(id) ON DELETE SET NULL,
  "paymentChannelId" TEXT REFERENCES "PaymentChannel"(id) ON DELETE SET NULL,
  delta              NUMERIC(12,3) NOT NULL,
  reason             TEXT NOT NULL,
  amount             NUMERIC(14,2),
  "paidAmount"       NUMERIC(14,2),
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SupplierPayment
CREATE TABLE IF NOT EXISTS "SupplierPayment" (
  id                 TEXT PRIMARY KEY,
  "supplierId"       TEXT NOT NULL REFERENCES "Supplier"(id) ON DELETE CASCADE,
  "paymentChannelId" TEXT NOT NULL REFERENCES "PaymentChannel"(id) ON DELETE RESTRICT,
  amount             NUMERIC(14,2) NOT NULL,
  note               TEXT,
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PaymentTransfer
CREATE TABLE IF NOT EXISTS "PaymentTransfer" (
  id           TEXT PRIMARY KEY,
  "fromId"     TEXT NOT NULL REFERENCES "PaymentChannel"(id) ON DELETE RESTRICT,
  "toId"       TEXT NOT NULL REFERENCES "PaymentChannel"(id) ON DELETE RESTRICT,
  amount       NUMERIC(14,2) NOT NULL,
  "occurredAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note         TEXT
);

-- ExpenseHead
CREATE TABLE IF NOT EXISTS "ExpenseHead" (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL UNIQUE,
  archived     BOOLEAN NOT NULL DEFAULT false,
  "archivedAt" TIMESTAMPTZ,
  "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense
CREATE TABLE IF NOT EXISTS "Expense" (
  id                 TEXT PRIMARY KEY,
  "expenseHeadId"    TEXT NOT NULL REFERENCES "ExpenseHead"(id) ON DELETE RESTRICT,
  "paymentChannelId" TEXT NOT NULL REFERENCES "PaymentChannel"(id) ON DELETE RESTRICT,
  amount             NUMERIC(14,2) NOT NULL,
  detail             TEXT,
  "occurredAt"       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "createdAt"        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SalaryPayment
CREATE TABLE IF NOT EXISTS "SalaryPayment" (
  id                 TEXT PRIMARY KEY,
  "userId"           TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  month              TEXT NOT NULL,
  "paymentDate"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "absentDays"       NUMERIC(5,1) NOT NULL DEFAULT 0,
  "netPaid"          NUMERIC(14,2) NOT NULL,
  "paymentChannelId" TEXT REFERENCES "PaymentChannel"(id) ON DELETE SET NULL,
  notes              TEXT,
  UNIQUE ("userId", month)
);

-- StaffAdvance
CREATE TABLE IF NOT EXISTS "StaffAdvance" (
  id                 TEXT PRIMARY KEY,
  "userId"           TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  month              TEXT NOT NULL,
  amount             NUMERIC(14,2) NOT NULL,
  date               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "paymentChannelId" TEXT NOT NULL REFERENCES "PaymentChannel"(id) ON DELETE RESTRICT,
  notes              TEXT
);

-- StaffOvertime
CREATE TABLE IF NOT EXISTS "StaffOvertime" (
  id          TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  month       TEXT NOT NULL,
  hours       NUMERIC(6,2) NOT NULL,
  rate        NUMERIC(12,2) NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shift
CREATE TABLE IF NOT EXISTS "Shift" (
  id        TEXT PRIMARY KEY,
  "userId"  TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  date      DATE NOT NULL,
  start     TIMESTAMPTZ NOT NULL,
  "end"     TIMESTAMPTZ NOT NULL,
  status    TEXT NOT NULL DEFAULT 'scheduled',
  notes     TEXT
);

-- TaxConfig (singleton — id is always 'default')
CREATE TABLE IF NOT EXISTS "TaxConfig" (
  id     TEXT PRIMARY KEY DEFAULT 'default',
  rate   NUMERIC(6,4) NOT NULL DEFAULT 0.085,
  label  TEXT NOT NULL DEFAULT 'Tax'
);

-- FiscalConfig (singleton — id is always 'default')
CREATE TABLE IF NOT EXISTS "FiscalConfig" (
  id               TEXT PRIMARY KEY DEFAULT 'default',
  enabled          BOOLEAN NOT NULL DEFAULT false,
  mode             TEXT NOT NULL DEFAULT 'disabled',
  environment      TEXT NOT NULL DEFAULT 'sandbox',
  "posId"          TEXT NOT NULL DEFAULT '',
  "localBaseUrl"   TEXT NOT NULL DEFAULT '',
  "defaultPctCode" TEXT NOT NULL DEFAULT '',
  "businessName"   TEXT,
  bntn             TEXT,
  "accessCode"     TEXT,
  "bearerToken"    TEXT,
  "autoSubmit"     BOOLEAN NOT NULL DEFAULT false,
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FiscalSubmission
CREATE TABLE IF NOT EXISTS "FiscalSubmission" (
  id                    TEXT PRIMARY KEY,
  "orderId"             TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  mode                  TEXT NOT NULL,
  environment           TEXT NOT NULL,
  endpoint              TEXT NOT NULL,
  succeeded             BOOLEAN NOT NULL DEFAULT false,
  "responseCode"        TEXT,
  "responseMessage"     TEXT,
  "errorMessage"        TEXT,
  "fiscalInvoiceNumber" TEXT,
  "attemptedAt"         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "requestBody"         JSONB,
  "responseBody"        JSONB
);

-- PendingMember
CREATE TABLE IF NOT EXISTS "PendingMember" (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PushSubscription
CREATE TABLE IF NOT EXISTS "PushSubscription" (
  endpoint     TEXT PRIMARY KEY,
  "userId"     TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  p256dh       TEXT NOT NULL,
  auth         TEXT NOT NULL,
  "userAgent"  TEXT
);

-- Activity
CREATE TABLE IF NOT EXISTS "Activity" (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  "actorName"   TEXT,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Seed singleton rows so upserts never fail
-- ============================================================
INSERT INTO "TaxConfig" (id, rate, label)
VALUES ('default', 0.085, 'Tax')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "FiscalConfig" (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "Workspace" (id, name, currency, timezone)
VALUES ('default', 'My Cafe', 'PKR', 'Asia/Karachi')
ON CONFLICT (id) DO NOTHING;
