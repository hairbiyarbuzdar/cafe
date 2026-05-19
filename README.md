# Brewline

Café point-of-sale and back-office, built on Next.js 16 + Prisma 7 +
Postgres.

## First-time setup

```bash
# 1. Install
npm install

# 2. Start Postgres (Docker Compose is bundled, but any Postgres works —
#    just edit DATABASE_URL in .env).
npm run db:up

# 3. Wire up the database
cp .env.example .env             # adjust DATABASE_URL if needed
npm run db:generate              # generate the Prisma client
npm run db:push                  # apply the schema to Postgres
npm run db:seed                  # load representative menu/orders/inventory

# 4. Run
npm run dev
# → http://localhost:3000
```

The login page lists the four seeded demo accounts — all share password
`brewline`. The seed creates 4 users, 6 suppliers, 29 inventory items,
6 stations, 8 categories, 65 menu items, 12 historical orders, 15
shifts, and 21 attendance rows.

## Database scripts

| Script | Purpose |
| --- | --- |
| `npm run db:up` / `db:down` | Start / stop the bundled Postgres via Docker Compose |
| `npm run db:generate` | Regenerate `src/generated/prisma` after a schema change |
| `npm run db:push` | Sync the schema with Postgres without writing a migration |
| `npm run db:migrate` | Create + apply a versioned migration |
| `npm run db:seed` | Wipe and reseed the demo data |
| `npm run db:reset` | `migrate reset --force` + reseed |
| `npm run db:studio` | Open Prisma Studio |

## Architecture notes

