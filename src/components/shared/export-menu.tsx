"use client";

import * as React from "react";
import {
  Braces,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { exportModulesAction } from "@/lib/data-transfer/export-actions";
import { runExport } from "@/lib/data-transfer/run-export";
import type { ExportFormat, ModuleKey } from "@/lib/data-transfer/types";

const FORMAT_META: Record<
  ExportFormat,
  { label: string; hint: string; icon: React.ComponentType<{ className?: string }> }
> = {
  csv: { label: "CSV", hint: "Comma-separated", icon: FileText },
  xlsx: { label: "Excel", hint: "Branded .xlsx", icon: FileSpreadsheet },
  json: { label: "JSON", hint: "Raw data", icon: Braces },
  pdf: { label: "PDF", hint: "Print-ready report", icon: FileText },
};

const DEFAULT_FORMATS: ExportFormat[] = ["csv", "xlsx", "json", "pdf"];

export interface ExportMenuProps {
  /** Modules to include — one for a page export, several for a bundle. */
  modules: ModuleKey[];
  /** Filename scope + default title, e.g. "orders". */
  scope: string;
  /** PDF header title. Defaults to a title-cased scope. */
  title?: string;
  /** PDF subtitle (active filters / date range). */
  subtitle?: string;
  label?: string;
  formats?: ExportFormat[];
  size?: "sm" | "default";
  variant?: "default" | "outline";
  className?: string;
  align?: "start" | "end";
  pdfOrientation?: "portrait" | "landscape";
}

export function ExportMenu({
  modules,
  scope,
  title,
  subtitle,
  label = "Export",
  formats = DEFAULT_FORMATS,
  size = "sm",
  variant = "outline",
  className,
  align = "end",
  pdfOrientation,
}: ExportMenuProps) {
  const [busy, setBusy] = React.useState<ExportFormat | null>(null);

  async function handleExport(format: ExportFormat) {
    if (busy) return;
    setBusy(format);
    const toastId = toast.loading(`Preparing ${FORMAT_META[format].label}…`);
    try {
      const res = await exportModulesAction(modules);
      if (!res.ok) {
        toast.error("Export failed", { id: toastId, description: res.error });
        return;
      }
      const totalRows = res.bundle.datasets.reduce(
        (sum, d) => sum + d.rows.length,
        0,
      );
      await runExport(res.bundle, format, {
        scope,
        title: title ?? scope,
        subtitle,
        pdf: pdfOrientation ? { orientation: pdfOrientation } : undefined,
      });
      toast.success(`Exported ${totalRows} record${totalRows === 1 ? "" : "s"}`, {
        id: toastId,
        description: `${FORMAT_META[format].label} file downloaded.`,
      });
    } catch (err) {
      toast.error("Export failed", {
        id: toastId,
        description: err instanceof Error ? err.message : "Unexpected error",
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            size === "sm" && "h-8 rounded-md text-[12.5px]",
            className,
          )}
          disabled={busy !== null}
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Download className="size-3.5" />
          )}
          {label}
          <ChevronDown className="size-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-52">
        <DropdownMenuLabel className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Export as
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {formats.map((format) => {
          const meta = FORMAT_META[format];
          const Icon = meta.icon;
          return (
            <DropdownMenuItem
              key={format}
              onSelect={(e) => {
                e.preventDefault();
                void handleExport(format);
              }}
              disabled={busy !== null}
              className="gap-2.5"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                <Icon className="size-3.5" />
              </span>
              <span className="flex flex-col">
                <span className="text-[12.5px] font-medium">{meta.label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {meta.hint}
                </span>
              </span>
              {busy === format ? (
                <Loader2 className="ms-auto size-3.5 animate-spin" />
              ) : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
