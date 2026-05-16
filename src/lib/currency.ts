/**
 * Currency layer.
 *
 * `formatMoney` is the single point that turns a numeric amount into a
 * display string. Anything that needs to render money should call it
 * rather than building strings by hand — this keeps the swap to a
 * Settings-driven country/currency selector cheap.
 *
 * Locale and decimal precision live alongside the symbol so changing
 * regions doesn't require touching call sites.
 */

export type CurrencyConfig = {
  /** ISO 4217 code, mostly for analytics/serialization */
  code: string;
  /** Visual symbol shown to users (e.g. "Rs.", "$", "€") */
  symbol: string;
  /** Where the symbol sits relative to the amount */
  position: "prefix" | "suffix";
  /** Intl locale used by NumberFormat */
  locale: string;
  /** Default fractional digits */
  decimals: number;
};

export const CURRENCIES = {
  PKR: {
    code: "PKR",
    symbol: "Rs.",
    position: "prefix",
    locale: "en-PK",
    decimals: 0,
  },
  USD: {
    code: "USD",
    symbol: "$",
    position: "prefix",
    locale: "en-US",
    decimals: 2,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    position: "prefix",
    locale: "de-DE",
    decimals: 2,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    position: "prefix",
    locale: "en-GB",
    decimals: 2,
  },
  AED: {
    code: "AED",
    symbol: "AED",
    position: "prefix",
    locale: "en-AE",
    decimals: 2,
  },
} as const satisfies Record<string, CurrencyConfig>;

export type CurrencyCode = keyof typeof CURRENCIES;

export const DEFAULT_CURRENCY: CurrencyConfig = CURRENCIES.PKR;

type FormatOverrides = Partial<
  Pick<CurrencyConfig, "decimals" | "symbol" | "locale" | "position">
> & {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function formatMoney(
  value: number,
  overrides: FormatOverrides = {},
  currency: CurrencyConfig = DEFAULT_CURRENCY,
): string {
  const decimals = overrides.decimals ?? currency.decimals;
  const min = overrides.minimumFractionDigits ?? decimals;
  const max = overrides.maximumFractionDigits ?? decimals;
  const locale = overrides.locale ?? currency.locale;
  const symbol = overrides.symbol ?? currency.symbol;
  const position = overrides.position ?? currency.position;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: Math.min(min, max),
    maximumFractionDigits: max,
  }).format(value);

  return position === "prefix" ? `${symbol} ${formatted}` : `${formatted} ${symbol}`;
}

export function formatMoneyCompact(
  value: number,
  currency: CurrencyConfig = DEFAULT_CURRENCY,
): string {
  const formatted = new Intl.NumberFormat(currency.locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
  return currency.position === "prefix"
    ? `${currency.symbol} ${formatted}`
    : `${formatted} ${currency.symbol}`;
}
