import "server-only";

import { supabase } from "@/lib/supabase";

export type AdvanceEntry = { id: string; amount: number; date: string; channelName: string | null; notes: string | null };
export type OvertimeEntry = { id: string; hours: number; rate: number; earned: number; createdAt: string };
export type SalaryPaymentInfo = { paymentDate: string; absentDays: number; netPaid: number; channelName: string | null; notes: string | null };
export type PayrollRow = {
  id: string; name: string; email: string; phone: string | null; role: string; roleName: string;
  active: boolean; salary: number; overtimeRate: number; standardWorkingDays: number;
  overtimeHours: number; overtimeEarned: number; advances: number; absentDays: number;
  absenceDeduction: number; netPayable: number; paid: boolean;
  advanceEntries: AdvanceEntry[]; overtimeEntries: OvertimeEntry[]; payment: SalaryPaymentInfo | null;
};
export type PayrollStats = { activeStaff: number; totalSalaryBill: number; totalAdvances: number; netSalariesPaid: number };
export type PayrollRoster = { rows: PayrollRow[]; stats: PayrollStats };

export async function listPayroll(month: string): Promise<PayrollRoster> {
  const [{ data: users }, { data: salaryPayments }, { data: advances }, { data: overtime }] = await Promise.all([
    supabase.from("User").select("id, name, email, phone, role, active, monthlySalary, overtimeRate, standardWorkingDays, Role(name)").order("active", { ascending: false }).order("name"),
    supabase.from("SalaryPayment").select("*, PaymentChannel(name)").eq("month", month),
    supabase.from("StaffAdvance").select("*, PaymentChannel(name)").eq("month", month).order("date", { ascending: false }),
    supabase.from("StaffOvertime").select("*").eq("month", month).order("createdAt", { ascending: false }),
  ]);

  const payByUser: Record<string, typeof salaryPayments extends (infer T)[] | null ? T : never> = {};
  for (const p of salaryPayments ?? []) (payByUser as Record<string, unknown>)[p.userId] = p;

  const advsByUser: Record<string, typeof advances extends (infer T)[] | null ? T[] : never[]> = {};
  for (const a of advances ?? []) { if (!advsByUser[a.userId]) advsByUser[a.userId] = []; (advsByUser[a.userId] as unknown[]).push(a); }

  const otByUser: Record<string, typeof overtime extends (infer T)[] | null ? T[] : never[]> = {};
  for (const o of overtime ?? []) { if (!otByUser[o.userId]) otByUser[o.userId] = []; (otByUser[o.userId] as unknown[]).push(o); }

  const rows: PayrollRow[] = (users ?? []).map((u) => {
    const roleData = (Array.isArray(u.Role) ? u.Role[0] : u.Role) as { name: string } | null;
    const salary = Number(u.monthlySalary ?? 0);
    const stdDays = u.standardWorkingDays || 26;

    const otEntries: OvertimeEntry[] = ((otByUser[u.id] ?? []) as Record<string, unknown>[]).map((o) => {
      const hours = Number(o.hours); const rate = Number(o.rate);
      return { id: o.id as string, hours, rate, earned: r2(hours * rate), createdAt: o.createdAt as string };
    });
    const overtimeHours = r2(otEntries.reduce((s, o) => s + o.hours, 0));
    const overtimeEarned = r2(otEntries.reduce((s, o) => s + o.earned, 0));

    const advEntries: AdvanceEntry[] = ((advsByUser[u.id] ?? []) as Record<string, unknown>[]).map((a) => {
      const ch = (Array.isArray(a.PaymentChannel) ? (a.PaymentChannel as {name:string}[])[0] : a.PaymentChannel) as { name: string } | null;
      return { id: a.id as string, amount: Number(a.amount), date: a.date as string, channelName: ch?.name ?? null, notes: a.notes as string | null };
    });
    const advances = r2(advEntries.reduce((s, a) => s + a.amount, 0));

    const pay = (payByUser[u.id] ?? null) as Record<string, unknown> | null;
    const payCh = pay ? ((Array.isArray(pay.PaymentChannel) ? (pay.PaymentChannel as {name:string}[])[0] : pay.PaymentChannel) as { name: string } | null) : null;
    const absentDays = pay ? Number(pay.absentDays) : 0;
    const perDay = stdDays > 0 ? salary / stdDays : 0;
    const absenceDeduction = r2(absentDays * perDay);
    const netPayable = pay ? Number(pay.netPaid) : r2(salary + overtimeEarned - advances - absenceDeduction);

    return {
      id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role, roleName: roleData?.name ?? u.role,
      active: u.active, salary, overtimeRate: Number(u.overtimeRate), standardWorkingDays: stdDays,
      overtimeHours, overtimeEarned, advances, absentDays, absenceDeduction, netPayable, paid: Boolean(pay),
      advanceEntries: advEntries, overtimeEntries: otEntries,
      payment: pay ? { paymentDate: pay.paymentDate as string, absentDays, netPaid: Number(pay.netPaid), channelName: payCh?.name ?? null, notes: pay.notes as string | null } : null,
    };
  });

  const active = rows.filter((r) => r.active);
  return {
    rows,
    stats: {
      activeStaff: active.length,
      totalSalaryBill: r2(active.reduce((s, r) => s + r.salary, 0)),
      totalAdvances: r2(rows.reduce((s, r) => s + r.advances, 0)),
      netSalariesPaid: r2(rows.reduce((s, r) => s + (r.paid ? r.netPayable : 0), 0)),
    },
  };
}

