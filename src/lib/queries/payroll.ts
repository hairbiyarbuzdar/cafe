import "server-only";

import { prisma } from "@/lib/prisma";

export type AdvanceEntry = {
  id: string;
  amount: number;
  date: string;
  channelName: string | null;
  notes: string | null;
};

export type OvertimeEntry = {
  id: string;
  hours: number;
  rate: number;
  earned: number;
  createdAt: string;
};

export type SalaryPaymentInfo = {
  paymentDate: string;
  absentDays: number;
  netPaid: number;
  channelName: string | null;
  notes: string | null;
};

/** One worker's payroll row for a given month — every column the table
 * shows plus the per-month history the action modals render. */
export type PayrollRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  roleName: string;
  active: boolean;
  salary: number;
  overtimeRate: number;
  standardWorkingDays: number;
  overtimeHours: number;
  overtimeEarned: number;
  advances: number;
  absentDays: number;
  absenceDeduction: number;
  netPayable: number;
  paid: boolean;
  advanceEntries: AdvanceEntry[];
  overtimeEntries: OvertimeEntry[];
  payment: SalaryPaymentInfo | null;
};

export type PayrollStats = {
  activeStaff: number;
  totalSalaryBill: number;
  totalAdvances: number;
  netSalariesPaid: number;
};

export type PayrollRoster = {
  rows: PayrollRow[];
  stats: PayrollStats;
};

/**
 * Build the payroll roster for `month` ("YYYY-MM"): every worker with
 * their salary, overtime, advances, absence deduction, net payable, and
 * paid/unpaid status, plus the month's advance + overtime history so the
 * action modals can render without a second round-trip.
 */
export async function listPayroll(month: string): Promise<PayrollRoster> {
  const users = await prisma.user.findMany({
    orderBy: [{ active: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      active: true,
      monthlySalary: true,
      overtimeRate: true,
      standardWorkingDays: true,
      roleRef: { select: { name: true } },
      salaryPayments: {
        where: { month },
        select: {
          paymentDate: true,
          absentDays: true,
          netPaid: true,
          notes: true,
          paymentChannel: { select: { name: true } },
        },
      },
      staffAdvances: {
        where: { month },
        orderBy: { date: "desc" },
        select: {
          id: true,
          amount: true,
          date: true,
          notes: true,
          paymentChannel: { select: { name: true } },
        },
      },
      staffOvertime: {
        where: { month },
        orderBy: { createdAt: "desc" },
        select: { id: true, hours: true, rate: true, createdAt: true },
      },
    },
  });

  const rows: PayrollRow[] = users.map((u) => {
    const salary = toNumber(u.monthlySalary);
    const stdDays = u.standardWorkingDays || 26;

    const overtimeEntries: OvertimeEntry[] = u.staffOvertime.map((o) => {
      const hours = toNumber(o.hours);
      const rate = toNumber(o.rate);
      return {
        id: o.id,
        hours,
        rate,
        earned: round2(hours * rate),
        createdAt: o.createdAt.toISOString(),
      };
    });
    const overtimeHours = round2(
      overtimeEntries.reduce((s, o) => s + o.hours, 0),
    );
    const overtimeEarned = round2(
      overtimeEntries.reduce((s, o) => s + o.earned, 0),
    );

    const advanceEntries: AdvanceEntry[] = u.staffAdvances.map((a) => ({
      id: a.id,
      amount: toNumber(a.amount),
      date: a.date.toISOString(),
      channelName: a.paymentChannel?.name ?? null,
      notes: a.notes,
    }));
    const advances = round2(advanceEntries.reduce((s, a) => s + a.amount, 0));

    const pay = u.salaryPayments[0] ?? null;
    const paid = Boolean(pay);
    const absentDays = pay ? toNumber(pay.absentDays) : 0;
    const perDay = stdDays > 0 ? salary / stdDays : 0;
    const absenceDeduction = round2(absentDays * perDay);
    const netPayable = pay
      ? toNumber(pay.netPaid)
      : round2(salary + overtimeEarned - advances - absenceDeduction);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      roleName: u.roleRef?.name ?? u.role,
      active: u.active,
      salary,
      overtimeRate: toNumber(u.overtimeRate),
      standardWorkingDays: stdDays,
      overtimeHours,
      overtimeEarned,
      advances,
      absentDays,
      absenceDeduction,
      netPayable,
      paid,
      advanceEntries,
      overtimeEntries,
      payment: pay
        ? {
            paymentDate: pay.paymentDate.toISOString(),
            absentDays,
            netPaid: toNumber(pay.netPaid),
            channelName: pay.paymentChannel?.name ?? null,
            notes: pay.notes,
          }
        : null,
    };
  });

  const active = rows.filter((r) => r.active);
  const stats: PayrollStats = {
    activeStaff: active.length,
    totalSalaryBill: round2(active.reduce((s, r) => s + r.salary, 0)),
    totalAdvances: round2(rows.reduce((s, r) => s + r.advances, 0)),
    netSalariesPaid: round2(
      rows.reduce((s, r) => s + (r.paid ? r.netPayable : 0), 0),
    ),
  };

  return { rows, stats };
}

