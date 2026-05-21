import * as React from "react";

import { cn } from "@/lib/utils";

/** Toolbar row at the top of each report: title + actions (filter/export). */
export function ReportHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-[12.5px] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

/** Compact KPI tile used across the report pages. */
export function StatTile({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "success" | "danger" | "warning";
}) {
  const accent =
    tone === "primary"
      ? "text-primary"
      : tone === "success"
        ? "text-success-foreground"
        : tone === "danger"
          ? "text-destructive"
          : tone === "warning"
            ? "text-warning-foreground"
            : "text-foreground";
  return (
    <div className="ring-highlight rounded-xl border border-border/70 bg-card p-4 shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1.5 text-[22px] font-semibold tabular-nums", accent)}>
        {value}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
