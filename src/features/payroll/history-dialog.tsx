"use client";

import * as React from "react";
import {
  ArrowUpDown,
  Clock,
  History,
  Loader2,
  TrendingDown,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getWorkerHistoryAction } from "@/lib/actions/payroll";
import type { PayrollRow, WorkerHistory } from "@/lib/queries/payroll";
import { cn, formatCurrency } from "@/lib/utils";

type Tab = "payments" | "advances" | "overtime";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function HistoryDialog({
  open,
  onOpenChange,
  worker,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: PayrollRow;
}) {
  const [data, setData] = React.useState<WorkerHistory | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab] = React.useState<Tab>("payments");
  const [newestFirst, setNewestFirst] = React.useState(true);

  React.useEffect(() => {
    let alive = true;
    getWorkerHistoryAction(worker.id).then((d) => {
      if (alive) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      alive = false;
    };
  }, [worker.id]);

  const counts = {
    payments: data?.payments.length ?? 0,
    advances: data?.advances.length ?? 0,
    overtime: data?.overtime.length ?? 0,
  };

  function ordered<T>(arr: T[]): T[] {
    return newestFirst ? arr : [...arr].reverse();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92dvh] w-[min(720px,calc(100vw-1.5rem))] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[720px]">
        <DialogHeader className="flex-row items-start gap-3 border-b px-5 py-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-blue-500/12 text-blue-600">
            <History className="size-4.5" />
          </span>
          <div>
            <DialogTitle className="text-[15px] font-semibold tracking-tight">
              {worker.name} — History
            </DialogTitle>
            <DialogDescription className="text-[12.5px]">
              Full record of payments, advances, and overtime across every month.
            </DialogDescription>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2.5 px-5 pt-4 sm:grid-cols-3">
              <SummaryCard
                tone="success"
                icon={Wallet}
                label="Lifetime Paid"
                value={formatCurrency(data?.lifetimePaid ?? 0)}
              />
              <SummaryCard
                tone="amber"
                icon={TrendingDown}
                label="Total Advances"
                value={formatCurrency(data?.totalAdvances ?? 0)}
              />
              <SummaryCard
                tone="blue"
                icon={Clock}
                label="Overtime"
                value={`${data?.overtimeHours ?? 0} hrs`}
                sub={formatCurrency(data?.overtimeEarned ?? 0)}
              />
            </div>

            <div className="flex items-center justify-between gap-2 px-5 pt-4">
              <div className="inline-flex rounded-lg bg-muted/60 p-0.5">
                {(["payments", "advances", "overtime"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-[12.5px] font-medium capitalize transition",
                      tab === t
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t} ({counts[t]})
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setNewestFirst((v) => !v)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground transition hover:text-foreground"
              >
                <ArrowUpDown className="size-3.5" />
                {newestFirst ? "Newest first" : "Oldest first"}
              </button>
            </div>

            <ScrollArea className="mt-3 min-h-[180px] flex-1 px-5 pb-4">
              {tab === "payments" ? (
                counts.payments === 0 ? (
                  <Empty icon={Wallet} text="No payments recorded yet." />
                ) : (
                  <ul className="space-y-1.5">
                    {ordered(data!.payments).map((p) => (
                      <Entry
                        key={p.id}
                        month={p.month}
                        primary={formatCurrency(p.netPaid)}
                        primaryTone="success"
                        meta={[
                          fmtDate(p.paymentDate),
                          p.channelName,
                          p.absentDays > 0 ? `${p.absentDays} absent` : null,
                          p.notes,
                        ]}
                      />
                    ))}
                  </ul>
                )
              ) : null}

              {tab === "advances" ? (
                counts.advances === 0 ? (
                  <Empty icon={TrendingDown} text="No advances recorded yet." />
                ) : (
                  <ul className="space-y-1.5">
                    {ordered(data!.advances).map((a) => (
                      <Entry
                        key={a.id}
                        month={a.month}
                        primary={formatCurrency(a.amount)}
                        primaryTone="amber"
                        meta={[fmtDate(a.date), a.channelName, a.notes]}
                      />
                    ))}
                  </ul>
                )
              ) : null}

              {tab === "overtime" ? (
                counts.overtime === 0 ? (
                  <Empty icon={Clock} text="No overtime recorded yet." />
                ) : (
                  <ul className="space-y-1.5">
                    {ordered(data!.overtime).map((o) => (
                      <Entry
                        key={o.id}
                        month={o.month}
                        primary={formatCurrency(o.earned)}
                        primaryTone="blue"
                        meta={[
                          fmtDate(o.createdAt),
                          `${o.hours}h × ${formatCurrency(o.rate)}`,
                        ]}
                      />
                    ))}
                  </ul>
                )
              ) : null}
            </ScrollArea>
          </>
        )}

        <DialogFooter className="border-t bg-surface-1 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-md text-[12.5px] font-semibold"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Entry({
  month,
  primary,
  primaryTone,
  meta,
}: {
  month: string;
  primary: string;
  primaryTone: "success" | "amber" | "blue";
  meta: (string | null)[];
}) {
  const toneClass = {
    success: "text-success",
    amber: "text-amber-600",
    blue: "text-blue-600",
  }[primaryTone];
  const metaText = meta.filter(Boolean).join(" · ");
  return (
    <li className="flex items-center justify-between gap-3 rounded-md border bg-card px-3.5 py-2.5 text-[12.5px]">
      <div className="min-w-0">
        <p className={cn("font-semibold tabular-nums", toneClass)}>{primary}</p>
        {metaText ? (
          <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
            {metaText}
          </p>
        ) : null}
      </div>
      <span className="shrink-0 rounded-md border bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
        {month}
      </span>
    </li>
  );
}

function Empty({ icon: Icon, text }: { icon: typeof Wallet; text: string }) {
  return (
    <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
      <Icon className="size-6 text-muted-foreground/60" />
      <p className="text-[13px] font-medium text-muted-foreground">{text}</p>
    </div>
  );
}

function SummaryCard({
  tone,
  icon: Icon,
  label,
  value,
  sub,
}: {
  tone: "success" | "amber" | "blue";
  icon: typeof Wallet;
  label: string;
  value: string;
  sub?: string;
}) {
  const map = {
    success: { box: "border-success/25 bg-success/8", icon: "text-success", value: "text-success" },
    amber: { box: "border-amber-500/25 bg-amber-500/8", icon: "text-amber-600", value: "text-amber-600" },
    blue: { box: "border-blue-500/25 bg-blue-500/8", icon: "text-blue-600", value: "text-blue-600" },
  }[tone];
  return (
    <div className={cn("rounded-xl border p-3.5", map.box)}>
      <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
        <Icon className={cn("size-3.5", map.icon)} />
        {label}
      </p>
      <p className={cn("mt-1 text-[19px] font-semibold tabular-nums", map.value)}>
        {value}
      </p>
      {sub ? <p className="text-[11.5px] text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
