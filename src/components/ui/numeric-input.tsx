"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

/** Strip everything but digits (and, when allowed, a single decimal point). */
export function sanitizeNumeric(raw: string, decimal = true): string {
  if (!decimal) return raw.replace(/[^0-9]/g, "");
  let s = raw.replace(/[^0-9.]/g, "");
  const dot = s.indexOf(".");
  if (dot !== -1) {
    // collapse any extra dots after the first
    s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
  }
  return s;
}

/** Format a raw string into a local phone number: `03xx-xxxxxxx`
 * (11 digits, a dash after the 4th). Extra input is dropped. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  return digits.length <= 4 ? digits : `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

type BaseProps = Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "type"
>;

/**
 * A text input that only accepts numbers — a drop-in for `type="number"`
 * that loses the up/down spinner and rejects alphabetic input. Holds its
 * value as a string so empty / partial entry works; parse with `Number()`
 * on submit. Set `decimal={false}` for whole-number fields.
 */
export function NumericInput({
  value,
  onValueChange,
  decimal = true,
  inputMode,
  ...props
}: BaseProps & {
  value: string | number;
  onValueChange: (value: string) => void;
  decimal?: boolean;
}) {
  return (
    <Input
      {...props}
      type="text"
      inputMode={inputMode ?? (decimal ? "decimal" : "numeric")}
      value={value == null ? "" : String(value)}
      onChange={(e) => onValueChange(sanitizeNumeric(e.target.value, decimal))}
    />
  );
}

/**
 * A phone input that accepts only digits and auto-formats to the local
 * `03xx-xxxxxxx` shape (11 digits, dash after the 4th).
 */
export function PhoneInput({
  value,
  onValueChange,
  ...props
}: BaseProps & {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <Input
      {...props}
      type="tel"
      inputMode="numeric"
      maxLength={12}
      value={value}
      onChange={(e) => onValueChange(formatPhone(e.target.value))}
    />
  );
}
