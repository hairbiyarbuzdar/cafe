import type { LucideIcon } from "lucide-react";

import type { Permission } from "@/types/auth";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  description?: string;
  /** Optional gating — items only render for users with this permission */
  permission?: Permission;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "refunded";

export type OrderChannel = "dine-in" | "takeaway" | "delivery" | "online";

export type PaymentMethod = "cash" | "card" | "wallet" | "online";

export type OrderItem = {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  modifiers?: string[];
  note?: string;
};

export type Order = {
  id: string;
  number: string;
  status: OrderStatus;
  channel: OrderChannel;
  customer?: {
    name: string;
    phone?: string;
    avatar?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  tip?: number;
  discount?: number;
  total: number;
  payment: PaymentMethod;
  table?: string;
  staff: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
  count: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  cost?: number;
  sku?: string;
  image?: string;
  available: boolean;
  popular?: boolean;
  modifiers?: ProductModifier[];
};

export type ProductModifier = {
  id: string;
  name: string;
  priceDelta: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: "kg" | "g" | "L" | "ml" | "pcs" | "box";
  stock: number;
  reorderLevel: number;
  costPerUnit: number;
  supplierId: string;
  lastRestocked: string;
  expiresAt?: string;
};

export type Supplier = {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  itemsSupplied: number;
  rating: number;
};

export type StaffRole = "admin" | "manager" | "cashier" | "kitchen" | "barista";

export type StaffStatus = "active" | "on-leave" | "off-duty";

export type Staff = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  status: StaffStatus;
  avatar?: string;
  joinedAt: string;
  hoursThisWeek: number;
  shiftsThisWeek: number;
  hourlyRate: number;
};

export type Shift = {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  start: string;
  end: string;
  role: StaffRole;
  status: "scheduled" | "confirmed" | "completed" | "missed";
};

export type KpiTrend = "up" | "down" | "flat";

export type Kpi = {
  id: string;
  label: string;
  value: number;
  formatted: string;
  delta: number;
  trend: KpiTrend;
  sparkline: number[];
  helperText?: string;
};

export type ActivityEvent = {
  id: string;
  type: "order" | "stock" | "staff" | "system";
  title: string;
  description: string;
  timestamp: string;
  actor?: { name: string; avatar?: string };
};

export type CartItem = {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  modifiers: ProductModifier[];
  note?: string;
};
