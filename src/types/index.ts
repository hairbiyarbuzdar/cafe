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

export type ProductModifier = {
  id: string;
  name: string;
  priceDelta: number;
};

/**
 * Kitchen station — the prep counter that physically makes the item.
 * One menu item belongs to one station, but a station prepares
 * many items. Used to route tickets from the POS to the right
 * KDS column.
 */
export type KitchenStation = {
  id: string;
  name: string;
  /** Optional named printer for ticket spooling */
  printer?: string;
  active: boolean;
  /** Hex color for visual distinction on KDS */
  color: string;
};

/**
 * Recipe link: how much of an inventory ingredient one unit of
 * a menu item consumes. Deducted from stock when the order is paid.
 */
export type RecipeIngredient = {
  inventoryItemId: string;
  quantity: number;
  unit: string;
};

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  /** POS display grouping */
  categoryId: string;
  /** Kitchen routing */
  stationId: string;
  price: number;
  cost?: number;
  sku?: string;
  image?: string;
  /** 86'd — temporarily unavailable */
  available: boolean;
  /** Whether it appears on the POS screen at all */
  posVisible: boolean;
  /** Estimated prep time, minutes */
  prepTimeMinutes?: number;
  popular?: boolean;
  modifiers?: ProductModifier[];
  recipe?: RecipeIngredient[];
};

/** Kitchen ticket statuses — lifecycle independent per station. */
export type TicketStatus = "pending" | "preparing" | "ready" | "served";

export type KitchenTicketItem = {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  modifiers?: string[];
  note?: string;
};

export type KitchenTicket = {
  /** Synthetic id — `${orderId}__${stationId}` */
  id: string;
  orderId: string;
  orderNumber: string;
  stationId: string;
  customerName?: string;
  table?: string;
  channel: OrderChannel;
  status: TicketStatus;
  items: KitchenTicketItem[];
  notes?: string;
  createdAt: string;
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

export type TableStatus = "empty" | "partial" | "full";

export type Table = {
  id: string;
  /** Auto-generated as T-1, T-2, … */
  name: string;
  capacity: number;
  occupancy: number;
};
