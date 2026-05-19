import {
  Bell,
  BookOpenText,
  Boxes,
  CalendarRange,
  ChartLine,
  ChefHat,
  CircleUserRound,
  Coffee,
  CreditCard,
  LayoutDashboard,
  ListChecks,
  Receipt,
  ReceiptText,
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
        permission: "dashboard.view",
      },
      {
        title: "Point of Sale",
        href: "/pos",
        icon: CreditCard,
        description: "Take orders and accept payments",
        permission: "pos.access",
      },
      {
        title: "Orders",
        href: "/orders",
        icon: Receipt,
        badge: 12,
        description: "Live and historical orders",
        permission: "orders.view",
      },
      {
        title: "Kitchen",
        href: "/kitchen",
        icon: ChefHat,
        description: "Live ticket queue",
        permission: "kitchen.view",
      },
      
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Menu",
        href: "/menu",
        icon: BookOpenText,
        description: "Sellable items, stations, recipes",
        permission: "menu.view",
      },
      {
        title: "Inventory",
        href: "/inventory",
        icon: Boxes,
        badge: "4 low",
        description: "Raw materials and suppliers",
        permission: "inventory.view",
      },
      {
        title: "Staff",
        href: "/staff",
        icon: Users,
        description: "Team, shifts, and attendance",
        permission: "staff.view",
      },
      {
        title: "Expenses",
        href: "/expenses",
        icon: ReceiptText,
        description: "Operating spend by head and channel",
        permission: "expenses.view",
      },
      {
        title: "Reports",
        href: "/reports",
        icon: ChartLine,
        description: "Sales, products, and trends",
        permission: "reports.view",
      },
    ],
  },
  {
    label: "Admin",
    items: [
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        description: "Café, billing, and access",
        permission: "settings.view",
      },
    ],
  },
];

export const MOBILE_NAV: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
  { title: "POS", href: "/pos", icon: CreditCard, permission: "pos.access" },
  { title: "Orders", href: "/orders", icon: Receipt, permission: "orders.view" },
  { title: "Stock", href: "/inventory", icon: Boxes, permission: "inventory.view" },
  { title: "More", href: "/settings", icon: Settings, permission: "settings.view" },
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
