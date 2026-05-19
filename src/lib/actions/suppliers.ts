"use server";

import { revalidatePath } from "next/cache";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";
import {
  getSupplierLedger,
  type SupplierLedger,
} from "@/lib/queries/suppliers";

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export type CreateSupplierInput = {
  name: string;
  address?: string | null;
  phone?: string | null;
};

export type CreateSupplierResult =
  | { ok: true; id: string; name: string }
  | { ok: false; error: string };

export async function createSupplierAction(
  input: CreateSupplierInput,
): Promise<CreateSupplierResult> {
  const name = input.name?.trim();
  if (!name) return { ok: false, error: "Name is required" };
  if (name.length > 80) return { ok: false, error: "Name is too long" };

  const address = input.address?.trim() || null;
  const phone = input.phone?.trim() || null;

  try {
    const created = await prisma.supplier.create({
      data: { name, address, phone },
      select: { id: true, name: true },
    });

    revalidatePath("/inventory");

    await logActivity({
      type: "stock",
      title: `Supplier added — ${created.name}`,
      description: phone
        ? `Phone ${phone}${address ? ` · ${address}` : ""}`
        : address ?? "No contact details on file",
    });

    return { ok: true, id: created.id, name: created.name };
  } catch (err) {
    console.error("createSupplierAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create supplier",
    };
  }
}

export type LoadSupplierLedgerResult =
  | { ok: true; ledger: SupplierLedger }
  | { ok: false; error: string };

/**
 * Thin server-action wrapper around `getSupplierLedger` so the
 * supplier card (a client component) can lazy-fetch the ledger only
 * when the operator actually opens the dialog. Saves us shipping
 * every supplier's full history with the inventory page bundle.
 */
export async function loadSupplierLedgerAction(
  supplierId: string,
): Promise<LoadSupplierLedgerResult> {
  if (!supplierId) return { ok: false, error: "Missing supplier" };
  const ledger = await getSupplierLedger(supplierId);
  if (!ledger) return { ok: false, error: "Supplier not found" };
  return { ok: true, ledger };
}

export type PaySupplierInput = {
  supplierId: string;
  amount: number;
  paymentChannelId: string;
  note?: string;
};

export type PaySupplierResult =
  | { ok: true; paymentId: string; outstanding: number }
  | { ok: false; error: string };

/**
 * Settle some (or all) of a supplier's outstanding balance.
 *
 * Outstanding is derived live:
 *   sum(InventoryMovement.amount)
 *   - sum(InventoryMovement.paidAmount)
 *   - sum(SupplierPayment.amount)
 *
 * The action guards on three invariants:
 *
 *   • `amount > 0`
 *   • `amount ≤ outstanding`  — no overpaying suppliers
 *   • `amount ≤ channel.currentBalance` — no negative channels
 *
 * Channel debit + payment row creation run in a single transaction
 * so a crash mid-flight can't credit the supplier without taking the
 * money out (or vice versa).
 */
export async function paySupplierAction(
  input: PaySupplierInput,
): Promise<PaySupplierResult> {
  if (!input.supplierId) return { ok: false, error: "Missing supplier" };
  if (!input.paymentChannelId) {
    return { ok: false, error: "Pick a payment method to pay from" };
  }
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Amount must be greater than zero" };
  }

  const amount = round2(input.amount);
  const note = input.note?.trim() || null;

  const [supplier, channel, movementsAgg, paymentsAgg] = await Promise.all([
    prisma.supplier.findUnique({
      where: { id: input.supplierId },
      select: { id: true, name: true },
    }),
    prisma.paymentChannel.findUnique({
      where: { id: input.paymentChannelId },
      select: { id: true, name: true, archived: true, currentBalance: true },
    }),
    prisma.inventoryMovement.aggregate({
      where: { supplierId: input.supplierId },
      _sum: { amount: true, paidAmount: true },
    }),
    prisma.supplierPayment.aggregate({
      where: { supplierId: input.supplierId },
      _sum: { amount: true },
    }),
  ]);
  if (!supplier) return { ok: false, error: "Supplier not found" };
  if (!channel || channel.archived) {
    return { ok: false, error: "Payment method isn't active" };
  }

  const cost = toNumber(movementsAgg._sum.amount);
  const paidUpfront = toNumber(movementsAgg._sum.paidAmount);
  const paidLater = toNumber(paymentsAgg._sum.amount);
  const outstanding = round2(Math.max(0, cost - paidUpfront - paidLater));

  if (outstanding <= 0) {
    return { ok: false, error: `${supplier.name} has no outstanding balance` };
  }
  if (amount > outstanding) {
    return {
      ok: false,
      error: `Outstanding is ${outstanding.toLocaleString()} — pay that or less`,
    };
  }
  const balance = toNumber(channel.currentBalance);
  if (amount > balance) {
    return {
      ok: false,
      error: `${channel.name} only has ${balance.toLocaleString()} available`,
    };
  }

  try {
    const payment = await prisma.$transaction(async (tx) => {
      const row = await tx.supplierPayment.create({
        data: {
          supplierId: input.supplierId,
          paymentChannelId: input.paymentChannelId,
          amount,
          note,
        },
        select: { id: true },
      });
      await tx.paymentChannel.update({
        where: { id: input.paymentChannelId },
        data: { currentBalance: { decrement: amount } },
      });
      return row;
    });

    revalidatePath("/inventory");
    revalidatePath("/settings");

    await logActivity({
      type: "stock",
      title: `Supplier paid — ${supplier.name}`,
      description: `${amount.toLocaleString()} via ${channel.name}${
        note ? ` · ${note}` : ""
      }`,
    });

    return {
      ok: true,
      paymentId: payment.id,
      outstanding: round2(outstanding - amount),
    };
  } catch (err) {
    console.error("paySupplierAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to record payment",
    };
  }
}
