"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  History,
  MoreHorizontal,
  Pencil,
  Search,
  TrendingDown,
  UserCog,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";

import {
  TablePagination,
  usePagination,
} from "@/components/shared/table-pagination";
import { ExportMenu } from "@/components/shared/export-menu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdvancesDialog } from "@/features/payroll/advances-dialog";
import { DeactivateDialog } from "@/features/payroll/deactivate-dialog";
import { HistoryDialog } from "@/features/payroll/history-dialog";
import { OvertimeDialog } from "@/features/payroll/overtime-dialog";
import { PaySalaryDialog } from "@/features/payroll/pay-salary-dialog";
import { WorkerFormDialog } from "@/features/payroll/worker-form-dialog";
import type { PayrollRow, PayrollStats } from "@/lib/queries/payroll";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import { cn, formatCurrency, initials } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type ModalType =
  | "register"
  | "edit"
  | "pay"
  | "advance"
  | "overtime"
  | "deactivate"
  | "history";
type Modal = { type: ModalType; worker: PayrollRow | null };

export function PayrollShell({
  month,
  year,
  monthNum,
  rows,
  stats,
  channels,
  roles,
}: {
  month: string;
  year: number;
  monthNum: number;
  rows: PayrollRow[];
  stats: PayrollStats;
  channels: PaymentChannel[];
  roles: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "active" | "inactive">("all");
  const [modal, setModal] = React.useState<Modal | null>(null);

  const baseYear = new Date().getFullYear();
  const years = (() => {
    const set = new Set<number>([year]);
    for (let y = baseYear - 3; y <= baseYear + 1; y++) set.add(y);
    return Array.from(set).sort((a, b) => a - b);
  })();

  function navigate(y: number, m: number) {
    router.push(`/staff?year=${y}&month=${m}`);
  }

  const filtered = rows.filter((r) => {
    if (statusFilter === "active" && !r.active) return false;
    if (statusFilter === "inactive" && r.active) return false;
    if (search.trim() && !r.name.toLowerCase().includes(search.trim().toLowerCase())) {
      return false;
    }
    return true;
  });
  const pg = usePagination(filtered);

  const open = (type: ModalType, worker: PayrollRow | null) =>
    setModal({ type, worker });
  const closeModal = () => setModal(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-elevated lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            Staff Payroll
          </h1>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            Manage salaries, advances, and overtime.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-muted-foreground" />
          <Select value={String(monthNum)} onValueChange={(v) => navigate(year, Number(v))}>
            <SelectTrigger className="h-10 w-[130px] text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={(v) => navigate(Number(v), monthNum)}>
            <SelectTrigger className="h-10 w-[90px] text-[13px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ExportMenu
            modules={["staff"]}
            scope="staff"
            title="Staff"
            className="h-10"
          />
          <Button
            size="sm"
            className="h-10 rounded-md text-[13px] font-medium"
            onClick={() => open("register", null)}
          >
            <UserPlus className="size-4" />
            Add Staff
          </Button>
        </div>
      </header>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              pg.setPage(1);
            }}
            placeholder="Search workers by name…"
            className="h-11 rounded-xl ps-10 text-[13px]"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as typeof statusFilter);
            pg.setPage(1);
          }}
        >
          <SelectTrigger className="h-11 w-full rounded-xl text-[13px] sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Staff</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} tone="primary" label="Active Staff" value={String(stats.activeStaff)} />
        <StatCard icon={Wallet} tone="success" label="Total Salary Bill" value={formatCurrency(stats.totalSalaryBill)} />
        <StatCard icon={TrendingDown} tone="amber" label="Total Advances" value={formatCurrency(stats.totalAdvances)} />
        <StatCard icon={Wallet} tone="muted" label="Net Salaries Paid" value={formatCurrency(stats.netSalariesPaid)} />
      </section>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-elevated">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-[13px]">
            <thead>
              <tr className="border-b bg-muted/40 text-[12px] font-semibold text-foreground">
                <Th>Worker</Th>
                <Th>Salary</Th>
                <Th>Extra Hours</Th>
                <Th>Advances</Th>
                <Th>Absence Deduction</Th>
                <Th>Net Payable</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {pg.pageItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    No workers match. Add staff to start running payroll.
                  </td>
                </tr>
              ) : (
                pg.pageItems.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-md bg-primary text-[13px] font-semibold text-primary-foreground">
                          {initials(r.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{r.name}</p>
                          <p className="text-[10.5px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
                            {r.roleName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-foreground">
                      {formatCurrency(r.salary)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-blue-600">
                      {r.overtimeHours} hrs
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-amber-600">
                      {formatCurrency(r.advances)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-destructive">
                      {formatCurrency(r.absenceDeduction)}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-primary">
                      {formatCurrency(r.netPayable)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge active={r.active} paid={r.paid} />
                    </td>
                    <td className="px-4 py-3.5">
                      <RowActions row={r} onAction={open} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={pg.page}
          pageCount={pg.pageCount}
          shown={pg.shown}
          total={pg.total}
          onPrev={pg.prev}
          onNext={pg.next}
        />
      </div>

      {/* Modals */}
      {modal?.type === "register" || modal?.type === "edit" ? (
        <WorkerFormDialog
          open
          onOpenChange={(o) => !o && closeModal()}
          worker={modal.type === "edit" ? modal.worker : null}
          roles={roles}
        />
      ) : null}
      {modal?.type === "pay" && modal.worker ? (
        <PaySalaryDialog
          open
          onOpenChange={(o) => !o && closeModal()}
          worker={modal.worker}
          month={month}
          channels={channels}
        />
      ) : null}
      {modal?.type === "advance" && modal.worker ? (
        <AdvancesDialog
          open
          onOpenChange={(o) => !o && closeModal()}
          worker={modal.worker}
          month={month}
          channels={channels}
        />
      ) : null}
      {modal?.type === "overtime" && modal.worker ? (
        <OvertimeDialog
          open
          onOpenChange={(o) => !o && closeModal()}
          worker={modal.worker}
          month={month}
        />
      ) : null}
      {modal?.type === "deactivate" && modal.worker ? (
        <DeactivateDialog
          open
          onOpenChange={(o) => !o && closeModal()}
          worker={modal.worker}
        />
      ) : null}
      {modal?.type === "history" && modal.worker ? (
        <HistoryDialog
          open
          onOpenChange={(o) => !o && closeModal()}
          worker={modal.worker}
        />
      ) : null}
    </div>
  );
}

function RowActions({
  row,
  onAction,
}: {
  row: PayrollRow;
  onAction: (type: ModalType, worker: PayrollRow) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-md text-[11.5px]">
          <MoreHorizontal className="size-3.5" />
          View Details
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem onSelect={() => onAction("history", row)}>
          <History className="size-4" />
          View History
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
          Payroll actions
        </DropdownMenuLabel>
        <DropdownMenuItem className="text-blue-600" onSelect={() => onAction("pay", row)}>
          <Wallet className="size-4" />
          Pay Salaries
        </DropdownMenuItem>
        <DropdownMenuItem className="text-amber-600" onSelect={() => onAction("advance", row)}>
          <TrendingDown className="size-4" />
          Record Advance
        </DropdownMenuItem>
        <DropdownMenuItem className="text-violet-600" onSelect={() => onAction("overtime", row)}>
          <Clock className="size-4" />
          Manage Overtime
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-[10.5px] uppercase tracking-[0.06em] text-muted-foreground">
          Management
        </DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onAction("edit", row)}>
          <Pencil className="size-4" />
          Edit Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className={row.active ? "text-destructive" : "text-success"}
          onSelect={() => onAction("deactivate", row)}
        >
          <UserCog className="size-4" />
          {row.active ? "Deactivate Worker" : "Reactivate Worker"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusBadge({ active, paid }: { active: boolean; paid: boolean }) {
  if (!active) {
    return (
      <span className="inline-flex rounded-md border border-border bg-muted px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
        Inactive
      </span>
    );
  }
  return paid ? (
    <span className="inline-flex rounded-md border border-success/30 bg-success/12 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-success">
      Paid
    </span>
  ) : (
    <span className="inline-flex rounded-md border border-warning/30 bg-warning/15 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.04em] text-warning-foreground/90">
      Unpaid
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

function StatCard({
  icon: Icon,
  tone,
  label,
  value,
}: {
  icon: typeof Wallet;
  tone: "primary" | "success" | "amber" | "muted";
  label: string;
  value: string;
}) {
  const toneClass = {
    primary: "bg-blue-500/12 text-blue-600",
    success: "bg-success/12 text-success",
    amber: "bg-amber-500/15 text-amber-600",
    muted: "bg-muted text-muted-foreground",
  }[tone];
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-elevated">
      <span className={cn("flex size-10 items-center justify-center rounded-lg", toneClass)}>
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-[20px] font-semibold tabular-nums text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
