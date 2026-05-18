/* eslint-disable no-console */
/**
 * Runs the POS checkout flow end-to-end against the live DB,
 * bypassing the Next request context. Mirrors the transaction shape
 * of `createOrderAction` so it catches schema/adapter issues that
 * would only surface at button-click time.
 *
 *   tsx scripts/test-checkout.ts
 */

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required");

const prisma = new PrismaClient({ adapter: new PrismaPg(url) });

async function main() {
  const before = await prisma.order.count();
  const invBefore = await prisma.inventoryItem.findMany({
    where: { id: { in: ["inv_001", "inv_004"] } },
    select: { id: true, stock: true },
  });

  // Two lattes + one almond croissant
  const productIds = ["m_005", "m_050"];
  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: productIds } },
    include: { recipe: true },
  });
  const lines = [
    { productId: "m_005", quantity: 2 },
    { productId: "m_050", quantity: 1 },
  ];

  const priced = lines.map((l) => {
    const m = menuItems.find((x) => x.id === l.productId)!;
    return {
      line: l,
      name: m.name,
      unitPrice: Number(m.price),
      stationId: m.stationId,
      recipe: m.recipe.map((r) => ({
        inventoryItemId: r.inventoryItemId,
        quantity: Number(r.quantity),
      })),
    };
  });

  const subtotal = priced.reduce((s, p) => s + p.unitPrice * p.line.quantity, 0);
  const tax = Math.round(subtotal * 0.085 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const ingredient = new Map<string, number>();
  for (const p of priced) {
    for (const r of p.recipe) {
      ingredient.set(
        r.inventoryItemId,
        (ingredient.get(r.inventoryItemId) ?? 0) + r.quantity * p.line.quantity,
      );
    }
  }
  const stationIds = Array.from(new Set(priced.map((p) => p.stationId)));

  async function nextOrderNumber(): Promise<string> {
    let n = before + 1 + 5800;
    for (let i = 0; i < 25; i++) {
      const taken = await prisma.order.findUnique({
        where: { number: `#${n}` },
        select: { id: true },
      });
      if (!taken) return `#${n}`;
      n += 1;
    }
    return `#${n}`;
  }
  const orderNumber = await nextOrderNumber();

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        number: orderNumber,
        status: "pending",
        channel: "dine-in",
        subtotal,
        tax,
        total,
        payment: "card",
        staffId: "usr_elena",
        items: {
          create: priced.map((p) => ({
            menuItemId: p.line.productId,
            name: p.name,
            quantity: p.line.quantity,
            unitPrice: p.unitPrice,
          })),
        },
        tickets: {
          create: stationIds.map((stationId) => ({
            stationId,
            status: "pending" as const,
          })),
        },
      },
      include: { items: true, tickets: true },
    });

    for (const [id, qty] of ingredient) {
      await tx.inventoryItem.update({
        where: { id },
        data: { stock: { decrement: qty } },
      });
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: id,
          delta: -qty,
          reason: `Sold via order ${orderNumber}`,
          orderId: order.id,
        },
      });
    }

    return order;
  });

  const after = await prisma.order.count();
  const invAfter = await prisma.inventoryItem.findMany({
    where: { id: { in: ["inv_001", "inv_004"] } },
    select: { id: true, stock: true },
  });

  console.log("Created:", {
    id: result.id,
    number: result.number,
    items: result.items.length,
    tickets: result.tickets.length,
    total,
  });
  console.log("Order count:", { before, after });
  console.log("Inventory delta:");
  for (const i of invBefore) {
    const a = invAfter.find((x) => x.id === i.id)!;
    console.log(
      `  ${i.id}: ${Number(i.stock).toFixed(3)} → ${Number(a.stock).toFixed(3)} (Δ ${(Number(a.stock) - Number(i.stock)).toFixed(3)})`,
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
