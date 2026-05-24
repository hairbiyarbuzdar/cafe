/**
 * Seed built-in roles and demo users into Supabase.
 * Run: npx tsx scripts/seed-users.ts
 */
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

try { process.loadEnvFile(".env"); } catch { /* CI */ }

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");

const supabase = createClient(url, key, { auth: { persistSession: false } });

const ROLES = [
  {
    id: "admin", name: "Administrator", isSystem: true, defaultRoute: "/pos",
    description: "Full access — manages workspace, team, and configuration.",
    permissions: ["pos.access","orders.view","orders.refund","orders.cancel","inventory.view","inventory.edit","menu.view","menu.edit","reports.view","staff.view","staff.edit","settings.view","settings.edit","kitchen.view","dashboard.view","expenses.view","expenses.edit"],
  },
  {
    id: "manager", name: "Manager", isSystem: true, defaultRoute: "/pos",
    description: "Day-to-day operations: POS, menu, inventory, reports, view team.",
    permissions: ["dashboard.view","pos.access","orders.view","orders.refund","orders.cancel","inventory.view","inventory.edit","menu.view","menu.edit","reports.view","staff.view","expenses.view","expenses.edit"],
  },
  {
    id: "cashier", name: "Cashier", isSystem: true, defaultRoute: "/pos",
    description: "POS-only access for front-of-house staff.",
    permissions: ["pos.access","orders.view"],
  },
  {
    id: "kitchen", name: "Kitchen staff", isSystem: true, defaultRoute: "/kitchen",
    description: "Kitchen display + read-only inventory and orders.",
    permissions: ["kitchen.view","orders.view","inventory.view"],
  },
  {
    id: "waiter", name: "Waiter", isSystem: true, defaultRoute: null,
    description: "Assigned to tables and dine-in orders. No app access.",
    permissions: [],
  },
  {
    id: "delivery", name: "Delivery", isSystem: true, defaultRoute: null,
    description: "Assigned to delivery orders as the rider. No app access.",
    permissions: [],
  },
];

const USERS = [
  { id: "usr_elena", name: "Elena Volkova", email: "elena@brewline.co", role: "admin",   password: "brewline" },
  { id: "usr_maya",  name: "Maya Chen",     email: "maya@brewline.co",  role: "manager", password: "brewline" },
  { id: "usr_aisha", name: "Aisha Patel",   email: "aisha@brewline.co", role: "cashier", password: "brewline" },
  { id: "usr_lukas", name: "Lukas Brandt",  email: "lukas@brewline.co", role: "kitchen", password: "brewline" },
];

async function main() {
  console.log("→ Upserting roles…");
  const { error: roleErr } = await supabase.from("Role").upsert(
    ROLES.map(r => ({
      id: r.id, name: r.name, description: r.description,
      permissions: r.permissions, isSystem: r.isSystem, defaultRoute: r.defaultRoute,
    })),
    { onConflict: "id" }
  );
  if (roleErr) throw new Error(`Roles: ${roleErr.message}`);
  console.log(`✓ ${ROLES.length} roles upserted`);

  console.log("→ Upserting users…");
  for (const u of USERS) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const { error } = await supabase.from("User").upsert(
      { id: u.id, name: u.name, email: u.email, role: u.role, passwordHash },
      { onConflict: "id" }
    );
    if (error) throw new Error(`User ${u.email}: ${error.message}`);
    console.log(`  ✓ ${u.name} (${u.role})`);
  }

  console.log("\n✓ Done. Login with any email above, password: brewline");
}

main().catch(err => { console.error("✗", err.message); process.exit(1); });
