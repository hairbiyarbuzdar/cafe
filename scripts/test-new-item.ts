/* eslint-disable no-console */
/**
 * Round-trips `createInventoryItemAction` against the live DB so the
 * server action stays exercised outside of a click test.
 */

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const url = process.env.DATABASE_URL!;
const prisma = new PrismaClient({ adapter: new PrismaPg(url) });

async function main() {
  const sku = `TST-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  // Mirror the action's logic to keep this independent of the Next runtime.
  const created = await prisma.inventoryItem.create({
    data: {
      name: "Test ingredient",
      sku,
      category: "Pantry",
      unit: "kg",
      stock: 5,
      reorderLevel: 2,
      costPerUnit: 1.25,
      supplierId: null,
      lastRestocked: new Date(),
    },
    select: { id: true, sku: true, stock: true },
  });
  await prisma.inventoryMovement.create({
    data: {
      inventoryItemId: created.id,
      delta: 5,
      reason: "Initial stock on creation",
    },
  });

  const movement = await prisma.inventoryMovement.findFirst({
    where: { inventoryItemId: created.id },
    select: { delta: true, reason: true },
  });

  console.log("Created:", created);
  console.log("Movement:", movement);

  // Cleanup so reruns stay green
  await prisma.inventoryMovement.deleteMany({ where: { inventoryItemId: created.id } });
  await prisma.inventoryItem.delete({ where: { id: created.id } });
  console.log("Cleaned up.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
