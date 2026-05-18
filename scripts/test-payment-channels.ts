/* eslint-disable no-console */
/**
 * Round-trips PaymentChannel CRUD + transfer flow against the live DB.
 * Mirrors the action shape so the adapter + transaction semantics are
 * exercised end-to-end.
 */

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const url = process.env.DATABASE_URL!;
const prisma = new PrismaClient({ adapter: new PrismaPg(url) });

async function main() {
  const tag = Math.random().toString(36).slice(2, 6).toUpperCase();
  const cash = await prisma.paymentChannel.create({
    data: {
      name: `TEST CASH ${tag}`,
      openingBalance: 67000,
      currentBalance: 67000,
    },
    select: { id: true, name: true, currentBalance: true },
  });
  const easyPaisa = await prisma.paymentChannel.create({
    data: {
      name: `TEST WALLET ${tag}`,
      openingBalance: 9000,
      currentBalance: 9000,
    },
    select: { id: true, name: true, currentBalance: true },
  });
  console.log("Created:", { cash, easyPaisa });

  // Transfer 5000 cash -> wallet
  const transfer = await prisma.$transaction(async (tx) => {
    await tx.paymentChannel.update({
      where: { id: cash.id },
      data: { currentBalance: { decrement: 5000 } },
    });
    await tx.paymentChannel.update({
      where: { id: easyPaisa.id },
      data: { currentBalance: { increment: 5000 } },
    });
    return tx.paymentTransfer.create({
      data: {
        fromId: cash.id,
        toId: easyPaisa.id,
        amount: 5000,
        occurredAt: new Date(),
        note: "Smoke test transfer",
      },
      select: { id: true, amount: true },
    });
  });

  const [cashAfter, walletAfter] = await Promise.all([
    prisma.paymentChannel.findUnique({
      where: { id: cash.id },
      select: { currentBalance: true },
    }),
    prisma.paymentChannel.findUnique({
      where: { id: easyPaisa.id },
      select: { currentBalance: true },
    }),
  ]);
  console.log("After transfer:");
  console.log(`  cash: 67000 -> ${Number(cashAfter!.currentBalance)}`);
  console.log(`  wallet: 9000 -> ${Number(walletAfter!.currentBalance)}`);
  console.log(`  transfer id: ${transfer.id}, amount: ${Number(transfer.amount)}`);

  // Rename test
  const renamed = await prisma.paymentChannel.update({
    where: { id: cash.id },
    data: { name: `TEST CASH ${tag} (RENAMED)` },
    select: { name: true },
  });
  console.log("Renamed:", renamed.name);

  // Archive test
  const archived = await prisma.paymentChannel.update({
    where: { id: easyPaisa.id },
    data: { archived: true, archivedAt: new Date() },
    select: { archived: true },
  });
  console.log("Archived:", archived.archived);

  // List non-archived
  const active = await prisma.paymentChannel.count({
    where: { archived: false, name: { contains: tag } },
  });
  console.log("Active (with tag):", active);

  // Cleanup
  await prisma.paymentTransfer.deleteMany({
    where: { OR: [{ fromId: cash.id }, { toId: cash.id }] },
  });
  await prisma.paymentChannel.deleteMany({
    where: { id: { in: [cash.id, easyPaisa.id] } },
  });
  console.log("Cleaned up.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
