/* eslint-disable no-console */
/**
 * End-to-end check of the two-step invite flow: Staff page creates a
 * PendingMember; Settings → Team promotes that draft to a User.
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
  const email = `flow-${Date.now()}@brewline.test`;

  console.log("Step 1: add member (Staff page)");
  const draft = await prisma.pendingMember.create({
    data: { name: "Flow Tester", email },
    select: { id: true, name: true, email: true },
  });
  console.log("  pending:", draft);

  const pendingList = await prisma.pendingMember.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  console.log("  visible in invite dropdown:", pendingList.some((p) => p.id === draft.id));

  console.log("Step 2: invite (Settings → Team)");
  const promoted = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: draft.name,
        email: draft.email,
        role: "cashier",
        passwordHash: await bcrypt.hash("hunter22", 10),
      },
      select: { id: true, name: true, email: true, role: true },
    });
    await tx.pendingMember.delete({ where: { id: draft.id } });
    return user;
  });
  console.log("  user:", promoted);

  const stillPending = await prisma.pendingMember.findUnique({
    where: { id: draft.id },
  });
  console.log("  pending row removed:", stillPending === null);

  // Cleanup
  await prisma.user.delete({ where: { id: promoted.id } });
  console.log("  cleaned up.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
