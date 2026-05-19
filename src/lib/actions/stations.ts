"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type StationInput = {
  name: string;
  printer?: string | null;
  color: string;
  active?: boolean;
};

type SanitizedStation = {
  name: string;
  printer: string | null;
  color: string;
  active: boolean;
};

type SanitizeResult =
  | { ok: true; data: SanitizedStation }
  | { ok: false; error: string };

function sanitize(input: StationInput): SanitizeResult {
  const name = input.name?.trim();
  const color = input.color?.trim();
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!color) return { ok: false, error: "Pick a color" };
  return {
    ok: true,
    data: {
      name,
      printer: input.printer?.trim() || null,
      color,
      active: input.active ?? true,
    },
  };
}

export async function createStationAction(
  input: StationInput,
): Promise<ActionResult<{ id: string }>> {
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const dup = await prisma.kitchenStation.findUnique({
    where: { name: sanitized.data.name },
    select: { id: true },
  });
  if (dup) {
    return { ok: false, error: `Station "${sanitized.data.name}" already exists` };
  }

  try {
    const created = await prisma.kitchenStation.create({
      data: sanitized.data,
      select: { id: true },
    });
    revalidatePath("/menu");
    revalidatePath("/kitchen");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createStationAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create station",
    };
  }
}

export async function updateStationAction(
  id: string,
  input: StationInput,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing station id" };
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const dup = await prisma.kitchenStation.findFirst({
    where: { name: sanitized.data.name, NOT: { id } },
    select: { id: true },
  });
  if (dup) {
    return { ok: false, error: `Station "${sanitized.data.name}" already exists` };
  }

  try {
    await prisma.kitchenStation.update({
      where: { id },
      data: sanitized.data,
    });
    revalidatePath("/menu");
    revalidatePath("/kitchen");
    return { ok: true };
  } catch (err) {
    console.error("updateStationAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update station",
    };
  }
}

export async function toggleStationActiveAction(
  id: string,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing station id" };
  const row = await prisma.kitchenStation.findUnique({
    where: { id },
    select: { active: true },
  });
  if (!row) return { ok: false, error: "Station not found" };
  await prisma.kitchenStation.update({
    where: { id },
    data: { active: !row.active },
  });
  revalidatePath("/menu");
  revalidatePath("/kitchen");
  return { ok: true };
}

export async function deleteStationAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing station id" };

  const referenced = await prisma.menuItem.findFirst({
    where: { stationId: id },
    select: { id: true },
  });
  if (referenced) {
    return {
      ok: false,
      error:
        "At least one menu item routes to this station. Reassign those items before deleting.",
    };
  }

  try {
    await prisma.kitchenStation.delete({ where: { id } });
    revalidatePath("/menu");
    revalidatePath("/kitchen");
    return { ok: true };
  } catch (err) {
    console.error("deleteStationAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete station",
    };
  }
}