export type HistoryPayment = { id: string; month: string; paymentDate: string; absentDays: number; netPaid: number; channelName: string | null; notes: string | null };
export type HistoryAdvance = { id: string; month: string; amount: number; date: string; channelName: string | null; notes: string | null };
export type HistoryOvertime = { id: string; month: string; hours: number; rate: number; earned: number; createdAt: string };
export type WorkerHistory = { name: string; lifetimePaid: number; totalAdvances: number; overtimeHours: number; overtimeEarned: number; payments: HistoryPayment[]; advances: HistoryAdvance[]; overtime: HistoryOvertime[] };

export async function getWorkerHistory(userId: string): Promise<WorkerHistory | null> {
  const [{ data: user }, { data: payments }, { data: advances }, { data: overtime }] = await Promise.all([
    supabase.from("User").select("name").eq("id", userId).single(),
    supabase.from("SalaryPayment").select("*, PaymentChannel(name)").eq("userId", userId).order("paymentDate", { ascending: false }),
    supabase.from("StaffAdvance").select("*, PaymentChannel(name)").eq("userId", userId).order("date", { ascending: false }),
    supabase.from("StaffOvertime").select("*").eq("userId", userId).order("createdAt", { ascending: false }),
  ]);
  if (!user) return null;

  const pRows: HistoryPayment[] = (payments ?? []).map((p) => {
    const ch = (Array.isArray(p.PaymentChannel) ? (p.PaymentChannel as {name:string}[])[0] : p.PaymentChannel) as { name: string } | null;
    return { id: p.id, month: p.month, paymentDate: p.paymentDate, absentDays: Number(p.absentDays), netPaid: Number(p.netPaid), channelName: ch?.name ?? null, notes: p.notes };
  });
  const aRows: HistoryAdvance[] = (advances ?? []).map((a) => {
    const ch = (Array.isArray(a.PaymentChannel) ? (a.PaymentChannel as {name:string}[])[0] : a.PaymentChannel) as { name: string } | null;
    return { id: a.id, month: a.month, amount: Number(a.amount), date: a.date, channelName: ch?.name ?? null, notes: a.notes };
  });
  const oRows: HistoryOvertime[] = (overtime ?? []).map((o) => {
    const hours = Number(o.hours); const rate = Number(o.rate);
    return { id: o.id, month: o.month, hours, rate, earned: r2(hours * rate), createdAt: o.createdAt };
  });

  return {
    name: user.name,
    lifetimePaid: r2(pRows.reduce((s, p) => s + p.netPaid, 0)),
    totalAdvances: r2(aRows.reduce((s, a) => s + a.amount, 0)),
    overtimeHours: r2(oRows.reduce((s, o) => s + o.hours, 0)),
    overtimeEarned: r2(oRows.reduce((s, o) => s + o.earned, 0)),
    payments: pRows, advances: aRows, overtime: oRows,
  };
}

function r2(n: number) { return Math.round(n * 100) / 100; }
