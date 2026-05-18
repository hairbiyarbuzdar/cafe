/* eslint-disable no-console */
/**
 * Round-trips updateUserRoleAction, updateMemberAction, and
 * removeMemberAction against the live DB. Doesn't import the actions
 * directly (they call next/headers); replays the equivalent Prisma
 * writes so adapter + FK behavior is exercised.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const url = process.env.DATABASE_URL!;
const prisma = new PrismaClient({ adapter: new PrismaPg(url) });

async function main() {
  // 1. Create a test user and tag an order to them so FK SetNull is exercised on delete.
  const user = await prisma.user.create({
    data: {
      name: "Mutation Tester",
      email: `mut-${Date.now()}@brewline.test`,
      role: "cashier",
      passwordHash: await bcrypt.hash("hunter22", 10),
    },
    select: { id: true, name: true, email: true, role: true },
  });
  console.log("Created:", user);

  // Pick any existing order and reassign it to our test user.
  const order = await prisma.order.findFirst({ select: { id: true, staffId: true } });
  if (order) {
    await prisma.order.update({
      where: { id: order.id },
      data: { staffId: user.id },
    });
  }

  // 2. Role update
  const promoted = await prisma.user.update({
    where: { id: user.id },
    data: { role: "manager" },
    select: { role: true },
  });
  console.log("Role updated:", promoted.role);

  // 3. Name + email patch
  const renamed = await prisma.user.update({
    where: { id: user.id },
    data: { name: "Renamed Tester", email: `renamed-${Date.now()}@brewline.test` },
    select: { name: true, email: true },
  });
  console.log("Patched:", renamed);

  // 4. Remove the user — SetNull on Order.staffId should fire.
  await prisma.user.delete({ where: { id: user.id } });
  const orphan = order
    ? await prisma.order.findUnique({
        where: { id: order.id },
        select: { staffId: true },
      })
    : null;
  console.log("Deleted user; order.staffId now:", orphan?.staffId ?? "null");

  if (order && order.staffId) {
    await prisma.order.update({
      where: { id: order.id },
      data: { staffId: order.staffId },
    });
  }
  console.log("Restored order staffId for cleanup.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
