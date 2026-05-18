/* eslint-disable no-console */
/**
 * Exercises the auto-submit path: enable FiscalConfig with a known-
 * unreachable cloud URL, place an order via direct Prisma writes (we
 * skip the server action because it depends on next/headers), then
 * simulate the BRA submission to confirm the failure is captured in
 * FiscalSubmission and surfaced on the order.
 *
 * Run: tsx scripts/test-bra-checkout.ts
 */

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma";
import { buildBraInvoicePayload } from "../src/lib/bra/payload";

try {
  process.loadEnvFile(".env");
} catch {}

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env.DATABASE_URL!),
});

async function main() {
  // Ensure a fiscal config exists, enabled, cloud mode, sandbox env.
  const cfg = await prisma.fiscalConfig.upsert({
    where: { id: "default" },
    update: {
      enabled: true,
      mode: "cloud",
      environment: "sandbox",
      posId: "900005",
      bearerToken: "1298b5eb-b252-3d97-8622-a4a69d5bf818",
      defaultPctCode: "00000000",
      autoSubmit: true,
    },
    create: {
      id: "default",
      enabled: true,
      mode: "cloud",
      environment: "sandbox",
      posId: "900005",
      bearerToken: "1298b5eb-b252-3d97-8622-a4a69d5bf818",
      defaultPctCode: "00000000",
      autoSubmit: true,
    },
  });
  console.log("Config:", {
    enabled: cfg.enabled,
    mode: cfg.mode,
    env: cfg.environment,
    posId: cfg.posId,
  });

  const order = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
  if (!order) throw new Error("Seed the DB first.");
  console.log("Order:", { id: order.id, number: order.number });

  const payload = buildBraInvoicePayload({
    order: {
      number: order.number,
      channel: order.channel as never,
      customer: order.customerName
        ? { name: order.customerName, phone: order.customerPhone ?? undefined }
        : undefined,
      subtotal: Number(order.subtotal),
      tax: Number(order.tax),
      tip: order.tip != null ? Number(order.tip) : undefined,
      discount: order.discount != null ? Number(order.discount) : undefined,
      total: Number(order.total),
      payment: order.payment as never,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({
        id: i.id,
        productId: i.menuItemId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        modifiers: Array.isArray(i.modifiers) ? (i.modifiers as string[]) : [],
        note: i.note ?? undefined,
      })),
      buyerNtn: order.buyerNtn,
      buyerCnic: order.buyerCnic,
    },
    posId: cfg.posId!,
    defaultPctCode: cfg.defaultPctCode,
    taxRate: 0.085,
  });

  // Simulate the failure branch of the action — write a FiscalSubmission
  // row + update the order, matching what submitInvoiceToBraAction does
  // when the upstream call fails.
  const sub = await prisma.fiscalSubmission.create({
    data: {
      orderId: order.id,
      mode: cfg.mode,
      environment: cfg.environment,
      endpoint: "http://ims.pral.com.pk/ims/sandbox/api/Live/PostData",
      succeeded: false,
      errorMessage: "Smoke test — sandbox unreachable from this network",
      requestBody: payload as unknown as object,
    },
    select: { id: true, succeeded: true, errorMessage: true },
  });
  console.log("Submission row:", sub);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      fiscalAttempts: { increment: 1 },
      fiscalLastError: sub.errorMessage,
    },
  });

  // Now simulate the success branch to make sure the success path also
  // wires up correctly.
  const successSub = await prisma.fiscalSubmission.create({
    data: {
      orderId: order.id,
      mode: cfg.mode,
      environment: cfg.environment,
      endpoint: "http://ims.pral.com.pk/ims/sandbox/api/Live/PostData",
      succeeded: true,
      fiscalInvoiceNumber: "9000052026051899999",
      responseCode: "100",
      responseMessage: "Fiscal Invoice Number generated successfully.",
      requestBody: payload as unknown as object,
      responseBody: {
        InvoiceNumber: "9000052026051899999",
        Code: "100",
        Response: "Fiscal Invoice Number generated successfully.",
      },
    },
    select: { id: true, fiscalInvoiceNumber: true },
  });
  console.log("Success submission:", successSub);

  await prisma.order.update({
    where: { id: order.id },
    data: {
      fiscalInvoiceNumber: successSub.fiscalInvoiceNumber,
      fiscalSubmittedAt: new Date(),
      fiscalAttempts: { increment: 1 },
      fiscalLastError: null,
    },
  });

  // Read it back to confirm everything lines up.
  const after = await prisma.order.findUnique({
    where: { id: order.id },
    select: {
      fiscalInvoiceNumber: true,
      fiscalSubmittedAt: true,
      fiscalAttempts: true,
      fiscalLastError: true,
    },
  });
  console.log("Order after fiscal update:", after);

  const log = await prisma.fiscalSubmission.findMany({
    where: { orderId: order.id },
    orderBy: { attemptedAt: "desc" },
    take: 3,
    select: {
      succeeded: true,
      responseCode: true,
      errorMessage: true,
      attemptedAt: true,
    },
  });
  console.log("Recent submissions for this order:");
  for (const r of log) console.log(" ", r);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
