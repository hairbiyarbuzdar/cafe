"use client";

import { create } from "zustand";

import type {
  CartItem,
  MenuItem,
  OrderChannel,
  ProductModifier,
} from "@/types";

type CartState = {
  items: CartItem[];
  channel: OrderChannel;
  tableId?: string;
  note: string;
  discountPct: number;
  taxRate: number;
  taxLabel: string;
  /**
   * When set, the cart represents *additions* to an existing held order
   * rather than a fresh placement. The cart panel renders an "Adding to
   * #X" badge and swaps the submit button copy.
   */
  attachedOrderId: string | null;
  attachedOrderNumber: string | null;
  add: (item: MenuItem, quantity?: number, modifiers?: ProductModifier[]) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setChannel: (channel: OrderChannel) => void;
  setTableId: (tableId: string | undefined) => void;
  setNote: (note: string) => void;
  setDiscountPct: (pct: number) => void;
  setTaxConfig: (rate: number, label: string) => void;
  /** Bind the cart to a held order — subsequent items are added to it. */
  attach: (orderId: string, orderNumber: string) => void;
  detach: () => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  channel: "dine-in",
  tableId: undefined,
  note: "",
  discountPct: 0,
  taxRate: 0.085,
  taxLabel: "Tax",
  attachedOrderId: null,
  attachedOrderNumber: null,

  add: (item, quantity = 1, modifiers = []) =>
    set((state) => {
      const qty = Math.max(1, Math.floor(quantity));
      const existing = state.items.find((i) => i.productId === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.id
              ? { ...i, quantity: i.quantity + qty }
              : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: item.id,
            name: item.name,
            unitPrice: item.price,
            quantity: qty,
            modifiers,
          },
        ],
      };
    }),

  increment: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
      ),
    })),

  decrement: (productId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    })),

  setQuantity: (productId, quantity) =>
    set((state) => {
      const q = Math.max(0, Math.floor(quantity));
      if (q === 0) {
        return { items: state.items.filter((i) => i.productId !== productId) };
      }
      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity: q } : i,
        ),
      };
    }),

  remove: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

  clear: () =>
    set({
      items: [],
      note: "",
      discountPct: 0,
      tableId: undefined,
    }),

  setChannel: (channel) =>
    set((state) => ({
      channel,
      tableId: channel === "dine-in" ? state.tableId : undefined,
    })),
  setTableId: (tableId) => set({ tableId }),
  setNote: (note) => set({ note }),
  setDiscountPct: (discountPct) => set({ discountPct }),
  setTaxConfig: (taxRate, taxLabel) => set({ taxRate, taxLabel }),

  attach: (orderId, orderNumber) =>
    set({ attachedOrderId: orderId, attachedOrderNumber: orderNumber }),
  detach: () => set({ attachedOrderId: null, attachedOrderNumber: null }),
}));

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => {
    const modPrice = i.modifiers.reduce((m, mod) => m + mod.priceDelta, 0);
    return sum + (i.unitPrice + modPrice) * i.quantity;
  }, 0);
}
