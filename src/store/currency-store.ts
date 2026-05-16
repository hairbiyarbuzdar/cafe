"use client";

import { create } from "zustand";

import { CURRENCIES, DEFAULT_CURRENCY, type CurrencyCode, type CurrencyConfig } from "@/lib/currency";

type State = {
  currency: CurrencyConfig;
  setCurrencyCode: (code: CurrencyCode) => void;
};

export const useCurrency = create<State>((set) => ({
  currency: DEFAULT_CURRENCY,
  setCurrencyCode: (code) => set({ currency: CURRENCIES[code] }),
}));
