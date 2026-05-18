/* eslint-disable no-console */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

async function main() {
  const ch = await prisma.paymentChannel.create({
    data: { name: "RESTORE TEST", openingBalance: 1000, currentBalance: 1500 },
    select: { id: true, archived: true },
  });
  console.log("created archived=false:", ch);

  await prisma.paymentChannel.update({
    where: { id: ch.id },
    data: { archived: true, archivedAt: new Date() },
  });
  const arc = await prisma.paymentChannel.findUnique({
    where: { id: ch.id },
    select: { archived: true, archivedAt: true },
  });
  console.log("after archive:", arc);

  await prisma.paymentChannel.update({
    where: { id: ch.id },
    data: { archived: false, archivedAt: null },
  });
  const rest = await prisma.paymentChannel.findUnique({
    where: { id: ch.id },
    select: { archived: true, archivedAt: true, currentBalance: true },
  });
  console.log("after restore:", {
    archived: rest!.archived,
    archivedAt: rest!.archivedAt,
    currentBalance: Number(rest!.currentBalance),
  });

  await prisma.paymentChannel.delete({ where: { id: ch.id } });
  console.log("cleanup ok");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
