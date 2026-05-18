/* eslint-disable no-console */
/**
 * Exercises the receive-stock and add-member write paths against the
 * live DB so the new server actions are runtime-verified. Mirrors the
 * action shape rather than importing them (those use `next/headers`).
 */

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const url = process.env.DATABASE_URL!;
const prisma = new PrismaClient({ adapter: new PrismaPg(url) });

async function receiveStock() {
  const itemId = "inv_004"; // Whole milk
  const before = await prisma.inventoryItem.findUnique({
    where: { id: itemId },
    select: { stock: true, unit: true },
  });

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.inventoryItem.update({
      where: { id: itemId },
      data: { stock: { increment: 6 }, lastRestocked: new Date() },
      select: { stock: true },
    });
    await tx.inventoryMovement.create({
      data: {
        inventoryItemId: itemId,
        delta: 6,
        reason: "Test receive (delivery slip #TST)",
      },
    });
    return next;
  });

  console.log("Receive stock:", {
    before: Number(before!.stock),
    after: Number(updated.stock),
    unit: before!.unit,
  });

  // Roll back so the seeded state stays stable.
  await prisma.$transaction(async (tx) => {
    await tx.inventoryMovement.deleteMany({
      where: { inventoryItemId: itemId, reason: "Test receive (delivery slip #TST)" },
    });
    await tx.inventoryItem.update({
      where: { id: itemId },
      data: { stock: Number(before!.stock) },
    });
  });
}

async function addMember() {
  const email = `test-${Date.now()}@brewline.test`;
  const user = await prisma.user.create({
    data: {
      name: "Test Member",
      email,
      role: "cashier",
      passwordHash: await bcrypt.hash("hunter22", 10),
    },
    select: { id: true, email: true, role: true },
  });
  console.log("Add member:", user);

  // Cleanup
  await prisma.user.delete({ where: { id: user.id } });
}

async function main() {
  await receiveStock();
  await addMember();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
