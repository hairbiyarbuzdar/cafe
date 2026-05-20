/* eslint-disable no-console */
/**
 * Cafe Management System seed.
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
import { CATEGORIES } from "./seed-data/categories";
import { INVENTORY, SUPPLIERS } from "./seed-data/inventory";
import { MENU_ITEMS } from "./seed-data/menu";
import { ORDERS } from "./seed-data/orders";
import { KITCHEN_STATIONS } from "./seed-data/stations";

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
  await prisma.attendance.deleteMany();
  await prisma.shift.deleteMany();
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
        // Stamp paidAt on completed orders so analytics queries have
        // a paid timeline to aggregate. In-flight statuses
        // (pending/preparing/ready) stay unpaid — they're held. Cancelled
        // is left unpaid too since the held-order cancel path never collects.
        // Refunded means money came in and went out again; keeping paidAt
        // lets revenue queries (which already filter out refunded) work
        // identically either way.
        paidAt:
          o.status === "completed" || o.status === "refunded"
            ? new Date(o.updatedAt)
            : null,
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

  console.log("→ Shifts + attendance");
  // Build a Monday-anchored week so the schedule grid lines up with
  // what the UI expects (Mon..Sun columns). Shifts cover the current
  // calendar week; attendance covers the trailing 7 days ending today.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  // Two rotating shift templates so the grid has variety.
  const SHIFT_TEMPLATES: Record<string, { start: [number, number]; end: [number, number] }> = {
    open: { start: [6, 30], end: [14, 30] },
    close: { start: [12, 30], end: [20, 30] },
  };

  // Each non-admin user gets a Mon–Fri schedule. Admins (Elena)
  // float and don't appear on the floor grid.
  const SHIFT_PLAN: { userId: string; days: number[]; template: keyof typeof SHIFT_TEMPLATES }[] = [
    { userId: "usr_maya", days: [0, 1, 2, 3, 4], template: "open" }, // Mon–Fri opens
    { userId: "usr_aisha", days: [0, 1, 2, 3, 4], template: "close" }, // Mon–Fri closes
    { userId: "usr_lukas", days: [1, 2, 3, 4, 5], template: "open" }, // Tue–Sat opens
  ];

  for (const plan of SHIFT_PLAN) {
    const tpl = SHIFT_TEMPLATES[plan.template]!;
    for (const offset of plan.days) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + offset);
      const start = new Date(date);
      start.setHours(tpl.start[0], tpl.start[1], 0, 0);
      const end = new Date(date);
      end.setHours(tpl.end[0], tpl.end[1], 0, 0);
      // Past days are "completed", today/future stay "scheduled".
      const status = date < today ? "completed" : "scheduled";
      await prisma.shift.create({
        data: { userId: plan.userId, date, start, end, status },
      });
    }
  }

  // Attendance for the trailing 7 days for the same three users.
  // Mostly onTime, with one late and one absent sprinkled in so the
  // chart has all three stacks.
  const ATTENDANCE_USERS = SHIFT_PLAN.map((p) => p.userId);
  // Per-day overrides: [dayOffset (-6..0), userId, state, minutesLate?]
  const OVERRIDES: Array<[number, string, "late" | "absent", number?]> = [
    [-5, "usr_aisha", "late", 12],
    [-3, "usr_lukas", "absent"],
    [-2, "usr_maya", "late", 7],
    [-1, "usr_aisha", "late", 4],
  ];

  for (let offset = -6; offset <= 0; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    for (const userId of ATTENDANCE_USERS) {
      const override = OVERRIDES.find((o) => o[0] === offset && o[1] === userId);
      if (override) {
        await prisma.attendance.create({
          data: {
            userId,
            date,
            state: override[2],
            minutesLate: override[3] ?? null,
          },
        });
      } else {
        await prisma.attendance.create({
          data: { userId, date, state: "onTime" },
        });
      }
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
    prisma.shift.count(),
    prisma.attendance.count(),
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
    shifts: counts[8],
    attendance: counts[9],
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
