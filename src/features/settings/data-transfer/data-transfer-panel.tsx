"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Braces,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  FileUp,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { exportModulesAction } from "@/lib/data-transfer/export-actions";
import {
  importDataAction,
  type ImportPayload,
} from "@/lib/data-transfer/import-actions";
import { parseImportFile, rowsForModule } from "@/lib/data-transfer/import-parse";
import {
  ALL_MODULES,
  EXPORTABLE_MODULES,
  getModule,
} from "@/lib/data-transfer/registry";
import { runExport } from "@/lib/data-transfer/run-export";
import {
  EXPORT_FORMAT_LABELS,
  type ExportFormat,
  type ImportResult,
  type ModuleKey,
  type ParsedImportFile,
} from "@/lib/data-transfer/types";
import { cn } from "@/lib/utils";

const FORMAT_ICONS: Record<
  ExportFormat,
  React.ComponentType<{ className?: string }>
> = {
  csv: FileText,
  xlsx: FileSpreadsheet,
  json: Braces,
  pdf: FileText,
};

const EXPORT_FORMATS: ExportFormat[] = ["csv", "xlsx", "json", "pdf"];
const ACCEPT = ".csv,.xlsx,.xls,.json";

export function DataTransferPanel() {
  const router = useRouter();
  const allKeys = React.useMemo(
    () => EXPORTABLE_MODULES.map((m) => m.key),
    [],
  );

  // ---- export state ------------------------------------------------
  const [selected, setSelected] = React.useState<Set<ModuleKey>>(
    () => new Set(allKeys),
  );
  const [exporting, setExporting] = React.useState<ExportFormat | null>(null);

  const allSelected = selected.size === allKeys.length;
  const noneSelected = selected.size === 0;

  function toggle(key: ModuleKey) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function handleExport(format: ExportFormat) {
    if (exporting || noneSelected) return;
    const keys = allKeys.filter((k) => selected.has(k));
    setExporting(format);
    const toastId = toast.loading(`Preparing ${EXPORT_FORMAT_LABELS[format]}…`);
    try {
      const res = await exportModulesAction(keys);
      if (!res.ok) {
        toast.error("Export failed", { id: toastId, description: res.error });
        return;
      }
      const isFull = keys.length === allKeys.length;
      const scope = isFull
        ? "full-system"
        : keys.length === 1
          ? keys[0]!
          : "selected-data";
      const title = isFull
        ? "Complete System Export"
        : keys.length === 1
          ? getModule(keys[0]!).label
          : "Data Export";
      await runExport(res.bundle, format, { scope, title });
      const rows = res.bundle.datasets.reduce((s, d) => s + d.rows.length, 0);
      toast.success(`Exported ${rows} record${rows === 1 ? "" : "s"}`, {
        id: toastId,
        description: `${keys.length} module${keys.length === 1 ? "" : "s"} → ${EXPORT_FORMAT_LABELS[format]}`,
      });
    } catch (err) {
      toast.error("Export failed", {
        id: toastId,
        description: err instanceof Error ? err.message : "Unexpected error",
      });
    } finally {
      setExporting(null);
    }
  }

  // ---- import state ------------------------------------------------
  const [file, setFile] = React.useState<File | null>(null);
  const [parsing, setParsing] = React.useState(false);
  const [parsed, setParsed] = React.useState<ParsedImportFile | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [result, setResult] = React.useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const importableSheets =
    parsed?.sheets.filter(
      (s) => s.matchedModule && getModule(s.matchedModule).importable,
    ) ?? [];

  async function handleFile(f: File) {
    setFile(f);
    setResult(null);
    setParsed(null);
    setParsing(true);
    try {
      const p = await parseImportFile(f);
      setParsed(p);
      if (!p.sheets.length) {
        toast.warning("Nothing detected", {
          description: "The file had no readable rows.",
        });
      }
    } catch (err) {
      toast.error("Couldn't read file", {
        description: err instanceof Error ? err.message : "Unsupported file",
      });
      setFile(null);
    } finally {
      setParsing(false);
    }
  }

  function resetImport() {
    setFile(null);
    setParsed(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleImport() {
    if (importing || !parsed) return;
    // Merge rows per module (a file could split one module across sheets).
    const byModule = new Map<ModuleKey, Record<string, string>[]>();
    for (const sheet of parsed.sheets) {
      const key = sheet.matchedModule;
      if (!key || !getModule(key).importable) continue;
      const rows = rowsForModule(sheet, key);
      byModule.set(key, [...(byModule.get(key) ?? []), ...rows]);
    }
    const payload: ImportPayload = {
      modules: [...byModule.entries()].map(([key, rows]) => ({ key, rows })),
    };
    if (!payload.modules.length) {
      toast.error("Nothing to import", {
        description: "No sheet matched an importable module.",
      });
      return;
    }

    setImporting(true);
    const toastId = toast.loading("Importing…");
    try {
      const res = await importDataAction(payload);
      setResult(res);
      if (!res.ok) {
        toast.error("Import failed", { id: toastId, description: res.error });
        return;
      }
      const inserted = res.modules.reduce((s, m) => s + m.inserted, 0);
      const skipped = res.modules.reduce((s, m) => s + m.skipped, 0);
      toast.success(`Imported ${inserted} new record${inserted === 1 ? "" : "s"}`, {
        id: toastId,
        description: `${skipped} duplicate${skipped === 1 ? "" : "s"} skipped.`,
      });
      router.refresh();
    } catch (err) {
      toast.error("Import failed", {
        id: toastId,
        description: err instanceof Error ? err.message : "Unexpected error",
      });
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* ---------------- EXPORT ---------------- */}
      <SectionCard
        title="Export data"
        description="Download one module, a selection, or the entire system. XLSX produces a single multi-sheet, branded workbook; PDF is a print-ready report."
        action={
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-md text-[12px]"
              onClick={() => setSelected(new Set(allKeys))}
              disabled={allSelected}
            >
              Select all
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-md text-[12px]"
              onClick={() => setSelected(new Set())}
              disabled={noneSelected}
            >
              Clear
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {EXPORTABLE_MODULES.map((m) => {
            const checked = selected.has(m.key);
            return (
              <label
                key={m.key}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  checked
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/70 hover:bg-muted/50",
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggle(m.key)}
                  className="mt-0.5"
                />
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium text-foreground">
                    {m.label}
                    {!m.importable ? (
                      <span className="ms-1.5 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                        export-only
                      </span>
                    ) : null}
                  </span>
                  <span className="block text-[11.5px] leading-snug text-muted-foreground">
                    {m.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
          <span className="text-[12px] text-muted-foreground">
            {selected.size} of {allKeys.length} selected — export as:
          </span>
          {EXPORT_FORMATS.map((format) => {
            const Icon = FORMAT_ICONS[format];
            return (
              <Button
                key={format}
                variant="outline"
                size="sm"
                className="h-8 rounded-md text-[12.5px]"
                onClick={() => handleExport(format)}
                disabled={exporting !== null || noneSelected}
              >
                {exporting === format ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Icon className="size-3.5" />
                )}
                {EXPORT_FORMAT_LABELS[format]}
              </Button>
            );
          })}
        </div>
      </SectionCard>

      {/* ---------------- IMPORT ---------------- */}
      <SectionCard
        title="Import data"
        description="Upload CSV, XLSX, or JSON. Multi-sheet workbooks are auto-detected and mapped to their modules. Records whose ID already exists are skipped — never overwritten."
      >
        {!file ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void handleFile(f);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border/70 bg-muted/30",
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <FileUp className="size-5" />
            </span>
            <p className="text-[13.5px] font-medium text-foreground">
              Drag a file here, or
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-8 rounded-md text-[12.5px]"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              Choose file
            </Button>
            <p className="text-[11.5px] text-muted-foreground">
              Supports .csv, .xlsx, and .json
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-2.5">
                <FileText className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-[13px] font-medium">
                  {file.name}
                </span>
                {parsing ? (
                  <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                ) : null}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-7 rounded-md"
                onClick={resetImport}
                disabled={importing}
                aria-label="Remove file"
              >
                <X className="size-3.5" />
              </Button>
            </div>

            {parsed && !result ? (
              <>
                <ul className="divide-y rounded-lg border">
                  {parsed.sheets.map((s, i) => {
                    const mod = s.matchedModule
                      ? getModule(s.matchedModule)
                      : null;
                    const willImport = !!mod?.importable;
                    return (
                      <li
                        key={`${s.name}-${i}`}
                        className="flex items-center justify-between gap-3 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-medium">
                            {s.name}
                            {mod ? (
                              <span className="ms-1.5 text-muted-foreground">
                                → {mod.label}
                              </span>
                            ) : null}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {s.rows.length} row{s.rows.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <StatusBadge
                          tone={willImport ? "ok" : "muted"}
                          label={
                            willImport
                              ? "Will import"
                              : mod
                                ? "Export-only"
                                : "Unrecognized"
                          }
                        />
                      </li>
                    );
                  })}
                </ul>

                {parsed.warnings.length ? (
                  <div className="space-y-1 rounded-lg border border-warning/40 bg-warning/10 p-3">
                    {parsed.warnings.map((w, i) => (
                      <p
                        key={i}
                        className="flex items-start gap-1.5 text-[11.5px] text-warning-foreground/90"
                      >
                        <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                        {w}
                      </p>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] text-muted-foreground">
                    {importableSheets.length} importable sheet
                    {importableSheets.length === 1 ? "" : "s"} detected.
                  </p>
                  <Button
                    size="sm"
                    className="h-9 rounded-md text-[12.5px]"
                    onClick={handleImport}
                    disabled={importing || importableSheets.length === 0}
                  >
                    {importing ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin" />
                        Importing…
                      </>
                    ) : (
                      <>
                        <Upload className="size-3.5" />
                        Import data
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : null}

            {result ? <ImportResultView result={result} /> : null}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

function StatusBadge({
  tone,
  label,
}: {
  tone: "ok" | "muted" | "warn";
  label: string;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium",
        tone === "ok" && "bg-success/15 text-success-foreground",
        tone === "muted" && "bg-secondary text-muted-foreground",
        tone === "warn" && "bg-warning/15 text-warning-foreground",
      )}
    >
      {label}
    </span>
  );
}

function ImportResultView({ result }: { result: ImportResult }) {
  if (!result.ok && result.error) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <p className="text-[12.5px] text-destructive">{result.error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[13px] font-medium text-foreground">
        <CheckCircle2 className="size-4 text-success" />
        Import complete
      </div>
      <ul className="divide-y rounded-lg border">
        {result.modules.map((m) => (
          <li key={m.key} className="px-3 py-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12.5px] font-medium">{m.label}</span>
              <span className="flex items-center gap-3 text-[11.5px]">
                <span className="text-success-foreground">
                  +{m.inserted} added
                </span>
                <span className="text-muted-foreground">
                  {m.skipped} skipped
                </span>
                {m.errors.length ? (
                  <span className="text-destructive">
                    {m.errors.length} error{m.errors.length === 1 ? "" : "s"}
                  </span>
                ) : null}
              </span>
            </div>
            {m.errors.length ? (
              <details className="mt-1.5">
                <summary className="cursor-pointer text-[11px] text-muted-foreground hover:text-foreground">
                  View errors
                </summary>
                <ul className="mt-1 space-y-0.5 ps-3 text-[11px] text-destructive/90">
                  {m.errors.slice(0, 50).map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                  {m.errors.length > 50 ? (
                    <li>…and {m.errors.length - 50} more.</li>
                  ) : null}
                </ul>
              </details>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
