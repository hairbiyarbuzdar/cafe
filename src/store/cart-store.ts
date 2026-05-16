"use client";

import { create } from "zustand";

import type { CartItem, OrderChannel, PaymentMethod, Product, ProductModifier } from "@/types";

type CartState = {
  items: CartItem[];
  channel: OrderChannel;
  payment: PaymentMethod;
  table?: string;
  note: string;
  discountPct: number;
  taxRate: number;
  add: (product: Product, modifiers?: ProductModifier[]) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  setChannel: (channel: OrderChannel) => void;
  setPayment: (payment: PaymentMethod) => void;
  setTable: (table: string | undefined) => void;
  setNote: (note: string) => void;
  setDiscountPct: (pct: number) => void;
};

export const useCart = create<CartState>((set) => ({
  items: [],
  channel: "dine-in",
  payment: "card",
  table: undefined,
  note: "",
  discountPct: 0,
  taxRate: 0.085,

  add: (product, modifiers = []) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            unitPrice: product.price,
            quantity: 1,
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

  remove: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

  clear: () =>
    set({
      items: [],
      note: "",
      discountPct: 0,
      table: undefined,
    }),

  setChannel: (channel) => set({ channel }),
  setPayment: (payment) => set({ payment }),
  setTable: (table) => set({ table }),
  setNote: (note) => set({ note }),
  setDiscountPct: (discountPct) => set({ discountPct }),
}));

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => {
    const modPrice = i.modifiers.reduce((m, mod) => m + mod.priceDelta, 0);
    return sum + (i.unitPrice + modPrice) * i.quantity;
  }, 0);
}
