import "server-only";

import { prisma } from "@/lib/prisma";

export type SupplierLedgerEntry =
  | {
      kind: "purchase";
      id: string;
      occurredAt: string;
      itemName: string;
      quantity: number;
      unit: string;
      cost: number;
      paid: number;
      outstanding: number;
      channelName: string | null;
      reason: string;
    }
  | {
      kind: "payment";
      id: string;
      occurredAt: string;
      amount: number;
      channelName: string;
      note: string | null;
    };

export type SupplierLedger = {
  supplier: {
    id: string;
    name: string;
    phone: string | null;
    address: string | null;
  };
  totals: {
    purchased: number;
    paid: number;
    outstanding: number;
  };
  entries: SupplierLedgerEntry[];
};

/**
 * Full ledger for a supplier — every purchase movement that named
 * them plus every after-the-fact `SupplierPayment`. Entries are
 * returned newest-first so the dialog's first row is the latest
 * transaction; totals are computed server-side so the client doesn't
 * have to re-sum on every render.
 */
export async function getSupplierLedger(
  supplierId: string,
): Promise<SupplierLedger | null> {
  const supplier = await prisma.supplier.findUnique({
    where: { id: supplierId },
    select: { id: true, name: true, phone: true, address: true },
  });
  if (!supplier) return null;

  const [movements, payments] = await Promise.all([
    prisma.inventoryMovement.findMany({
      where: { supplierId, amount: { not: null } },
      orderBy: { createdAt: "desc" },
      include: {
        inventoryItem: { select: { name: true, unit: true } },
        paymentChannel: { select: { name: true } },
      },
    }),
    prisma.supplierPayment.findMany({
      where: { supplierId },
      orderBy: { createdAt: "desc" },
      include: {
        paymentChannel: { select: { name: true } },
      },
    }),
  ]);

  const purchaseEntries: SupplierLedgerEntry[] = movements.map((m) => {
    const cost = toNumber(m.amount);
    const paid = toNumber(m.paidAmount);
    return {
      kind: "purchase",
      id: m.id,
      occurredAt: m.createdAt.toISOString(),
      itemName: m.inventoryItem.name,
      quantity: toNumber(m.delta),
      unit: m.inventoryItem.unit,
      cost,
      paid,
      outstanding: Math.max(0, round2(cost - paid)),
      channelName: m.paymentChannel?.name ?? null,
      reason: m.reason,
    };
  });

  const paymentEntries: SupplierLedgerEntry[] = payments.map((p) => ({
    kind: "payment",
    id: p.id,
    occurredAt: p.createdAt.toISOString(),
    amount: toNumber(p.amount),
    channelName: p.paymentChannel.name,
    note: p.note,
  }));

  const entries = [...purchaseEntries, ...paymentEntries].sort((a, b) =>
    b.occurredAt.localeCompare(a.occurredAt),
  );

  // Totals: outstanding is what the *supplier* is still owed across
  // all activity. Purchase-level outstanding (cost - paid) is the
  // up-front debt; later SupplierPayments chip away at it.
  const totalPurchased = round2(
    purchaseEntries.reduce((sum, e) => sum + (e.kind === "purchase" ? e.cost : 0), 0),
  );
  const totalPaidUpfront = purchaseEntries.reduce(
    (sum, e) => sum + (e.kind === "purchase" ? e.paid : 0),
    0,
  );
  const totalPaidLater = paymentEntries.reduce(
    (sum, e) => sum + (e.kind === "payment" ? e.amount : 0),
    0,
  );
  const totalPaid = round2(totalPaidUpfront + totalPaidLater);
  const totalOutstanding = round2(Math.max(0, totalPurchased - totalPaid));

  return {
    supplier,
    totals: {
      purchased: totalPurchased,
      paid: totalPaid,
      outstanding: totalOutstanding,
    },
    entries,
  };
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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
