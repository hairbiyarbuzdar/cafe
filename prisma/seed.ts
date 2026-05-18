/* eslint-disable no-console */
/**
 * Brewline seed.
 *
 * Idempotent — safe to run repeatedly. Wipes the working tables in
 * dependency order, then re-inserts a representative dataset that
 * mirrors the existing front-end mocks so the UI keeps showing
 * familiar values after the DB swap.
 *
 *   npm run db:seed
 */

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma";
import { CATEGORIES } from "../src/mock/categories";
import { INVENTORY, SUPPLIERS } from "../src/mock/inventory";
import { MENU_ITEMS } from "../src/mock/menu";
import { ORDERS } from "../src/mock/orders";
import { KITCHEN_STATIONS } from "../src/mock/stations";

// The mock user list lived in `src/mock/users.ts` before the DB
// migration. We keep the same demo accounts here so the login page
// still shows the same four roles after `db:seed`.
const SEED_USERS = [
  { id: "usr_elena", name: "Elena Volkova", email: "elena@brewline.co", role: "admin", password: "brewline" },
  { id: "usr_maya", name: "Maya Chen", email: "maya@brewline.co", role: "manager", password: "brewline" },
  { id: "usr_aisha", name: "Aisha Patel", email: "aisha@brewline.co", role: "cashier", password: "brewline" },
  { id: "usr_lukas", name: "Lukas Brandt", email: "lukas@brewline.co", role: "kitchen", password: "brewline" },
] as const;

try {
  process.loadEnvFile(".env");
} catch {
  // .env optional in CI / hosted runs
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed");
}

const prisma = new PrismaClient({ adapter: new PrismaPg(databaseUrl) });

async function main() {
  console.log("→ Wiping working tables");
  // Order matters: leaf tables first
  await prisma.kitchenTicket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.kitchenStation.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.table.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  console.log("→ Users");
  for (const u of SEED_USERS) {
    await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: await bcrypt.hash(u.password, 10),
        role: u.role,
      },
    });
  }

  console.log("→ Suppliers");
  for (const s of SUPPLIERS) {
    await prisma.supplier.create({
      data: {
        id: s.id,
        name: s.name,
        contact: s.contact,
        email: s.email,
        phone: s.phone,
        rating: s.rating,
      },
    });
  }

  console.log("→ Inventory");
  for (const i of INVENTORY) {
    await prisma.inventoryItem.create({
      data: {
        id: i.id,
        name: i.name,
        sku: i.sku,
        category: i.category,
        unit: i.unit,
        stock: i.stock,
        reorderLevel: i.reorderLevel,
        costPerUnit: i.costPerUnit,
        supplierId: i.supplierId,
        lastRestocked: new Date(i.lastRestocked),
        expiresAt: i.expiresAt ? new Date(i.expiresAt) : undefined,
      },
    });
  }

  console.log("→ Kitchen stations");
  for (const st of KITCHEN_STATIONS) {
    await prisma.kitchenStation.create({
      data: {
        id: st.id,
        name: st.name,
        printer: st.printer,
        active: st.active,
        color: st.color,
      },
    });
  }

  console.log("→ Menu categories");
  for (const c of CATEGORIES) {
    await prisma.menuCategory.create({
      data: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        color: c.color,
      },
    });
  }

  console.log("→ Menu items + recipes");
  for (const m of MENU_ITEMS) {
    await prisma.menuItem.create({
      data: {
        id: m.id,
        name: m.name,
        description: m.description,
        price: m.price,
        sku: m.sku,
        available: m.available,
        posVisible: m.posVisible,
        popular: m.popular ?? false,
        prepTimeMinutes: m.prepTimeMinutes,
        image: m.image,
        categoryId: m.categoryId,
        stationId: m.stationId,
        modifiers: m.modifiers ? m.modifiers : undefined,
        recipe: m.recipe
          ? {
              create: m.recipe.map((r) => ({
                inventoryItemId: r.inventoryItemId,
                quantity: r.quantity,
                unit: r.unit,
              })),
            }
          : undefined,
      },
    });
  }

  console.log("→ Tables (default seating)");
  const seedTables = [
    { name: "T-1", capacity: 2 },
    { name: "T-2", capacity: 4 },
    { name: "T-3", capacity: 4 },
    { name: "T-4", capacity: 6 },
    { name: "T-5", capacity: 2 },
  ];
  for (const t of seedTables) {
    await prisma.table.create({ data: { ...t, occupancy: 0 } });
  }

  console.log("→ Orders + items + kitchen tickets");
  const staffByName = await prisma.user.findMany();
  const findStaffId = (name: string) =>
    staffByName.find((u) => u.name === name)?.id ?? null;

  for (const o of ORDERS) {
    // Skip lines whose menu item didn't seed (e.g. discontinued)
    const items = o.items.filter((i) =>
      MENU_ITEMS.some((m) => m.id === i.productId),
    );
    if (items.length === 0) continue;

    const order = await prisma.order.create({
      data: {
        id: o.id,
        number: o.number,
        status: o.status,
        channel: o.channel,
        customerName: o.customer?.name,
        customerPhone: o.customer?.phone,
        staffId: findStaffId(o.staff),
        subtotal: o.subtotal,
        tax: o.tax,
        tip: o.tip,
        discount: o.discount,
        total: o.total,
        payment: o.payment,
        notes: o.notes,
        createdAt: new Date(o.createdAt),
        updatedAt: new Date(o.updatedAt),
        items: {
          create: items.map((i) => ({
            menuItemId: i.productId,
            name: i.name,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            modifiers: i.modifiers && i.modifiers.length ? i.modifiers : undefined,
            note: i.note,
          })),
        },
      },
    });

    // One ticket per station present in the order
    const stationsInOrder = new Set(
      items
        .map((i) => MENU_ITEMS.find((m) => m.id === i.productId)?.stationId)
        .filter((s): s is string => Boolean(s)),
    );
    const ticketStatus =
      order.status === "completed" || order.status === "cancelled" || order.status === "refunded"
        ? "served"
        : order.status === "ready"
          ? "ready"
          : order.status === "preparing"
            ? "preparing"
            : "pending";

    for (const stationId of stationsInOrder) {
      await prisma.kitchenTicket.create({
        data: {
          orderId: order.id,
          stationId,
          status: ticketStatus,
        },
      });
    }
  }

  // Summary
  const counts = await Promise.all([
    prisma.user.count(),
    prisma.supplier.count(),
    prisma.inventoryItem.count(),
    prisma.kitchenStation.count(),
    prisma.menuCategory.count(),
    prisma.menuItem.count(),
    prisma.order.count(),
    prisma.kitchenTicket.count(),
  ]);
  console.log("✓ Seeded:", {
    users: counts[0],
    suppliers: counts[1],
    inventory: counts[2],
    stations: counts[3],
    categories: counts[4],
    menuItems: counts[5],
    orders: counts[6],
    kitchenTickets: counts[7],
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
