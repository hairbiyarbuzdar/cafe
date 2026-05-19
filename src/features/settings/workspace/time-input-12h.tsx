"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * 12-hour clock input split into hour (1–12), minute (5-minute steps),
 * and AM/PM. Value is exchanged in 24-hour "HH:mm" so the rest of the
 * codebase keeps a single canonical representation. `null` means
 * "closed / unset".
 */
export function TimeInput12h({
  value,
  onChange,
  disabled,
  className,
}: {
  value: string | null;
  onChange: (next: string | null) => void;
  disabled?: boolean;
  className?: string;
}) {
  const parsed = parse24(value);
  const hour = parsed?.hour ?? 9;
  const minute = parsed?.minute ?? 0;
  const ampm: "AM" | "PM" = parsed?.ampm ?? "AM";

  function emit(next: { hour: number; minute: number; ampm: "AM" | "PM" }) {
    onChange(format24(next));
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Select
        value={String(hour)}
        onValueChange={(v) =>
          emit({ hour: Number(v), minute, ampm })
        }
        disabled={disabled}
      >
        <SelectTrigger size="sm" className="h-9 w-[64px] rounded-md tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <SelectItem key={h} value={String(h)}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="text-muted-foreground">:</span>
      <Select
        value={String(minute).padStart(2, "0")}
        onValueChange={(v) =>
          emit({ hour, minute: Number(v), ampm })
        }
        disabled={disabled}
      >
        <SelectTrigger size="sm" className="h-9 w-[68px] rounded-md tabular-nums">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MINUTE_OPTIONS.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={ampm}
        onValueChange={(v) =>
          emit({ hour, minute, ampm: v as "AM" | "PM" })
        }
        disabled={disabled}
      >
        <SelectTrigger size="sm" className="h-9 w-[72px] rounded-md">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

const MINUTE_OPTIONS = [
  "00",
  "05",
  "10",
  "15",
  "20",
  "25",
  "30",
  "35",
  "40",
  "45",
  "50",
  "55",
];

function parse24(
  value: string | null,
): { hour: number; minute: number; ampm: "AM" | "PM" } | null {
  if (!value) return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h24 = Number(m[1]);
  const minute = Number(m[2]);
  if (h24 < 0 || h24 > 23 || minute < 0 || minute > 59) return null;
  const ampm: "AM" | "PM" = h24 < 12 ? "AM" : "PM";
  const hour = h24 % 12 === 0 ? 12 : h24 % 12;
  return { hour, minute, ampm };
}

function format24(parts: {
  hour: number;
  minute: number;
  ampm: "AM" | "PM";
}): string {
  const h12 = parts.hour % 12; // 12 → 0
  const h24 = parts.ampm === "AM" ? h12 : h12 + 12;
  return `${String(h24).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

/** Format an internal "HH:mm" for display. Returns "—" when null. */
export function format12hLabel(value: string | null): string {
  const parsed = parse24(value);
  if (!parsed) return "—";
  return `${parsed.hour}:${String(parsed.minute).padStart(2, "0")} ${parsed.ampm}`;
}
