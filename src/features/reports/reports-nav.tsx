"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  LayoutDashboard,
  Receipt,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const REPORT_LINKS = [
  { href: "/reports", label: "Summary", icon: LayoutDashboard },
  { href: "/reports/orders", label: "Orders", icon: ShoppingBag },
  { href: "/reports/suppliers", label: "Suppliers", icon: Truck },
  { href: "/reports/inventory", label: "Inventory", icon: Boxes },
  { href: "/reports/staff", label: "Staff & Salary", icon: Users },
  { href: "/reports/expenses", label: "Expenses", icon: Receipt },
] as const;

export function ReportsNav() {
  const pathname = usePathname();

  // "/reports" (Summary) matches exactly; sub-routes match by prefix.
  const isActive = (href: string) =>
    href === "/reports"
      ? pathname === "/reports"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile: horizontal scrollable chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {REPORT_LINKS.map((l) => {
          const Icon = l.icon;
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-[13px] font-medium transition-colors",
                active
                  ? "border-primary/40 bg-primary text-primary-foreground shadow-soft"
                  : "border-border/70 bg-card text-foreground hover:bg-muted",
              )}
            >
              <Icon className="size-4" />
              {l.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop: vertical list */}
      <nav className="hidden flex-col gap-1 md:flex">
        {REPORT_LINKS.map((l) => {
          const Icon = l.icon;
          const active = isActive(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "inline-flex h-10 items-center gap-2.5 rounded-md px-3 text-[13.5px] font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
