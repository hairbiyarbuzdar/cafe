/* eslint-disable no-console */
/**
 * Cafe Management System wipe.
 *
 * Empties every data table in dependency order, leaving the schema
 * intact. After this, /login auto-redirects to /onboarding so the
 * operator can create the first admin from scratch.
 *
 *   npm run db:wipe
 */

import { PrismaClient } from "../src/generated/prisma";
import { createPgAdapter } from "../src/lib/db-adapter";
import { resolveDatabaseUrl } from "../src/lib/db-url";

try {
  process.loadEnvFile(".env");
} catch {
  // .env optional
}

const databaseUrl = resolveDatabaseUrl();
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to wipe");
}

const prisma = new PrismaClient({ adapter: createPgAdapter(databaseUrl) });

async function main() {
  console.log("→ Wiping every data table");

  // Leaf tables first; cascade-safe order.
  await prisma.fiscalSubmission.deleteMany();
  await prisma.kitchenTicket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.kitchenStation.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.table.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.pendingMember.deleteMany();
  await prisma.paymentTransfer.deleteMany();
  await prisma.paymentChannel.deleteMany();
  await prisma.fiscalConfig.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Database empty. Open /login → you'll be sent to /onboarding to create the first admin.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
