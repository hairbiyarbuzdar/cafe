"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

function nextNameFromExisting(names: string[]): { name: string; next: number } {
  const used = new Set(
    names
      .map((n) => /^T-(\d+)$/.exec(n)?.[1])
      .filter((s): s is string => Boolean(s))
      .map((s) => parseInt(s, 10)),
  );
  let n = 1;
  while (used.has(n)) n++;
  return { name: `T-${n}`, next: n };
}

export async function createTableAction(
  capacity: number,
): Promise<ActionResult<{ id: string }>> {
  if (!Number.isFinite(capacity) || capacity < 1) {
    return { ok: false, error: "Capacity must be at least 1" };
  }
  const existing = await prisma.table.findMany({ select: { name: true } });
  const { name } = nextNameFromExisting(existing.map((t) => t.name));
  try {
    const created = await prisma.table.create({
      data: { name, capacity: Math.floor(capacity), occupancy: 0 },
      select: { id: true },
    });
    revalidatePath("/pos");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createTableAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to add table",
    };
  }
}

export async function removeTableAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  const inUse = await prisma.order.findFirst({
    where: { tableId: id, paidAt: null, status: { notIn: ["cancelled", "refunded"] } },
    select: { id: true },
  });
  if (inUse) {
    return {
      ok: false,
      error: "An open order is on this table. Settle or cancel it first.",
    };
  }
  try {
    await prisma.table.delete({ where: { id } });
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("removeTableAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to remove table",
    };
  }
}

export async function setTableCapacityAction(
  id: string,
  capacity: number,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  if (!Number.isFinite(capacity) || capacity < 1) {
    return { ok: false, error: "Capacity must be at least 1" };
  }
  const row = await prisma.table.findUnique({
    where: { id },
    select: { occupancy: true },
  });
  if (!row) return { ok: false, error: "Table not found" };
  const cap = Math.floor(capacity);
  try {
    await prisma.table.update({
      where: { id },
      data: {
        capacity: cap,
        // Capacity can't fall below current occupancy without breaking the
        // invariant — clamp the occupancy down if needed.
        occupancy: Math.min(row.occupancy, cap),
      },
    });
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("setTableCapacityAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update capacity",
    };
  }
}

export async function setTableWaiterAction(
  id: string,
  waiterId: string | null,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  const table = await prisma.table.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!table) return { ok: false, error: "Table not found" };

  // Validate the waiter (if any) is a real user with the waiter role —
  // guards against a stale id from a long-open dialog.
  if (waiterId) {
    const waiter = await prisma.user.findUnique({
      where: { id: waiterId },
      select: { role: true },
    });
    if (!waiter || waiter.role !== "waiter") {
      return { ok: false, error: "Pick a valid waiter" };
    }
  }

  try {
    await prisma.table.update({ where: { id }, data: { waiterId } });
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("setTableWaiterAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to assign waiter",
    };
  }
}

export async function setTableOccupancyAction(
  id: string,
  occupancy: number,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing table id" };
  if (!Number.isFinite(occupancy) || occupancy < 0) {
    return { ok: false, error: "Occupancy must be 0 or greater" };
  }
  const row = await prisma.table.findUnique({
    where: { id },
    select: { capacity: true },
  });
  if (!row) return { ok: false, error: "Table not found" };
  const value = Math.max(0, Math.min(Math.floor(occupancy), row.capacity));
  try {
    await prisma.table.update({ where: { id }, data: { occupancy: value } });
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("setTableOccupancyAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update occupancy",
    };
  }
}
