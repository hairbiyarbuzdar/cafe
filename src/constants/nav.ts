import {
  Bell,
  Boxes,
  CalendarRange,
  ChartLine,
  CircleUserRound,
  Coffee,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Settings,
  ShoppingBag,
  Users,
} from "lucide-react";

import type { NavGroup, NavItem } from "@/types";

export const PRIMARY_NAV: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview of today's performance",
      },
      {
        title: "Point of Sale",
        href: "/pos",
        icon: CreditCard,
        description: "Take orders and accept payments",
      },
      {
        title: "Orders",
        href: "/orders",
        icon: Receipt,
        badge: 12,
        description: "Live and historical orders",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Inventory",
        href: "/inventory",
        icon: Boxes,
        badge: "4 low",
        description: "Stock levels and suppliers",
      },
      {
        title: "Staff",
        href: "/staff",
        icon: Users,
        description: "Team, shifts, and attendance",
      },
      {
        title: "Reports",
        href: "/reports",
        icon: ChartLine,
        description: "Sales, products, and trends",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Café, billing, and access",
      },
    ],
  },
];

export const MOBILE_NAV: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "POS", href: "/pos", icon: CreditCard },
  { title: "Orders", href: "/orders", icon: Receipt },
  { title: "Stock", href: "/inventory", icon: Boxes },
  { title: "More", href: "/settings", icon: Settings },
];

export const QUICK_ACTIONS = [
  { id: "new-order", label: "New order", icon: ShoppingBag, href: "/pos" },
  { id: "today-orders", label: "Today's orders", icon: ListChecks, href: "/orders" },
  { id: "menu", label: "Menu", icon: Coffee, href: "/inventory" },
  { id: "schedule", label: "Schedule", icon: CalendarRange, href: "/staff" },
  { id: "alerts", label: "Alerts", icon: Bell, href: "/dashboard" },
  { id: "account", label: "Account", icon: CircleUserRound, href: "/settings" },
] as const;

export const BRAND = {
  name: "Brewline",
  tagline: "Café operations, perfected",
  description: "Enterprise café management platform",
} as const;