- **Prisma 7** moved connection config out of `schema.prisma`; ours lives
  in [`prisma.config.ts`](prisma.config.ts) and is loaded by the CLI
  (migrate / studio / db push). The runtime client uses a
  [`PrismaPg`](https://www.prisma.io/docs/orm/overview/databases/postgresql)
  driver adapter — see [`src/lib/prisma.ts`](src/lib/prisma.ts).
- **Auth** lives in `src/lib/actions/auth.ts` (server actions, bcrypt)
  with the cookie shape defined in `src/lib/session.ts`. The edge proxy
  authorises off the role embedded in the cookie so it never hits the DB.
- **Server data** flows through `src/lib/queries/*` — one helper per
  domain, all marked `server-only`. Pages that need shared client state
  (menu, stations, categories, inventory) are seeded via
  [`DataHydrator`](src/providers/data-hydrator.tsx) rendered once in the
  `(app)` layout, then read from the matching Zustand store.
- **POS checkout** runs inside a single Prisma transaction
  (`src/lib/actions/orders.ts`) — inserts the Order + OrderItems,
  spawns one KitchenTicket per routed station, and decrements
  InventoryItem.stock against the menu items' recipes.

## BRA fiscal-device integration

Brewline can push each POS invoice to the **Balochistan Revenue
Authority** per PRAL's "Technical Specification for Data Sharing
through Software Fiscal Device with BRA" (v1.0). Both delivery paths
the spec describes are supported:

| Path | Endpoint | When to pick it |
| --- | --- | --- |
| **Cloud** | `http://ims.pral.com.pk/ims/{sandbox\|production}/api/Live/PostData` | Web POS, multi-device deployments — our server submits with a Bearer token. |
| **Local** | `http://localhost:8524/api/IMSFiscal/GetInvoiceNumberByModel` | The PRAL `IMSSetup.exe` installer is running on the same machine as the cashier's browser. |

### One-time setup

1. **Register the POS with BRA** via [https://bra.gob.pk](https://bra.gob.pk) → *Registration → POS Client Registration*. You'll receive a **POS ID** (numeric) and, depending on the path, an **Access Code** (local device) or a **Bearer token** (cloud).
2. **Add the per-item PCT codes** to your menu. Open *Menu → edit any item* and fill the **PCT code (BRA)** field with the 8-digit Pakistan Customs Tariff code. Items without one fall back to the workspace default — usually `00000000` per the spec.
3. **Configure the workspace** in *Settings → Fiscal device (BRA)*:
   - Toggle **Enable BRA submission** on.
   - Pick **Cloud endpoint** or **Local fiscal device**.
   - Pick **Sandbox** or **Production**.
   - Paste the **POS ID**.
   - Paste the **Bearer token** (cloud) or **Access code** + verify the **Local device URL** (local).
   - Set the **Default PCT code**.
   - Leave **Auto-submit on checkout** on if you want every sale to fiscalize automatically; turn it off to submit manually from the order detail drawer.
   - Click **Test connection** — for local mode it pings `GET /api/IMSFiscal/Get`; for cloud mode it confirms the token is wired.
4. Save. Subsequent POS sales will round-trip through BRA in the same request.

The sandbox sample token from the spec (`1298b5eb-…`) is included in
the placeholder copy so you can try the form before real credentials
arrive.

### Daily usage

- **Place a sale** in `/pos` as normal. When auto-submit is on, the
  fiscal invoice number is stamped onto the order before the checkout
  dialog closes.
- **Open `/orders → click a row`**: the detail drawer shows a
  **Fiscalization (BRA)** section — green badge + fiscal number when
  submitted, otherwise a *Submit to BRA* (or *Retry submission*)
  button with the last error inlined.
- **Audit the log** in *Settings → Fiscal device (BRA)*. The "Recent
  submissions" list shows the last 20 attempts, mode/env, fiscal
  invoice number on success, or the failure reason. The full request
  and response bodies are persisted to `FiscalSubmission` for
  forensics.

### How it works under the hood

- [`src/lib/bra/payload.ts`](src/lib/bra/payload.ts) — pure builder
  that turns one of our orders into the spec's invoice JSON. Strips
  `#` from order numbers for `USIN`, formats `DateTime` as
  `YYYY-MM-DD HH:mm:ss`, maps our `PaymentMethod` to BRA's integer
  enum, normalizes PCT codes (drops dots), and asserts
  ∑items.SaleValue == TotalSaleValue.
- [`src/lib/bra/client.ts`](src/lib/bra/client.ts) — server-only
  HTTP client. Hard-caps requests at 12s via `AbortController` so a
  hung BRA endpoint can never stall checkout. Returns a discriminated
  union (`ok: true | false`) so the action persists either branch
  cleanly.
- [`src/lib/actions/fiscal.ts`](src/lib/actions/fiscal.ts) —
  `updateFiscalConfigAction`, `probeFiscalConnectionAction`,
  `submitInvoiceToBraAction`. The submit action is idempotent:
  re-submitting an already-fiscalized order short-circuits with the
  stored number.
- POS auto-submit lives in
  [`src/lib/actions/orders.ts`](src/lib/actions/orders.ts):
  `maybeSubmitToBra` runs *after* the sale transaction commits. Any
  BRA failure is logged and surfaced for retry — the sale itself is
  never blocked.

### Credentials hygiene

`bearerToken` and `accessCode` live in `FiscalConfig` and are
**never** exposed to the client. The settings panel only shows a
"stored" / "not set" indicator and the input lets you overwrite the
value but never read it back. Leave a credential field blank on save
to keep the existing value.

### What's intentionally out of scope (for now)

- **Credit notes** (refunds → `InvoiceType: 3` with `RefUSIN`).
  Payload supports it; UI wiring on the Refund button is pending.
- **QR code on the receipt.** The fiscal number is captured; the
  receipt template + a QR-rendering lib still need to land.
- **Buyer NTN/CNIC capture on POS.** The `Order` columns exist; the
  cart form doesn't surface them yet.
- **Background retry queue** for orders where the first attempt
  failed — operators retry manually from the drawer today.

## Deferred to a later phase

The DB migration is now feature-complete — `src/mock/` is gone and every
surface (dashboard, reports, recent activity, inventory trend, staff
schedule + attendance, tables, kitchen tickets) reads from Postgres.
What's still on the to-do list:

- **Schedule editor UI.** `Shift` rows persist and the grid reads from
  the DB, but there's no in-app create/edit/delete control yet — the
  seed is the only writer. A "Add shift" dialog wired to a
  `createShiftAction` is the next step.
- **Attendance capture.** The `Attendance` table is read by the chart
  but nothing writes to it during day-to-day use. Punch-in/punch-out
  hooks (or a daily reconciliation job) need to land before the
  numbers reflect real adherence.
- **Credit notes**, **QR on receipt**, **buyer NTN/CNIC on POS**, and
  the **BRA retry queue** — see the BRA section above.