// ──────────────────────────────────────────────────────────────
// Per-worker lifetime history (across every month)
// ──────────────────────────────────────────────────────────────

export type HistoryPayment = {
  id: string;
  month: string;
  paymentDate: string;
  absentDays: number;
  netPaid: number;
  channelName: string | null;
  notes: string | null;
};

export type HistoryAdvance = {
  id: string;
  month: string;
  amount: number;
  date: string;
  channelName: string | null;
  notes: string | null;
};

export type HistoryOvertime = {
  id: string;
  month: string;
  hours: number;
  rate: number;
  earned: number;
  createdAt: string;
};

export type WorkerHistory = {
  name: string;
  lifetimePaid: number;
  totalAdvances: number;
  overtimeHours: number;
  overtimeEarned: number;
  payments: HistoryPayment[];
  advances: HistoryAdvance[];
  overtime: HistoryOvertime[];
};

/** Every payment, advance, and overtime log for one worker, across all
 * months — powering the History modal. Newest-first. */
export async function getWorkerHistory(
  userId: string,
): Promise<WorkerHistory | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      salaryPayments: {
        orderBy: { paymentDate: "desc" },
        select: {
          id: true,
          month: true,
          paymentDate: true,
          absentDays: true,
          netPaid: true,
          notes: true,
          paymentChannel: { select: { name: true } },
        },
      },
      staffAdvances: {
        orderBy: { date: "desc" },
        select: {
          id: true,
          month: true,
          amount: true,
          date: true,
          notes: true,
          paymentChannel: { select: { name: true } },
        },
      },
      staffOvertime: {
        orderBy: { createdAt: "desc" },
        select: { id: true, month: true, hours: true, rate: true, createdAt: true },
      },
    },
  });
  if (!user) return null;

  const payments: HistoryPayment[] = user.salaryPayments.map((p) => ({
    id: p.id,
    month: p.month,
    paymentDate: p.paymentDate.toISOString(),
    absentDays: toNumber(p.absentDays),
    netPaid: toNumber(p.netPaid),
    channelName: p.paymentChannel?.name ?? null,
    notes: p.notes,
  }));
  const advances: HistoryAdvance[] = user.staffAdvances.map((a) => ({
    id: a.id,
    month: a.month,
    amount: toNumber(a.amount),
    date: a.date.toISOString(),
    channelName: a.paymentChannel?.name ?? null,
    notes: a.notes,
  }));
  const overtime: HistoryOvertime[] = user.staffOvertime.map((o) => {
    const hours = toNumber(o.hours);
    const rate = toNumber(o.rate);
    return {
      id: o.id,
      month: o.month,
      hours,
      rate,
      earned: round2(hours * rate),
      createdAt: o.createdAt.toISOString(),
    };
  });

  return {
    name: user.name,
    lifetimePaid: round2(payments.reduce((s, p) => s + p.netPaid, 0)),
    totalAdvances: round2(advances.reduce((s, a) => s + a.amount, 0)),
    overtimeHours: round2(overtime.reduce((s, o) => s + o.hours, 0)),
    overtimeEarned: round2(overtime.reduce((s, o) => s + o.earned, 0)),
    payments,
    advances,
    overtime,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number.parseFloat(value);
  if (typeof value === "object" && value !== null && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return Number(value);
}
