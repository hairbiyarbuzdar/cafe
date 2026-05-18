/* eslint-disable no-console */
/**
 * Builds the BRA invoice payload from a real seeded order, dumps it
 * to stdout for human inspection, and probes the sandbox cloud
 * endpoint with the spec's sample bearer token to see whether BRA
 * actually accepts our shape.
 *
 * The `submitInvoiceToBra` client itself is `server-only`, so we
 * re-implement the HTTP call here to keep tsx happy.
 *
 * Run: tsx scripts/test-bra-payload.ts
 */

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";
import { buildBraInvoicePayload } from "../src/lib/bra/payload";
import type { OrderChannel, OrderItem, PaymentMethod } from "../src/types";

try {
  process.loadEnvFile(".env");
} catch {}

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

const SANDBOX_URL = "http://ims.pral.com.pk/ims/sandbox/api/Live/PostData";
const SANDBOX_TOKEN = "1298b5eb-b252-3d97-8622-a4a69d5bf818";
const DEMO_POS_ID = "900005";

async function main() {
  const order = await prisma.order.findFirst({
    where: { status: { in: ["pending", "preparing", "ready", "completed"] } },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  if (!order) {
    console.error("No order to test with. Run npm run db:seed first.");
    process.exit(1);
  }

  const menuItemIds = Array.from(new Set(order.items.map((i) => i.menuItemId)));
  const pctRows = await prisma.menuItem.findMany({
    where: { id: { in: menuItemIds } },
    select: { id: true, pctCode: true },
  });
  const pctByMenuItemId = new Map(pctRows.map((m) => [m.id, m.pctCode]));

  const payload = buildBraInvoicePayload({
    order: {
      number: order.number,
      channel: order.channel as OrderChannel,
      customer: order.customerName
        ? { name: order.customerName, phone: order.customerPhone ?? undefined }
        : undefined,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      tip: order.tip != null ? Number(order.tip) : undefined,
      discount: order.discount != null ? Number(order.discount) : undefined,
      total: Number(order.total),
      payment: order.payment as PaymentMethod,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map<OrderItem>((i) => ({
        id: i.id,
        productId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
        note: i.note ?? undefined,
      })),
      buyerNtn: order.buyerNtn,
      buyerCnic: order.buyerCnic,
    },
    posId: DEMO_POS_ID,
    defaultPctCode: "00000000",
    pctCodeByMenuItemId: pctByMenuItemId,
    taxRate: 0.085,
  });

  console.log("=== BRA payload (excerpt) ===");
  console.log(
    JSON.stringify(
      {
        USIN: payload.USIN,
        POSID: payload.POSID,
        DateTime: payload.DateTime,
        TotalSaleValue: payload.TotalSaleValue,
        TotalTaxCharged: payload.TotalTaxCharged,
        TotalBillAmount: payload.TotalBillAmount,
        TotalQuantity: payload.TotalQuantity,
        PaymentMode: payload.PaymentMode,
        InvoiceType: payload.InvoiceType,
        Items: payload.Items.map((i) => ({
          ItemCode: i.ItemCode,
          ItemName: i.ItemName,
          PCTCode: i.PCTCode,
          Quantity: i.Quantity,
          SaleValue: i.SaleValue,
          TaxCharged: i.TaxCharged,
          TotalAmount: i.TotalAmount,
        })),
      },
      null,
      2,
    ),
  );

  const sumItems = payload.Items.reduce((s, i) => s + i.SaleValue, 0);
  console.log(
    "\n  ∑ items.SaleValue:",
    sumItems.toFixed(2),
    "vs TotalSaleValue:",
    payload.TotalSaleValue.toFixed(2),
    sumItems.toFixed(2) === payload.TotalSaleValue.toFixed(2) ? "✓" : "✗",
  );

  console.log("\n=== Sandbox probe ===");
  console.log("POST", SANDBOX_URL);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(SANDBOX_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SANDBOX_TOKEN}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const text = await res.text();
    console.log("HTTP", res.status);
    console.log(text.slice(0, 600));
  } catch (err) {
    console.error(
      "Sandbox unreachable:",
      err instanceof Error ? err.message : err,
    );
    console.log(
      "(Expected if the BRA cloud endpoint is firewalled from your network.)",
    );
  } finally {
    clearTimeout(t);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
