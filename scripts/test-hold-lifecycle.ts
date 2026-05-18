/* eslint-disable no-console */
/**
 * End-to-end smoke for the hold → add → cancel and hold → add → pay
 * lifecycles. Replays what each server action does directly against
 * Prisma so the adapter + FK + transaction semantics are exercised
 * outside of Next request context.
 */

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

async function snapshotInventory(ids: string[]) {
  const rows = await prisma.inventoryItem.findMany({
    where: { id: { in: ids } },
    select: { id: true, stock: true, name: true },
  });
  return Object.fromEntries(
    rows.map((r) => [r.id, { stock: Number(r.stock), name: r.name }]),
  );
}

async function nextOrderNumber() {
  const count = await prisma.order.count();
  let n = count + 1 + 5800;
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

async function placeHeld(menuItemId: string, quantity = 2) {
  const item = await prisma.menuItem.findUnique({
    where: { id: menuItemId },
    include: { recipe: true },
  });
  if (!item) throw new Error(`menu item ${menuItemId} missing`);

  const subtotal = Number(item.price) * quantity;
  const tax = Math.round(subtotal * 0.085 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const number = await nextOrderNumber();

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        number,
        status: "pending",
        channel: "dine-in",
        subtotal,
        tax,
        total,
        payment: null,
        paidAt: null,
        items: {
          create: [
            {
              menuItemId: item.id,
              name: item.name,
              quantity,
              unitPrice: Number(item.price),
            },
          ],
        },
        tickets: {
          create: [{ stationId: item.stationId, status: "pending" }],
        },
      },
      include: { tickets: true },
    });
    for (const r of item.recipe) {
      const delta = Number(r.quantity) * quantity;
      await tx.inventoryItem.update({
        where: { id: r.inventoryItemId },
        data: { stock: { decrement: delta } },
      });
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: r.inventoryItemId,
          delta: -delta,
          reason: `Placed via order ${number}`,
          orderId: order.id,
        },
      });
    }
    return order;
  });
}

async function addItems(orderId: string, menuItemId: string, quantity: number) {
  const [item, order] = await Promise.all([
    prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: { recipe: true },
    }),
    prisma.order.findUnique({ where: { id: orderId } }),
  ]);
  if (!item || !order) throw new Error("missing");
  const addedSubtotal = Number(item.price) * quantity;
  const newSubtotal = Number(order.subtotal) + addedSubtotal;
  const tax = Math.round(newSubtotal * 0.085 * 100) / 100;
  const total = Math.round((newSubtotal + tax) * 100) / 100;
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        subtotal: newSubtotal,
        tax,
        total,
        items: {
          create: [
            {
              menuItemId: item.id,
              name: item.name,
              quantity,
              unitPrice: Number(item.price),
            },
          ],
        },
      },
    });
    const existing = await tx.kitchenTicket.findUnique({
      where: {
        orderId_stationId: { orderId, stationId: item.stationId },
      },
    });
    if (!existing) {
      await tx.kitchenTicket.create({
        data: { orderId, stationId: item.stationId, status: "pending" },
      });
    }
    for (const r of item.recipe) {
      const delta = Number(r.quantity) * quantity;
      await tx.inventoryItem.update({
        where: { id: r.inventoryItemId },
        data: { stock: { decrement: delta } },
      });
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: r.inventoryItemId,
          delta: -delta,
          reason: `Added to order ${order.number}`,
          orderId,
        },
      });
    }
  });
}

async function cancelHeld(orderId: string) {
  const consumed = await prisma.inventoryMovement.findMany({
    where: { orderId, delta: { lt: 0 } },
    select: { inventoryItemId: true, delta: true },
  });
  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: { status: "cancelled" },
    });
    await tx.kitchenTicket.updateMany({
      where: { orderId, status: { not: "cancelled" } },
      data: { status: "cancelled" },
    });
    const restore = new Map<string, number>();
    for (const m of consumed) {
      const qty = -Number(m.delta);
      restore.set(m.inventoryItemId, (restore.get(m.inventoryItemId) ?? 0) + qty);
    }
    for (const [id, qty] of restore) {
      await tx.inventoryItem.update({
        where: { id },
        data: { stock: { increment: qty } },
      });
      await tx.inventoryMovement.create({
        data: {
          inventoryItemId: id,
          delta: qty,
          reason: `Cancelled order`,
          orderId,
        },
      });
    }
  });
}

async function pay(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      payment: "card",
      paidAt: new Date(),
      status: "completed",
    },
  });
}

async function deleteOrder(orderId: string) {
  await prisma.fiscalSubmission.deleteMany({ where: { orderId } });
  await prisma.kitchenTicket.deleteMany({ where: { orderId } });
  await prisma.orderItem.deleteMany({ where: { orderId } });
  await prisma.inventoryMovement.deleteMany({ where: { orderId } });
  await prisma.order.delete({ where: { id: orderId } });
}

async function main() {
  // m_005 = Latte (recipe: 0.009 kg coffee + 0.22 L milk)
  // m_050 = Almond Croissant (recipe: 1 pcs dough)
  const ingredients = ["inv_001", "inv_004", "inv_012"];

  console.log("=== Lifecycle A: place → add → cancel → restore ===");
  const before = await snapshotInventory(ingredients);
  console.log(
    "  before:",
    Object.entries(before).map(([id, v]) => `${id}=${v.stock.toFixed(3)}`).join(" · "),
  );

  const orderA = await placeHeld("m_005", 2);
  console.log(`  placed ${orderA.number} (held), tickets=${orderA.tickets.length}`);
  await addItems(orderA.id, "m_050", 1);
  console.log("  added 1 croissant");

  const after = await snapshotInventory(ingredients);
  console.log(
    "  after place+add:",
    Object.entries(after).map(([id, v]) => `${id}=${v.stock.toFixed(3)}`).join(" · "),
  );

  await cancelHeld(orderA.id);
  const restored = await snapshotInventory(ingredients);
  console.log(
    "  after cancel:",
    Object.entries(restored).map(([id, v]) => `${id}=${v.stock.toFixed(3)}`).join(" · "),
  );

  const ticketsAfter = await prisma.kitchenTicket.findMany({
    where: { orderId: orderA.id },
    select: { status: true, stationId: true },
  });
  console.log(
    "  tickets after cancel:",
    ticketsAfter.map((t) => `${t.stationId}=${t.status}`).join(", "),
  );

  for (const id of ingredients) {
    const drift = restored[id]!.stock - before[id]!.stock;
    if (Math.abs(drift) > 0.0001) {
      console.log(`  ✗ ${id} drifted ${drift.toFixed(3)} (expected 0)`);
    } else {
      console.log(`  ✓ ${id} restored to opening`);
    }
  }
  await deleteOrder(orderA.id);

  console.log("\n=== Lifecycle B: place → add → pay ===");
  const orderB = await placeHeld("m_005", 1);
  await addItems(orderB.id, "m_050", 2);
  console.log(`  placed ${orderB.number} + 2 croissants`);
  await pay(orderB.id);
  const finalOrder = await prisma.order.findUnique({
    where: { id: orderB.id },
    select: {
      status: true,
      payment: true,
      paidAt: true,
      total: true,
    },
  });
  console.log("  after pay:", {
    status: finalOrder!.status,
    payment: finalOrder!.payment,
    paidAt: finalOrder!.paidAt?.toISOString(),
    total: Number(finalOrder!.total),
  });
  await deleteOrder(orderB.id);

  console.log("\nAll cleaned up.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
