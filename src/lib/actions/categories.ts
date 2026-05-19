"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export type ActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type CategoryInput = {
  name: string;
  slug?: string;
  color: string;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type SanitizedCategory = { name: string; slug: string; color: string };

type SanitizeResult =
  | { ok: true; data: SanitizedCategory }
  | { ok: false; error: string };

function sanitize(input: CategoryInput): SanitizeResult {
  const name = input.name?.trim();
  const color = input.color?.trim();
  if (!name || name.length < 2) return { ok: false, error: "Name is required" };
  if (!color) return { ok: false, error: "Pick a color" };
  return {
    ok: true,
    data: {
      name,
      slug: (input.slug?.trim() || slugify(name)) || slugify(name),
      color,
    },
  };
}

export async function createCategoryAction(
  input: CategoryInput,
): Promise<ActionResult<{ id: string }>> {
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const dup = await prisma.menuCategory.findUnique({
    where: { slug: sanitized.data.slug },
    select: { id: true },
  });
  if (dup) return { ok: false, error: `Slug "${sanitized.data.slug}" is in use` };

  try {
    const created = await prisma.menuCategory.create({
      data: sanitized.data,
      select: { id: true },
    });
    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    console.error("createCategoryAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to create category",
    };
  }
}

export async function updateCategoryAction(
  id: string,
  input: CategoryInput,
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing category id" };
  const sanitized = sanitize(input);
  if (!sanitized.ok) return { ok: false, error: sanitized.error };

  const dup = await prisma.menuCategory.findFirst({
    where: { slug: sanitized.data.slug, NOT: { id } },
    select: { id: true },
  });
  if (dup) return { ok: false, error: `Slug "${sanitized.data.slug}" is in use` };

  try {
    await prisma.menuCategory.update({
      where: { id },
      data: sanitized.data,
    });
    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("updateCategoryAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to update category",
    };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing category id" };
  const inUse = await prisma.menuItem.findFirst({
    where: { categoryId: id },
    select: { id: true },
  });
  if (inUse) {
    return {
      ok: false,
      error:
        "At least one menu item belongs to this category. Reassign or delete those items first.",
    };
  }
  try {
    await prisma.menuCategory.delete({ where: { id } });
    revalidatePath("/menu");
    revalidatePath("/pos");
    return { ok: true };
  } catch (err) {
    console.error("deleteCategoryAction failed", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Failed to delete category",
    };
  }
}
