"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { PaymentMethod } from "@/types";

const PAYMENT_KINDS: readonly PaymentMethod[] = [
  "cash",
  "card",
  "wallet",
  "online",
];

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

// ──────────────────────────────────────────────────────────────
// Channel CRUD
// ──────────────────────────────────────────────────────────────

export type CreateChannelInput = {
  name: string;
  kind: PaymentMethod;
  openingBalance: number;
};

export async function createPaymentChannelAction(
  input: CreateChannelInput,
): Promise<ActionResult<{ id: string }>> {
  const name = input.name?.trim();
  if (!name || name.length < 2) {
    return { ok: false, error: "Name is required" };
  }
  if (!PAYMENT_KINDS.includes(input.kind)) {
    return { ok: false, error: "Pick a payment kind" };
  }
  if (!Number.isFinite(input.openingBalance) || input.openingBalance < 0) {
    return { ok: false, error: "Opening balance must be 0 or greater" };
  }

  const existing = await prisma.paymentChannel.findUnique({
    where: { name },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: `"${name}" already exists` };
  }

  try {
    const created = await prisma.paymentChannel.create({
      data: {
        name,
        kind: input.kind,
        openingBalance: input.openingBalance,
        currentBalance: input.openingBalance,
      },
      select: { id: true },
    });
    revalidatePath("/settings");
    revalidatePath("/pos");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createPaymentChannelAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to add method",
    };
  }
}

/**
 * Update the `kind` (cash/card/wallet/online) of a channel. The
 * channel's id and name stay the same; only the icon + fiscal
 * mapping shifts.
 */
export async function updatePaymentChannelKindAction(
  id: string,
  kind: PaymentMethod,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "No method specified" };
  if (!PAYMENT_KINDS.includes(kind)) {
    return { ok: false, error: "Invalid kind" };
  }
  try {
    await prisma.paymentChannel.update({ where: { id }, data: { kind } });
    revalidatePath("/settings");
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("updatePaymentChannelKindAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update kind",
    };
  }
}

export async function renamePaymentChannelAction(
  id: string,
  name: string,
): Promise<ActionResult> {
  const next = name?.trim();
  if (!id) return { ok: false, error: "No method specified" };
  if (!next || next.length < 2) return { ok: false, error: "Name is required" };

  const conflict = await prisma.paymentChannel.findFirst({
    where: { name: next, NOT: { id } },
    select: { id: true },
  });
  if (conflict) return { ok: false, error: `"${next}" already exists` };

  try {
    await prisma.paymentChannel.update({ where: { id }, data: { name: next } });
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("renamePaymentChannelAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to rename",
    };
  }
}

export async function archivePaymentChannelAction(
  id: string,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "No method specified" };
  try {
    await prisma.paymentChannel.update({
      where: { id },
      data: { archived: true, archivedAt: new Date() },
    });
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("archivePaymentChannelAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to archive",
    };
  }
}

/**
 * Reverse an archive. The name unique constraint applies across both
 * archived and active rows, so there's no chance of a clash on restore —
 * the name was reserved the whole time the row was archived.
 */
export async function restorePaymentChannelAction(
  id: string,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "No method specified" };
  const target = await prisma.paymentChannel.findUnique({
    where: { id },
    select: { archived: true },
  });
  if (!target) return { ok: false, error: "Method not found" };
  if (!target.archived) return { ok: true };

  try {
    await prisma.paymentChannel.update({
      where: { id },
      data: { archived: false, archivedAt: null },
    });
    revalidatePath("/settings");
    return { ok: true };
  } catch (err) {
    console.error("restorePaymentChannelAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to restore",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Transfers
// ──────────────────────────────────────────────────────────────

export type CreateTransferInput = {
  fromId: string;
  toId: string;
  amount: number;
  occurredAt: string;
  note?: string;
};

export async function createTransferAction(
  input: CreateTransferInput,
): Promise<ActionResult<{ id: string }>> {
  if (!input.fromId || !input.toId) {
    return { ok: false, error: "Pick both sides of the transfer" };
  }
  if (input.fromId === input.toId) {
    return { ok: false, error: "Source and destination must differ" };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero" };
  }
  const occurredAt = new Date(input.occurredAt);
  if (Number.isNaN(occurredAt.getTime())) {
    return { ok: false, error: "Invalid date" };
  }

  const [from, to] = await Promise.all([
    prisma.paymentChannel.findUnique({
      where: { id: input.fromId },
      select: { id: true, name: true, archived: true, currentBalance: true },
    }),
    prisma.paymentChannel.findUnique({
      where: { id: input.toId },
      select: { id: true, name: true, archived: true },
    }),
  ]);
  if (!from || !to) return { ok: false, error: "Method not found" };
  if (from.archived || to.archived) {
    return { ok: false, error: "Archived methods can't be used for transfers" };
  }
  if (toNumber(from.currentBalance) < input.amount) {
    return {
      ok: false,
      error: `${from.name} only has Rs ${toNumber(from.currentBalance).toLocaleString()} available`,
    };
  }

  try {
    const transfer = await prisma.$transaction(async (tx) => {
      await tx.paymentChannel.update({
        where: { id: input.fromId },
        data: { currentBalance: { decrement: input.amount } },
      });
      await tx.paymentChannel.update({
        where: { id: input.toId },
        data: { currentBalance: { increment: input.amount } },
      });
      return tx.paymentTransfer.create({
        data: {
          fromId: input.fromId,
          toId: input.toId,
          amount: input.amount,
          occurredAt,
          note: input.note?.trim() || null,
        },
        select: { id: true },
      });
    });
    revalidatePath("/settings");
    return { ok: true, data: { id: transfer.id } };
  } catch (err) {
    console.error("createTransferAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Transfer failed",
    };
  }
}

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}
