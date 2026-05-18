"use client";

import { create } from "zustand";

import type { CartItem, MenuItem, OrderChannel, PaymentMethod, ProductModifier } from "@/types";

type CartState = {
  items: CartItem[];
  channel: OrderChannel;
  payment: PaymentMethod;
  tableId?: string;
  note: string;
  discountPct: number;
  taxRate: number;
  /**
   * Adds `quantity` of a menu item to the cart. If the same item
   * is already there, increments the existing line.
   */
  add: (item: MenuItem, quantity?: number, modifiers?: ProductModifier[]) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  /** Switching away from dine-in unassigns any selected table. */
  setChannel: (channel: OrderChannel) => void;
  setPayment: (payment: PaymentMethod) => void;
  setTableId: (tableId: string | undefined) => void;
  setNote: (note: string) => void;
  setDiscountPct: (pct: number) => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  channel: "dine-in",
  payment: "card",
  tableId: undefined,
  note: "",
  discountPct: 0,
  taxRate: 0.085,

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
      // tables only apply to dine-in service
      tableId: channel === "dine-in" ? state.tableId : undefined,
    })),
  setPayment: (payment) => set({ payment }),
  setTableId: (tableId) => set({ tableId }),
  setNote: (note) => set({ note }),
  setDiscountPct: (discountPct) => set({ discountPct }),
}));

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => {
    const modPrice = i.modifiers.reduce((m, mod) => m + mod.priceDelta, 0);
    return sum + (i.unitPrice + modPrice) * i.quantity;
  }, 0);
}
