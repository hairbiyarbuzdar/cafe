/* eslint-disable no-console */
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";

try {
  process.loadEnvFile(".env");
} catch {}

const prisma = new PrismaClient({ adapter: new PrismaPg(process.env.DATABASE_URL!) });

const SEED = [
  { name: "CASH", openingBalance: 67000, currentBalance: 69340 },
  { name: "EASYPAISA", openingBalance: 9000, currentBalance: 6680 },
  { name: "MEZZAN 8383", openingBalance: 93000, currentBalance: 109848 },
];

async function main() {
  const existing = await prisma.paymentChannel.count();
  if (existing > 0) {
    console.log(`Skipping seed — ${existing} payment channel(s) already exist.`);
    return;
  }
  await prisma.paymentChannel.createMany({ data: SEED });
  console.log(`Seeded ${SEED.length} payment channels.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
