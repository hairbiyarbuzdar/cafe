"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { logActivity } from "@/lib/activity";
import { supabase } from "@/lib/supabase";
import { getWorkerHistory, type WorkerHistory } from "@/lib/queries/payroll";

export async function getWorkerHistoryAction(userId: string): Promise<WorkerHistory | null> {
  if (!userId) return null;
  return getWorkerHistory(userId);
}

export type PayrollActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

function round2(n: number): number { return Math.round(n * 100) / 100; }

async function isValidRoleSlug(slug: string): Promise<boolean> {
  if (!slug) return false;
  const { data } = await supabase.from("Role").select("id").eq("id", slug).maybeSingle();
  return !!data;
}

export type WorkerInput = {
  name: string; email: string; phone?: string | null; role: string;
  monthlySalary: number; overtimeRate?: number | null; standardWorkingDays?: number;
  active?: boolean; password?: string | null;
};

function validateWorker(input: WorkerInput): string | null {
  const name = input.name?.trim();
  if (!name || name.length < 2) return "Name is required";
  const email = input.email?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
  const phone = input.phone?.trim();
  if (phone && !PHONE_RE.test(phone)) return "Enter a valid phone number";
  if (!Number.isFinite(input.monthlySalary) || input.monthlySalary < 0) return "Monthly salary must be a positive number";
  if (input.overtimeRate != null && (!Number.isFinite(input.overtimeRate) || input.overtimeRate < 0)) return "Overtime rate must be a positive number";
  if (input.standardWorkingDays != null && (!Number.isInteger(input.standardWorkingDays) || input.standardWorkingDays < 1 || input.standardWorkingDays > 31)) return "Working days must be between 1 and 31";
  if (input.password && input.password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export async function registerWorkerAction(
  input: WorkerInput,
): Promise<PayrollActionResult<{ id: string }>> {
  const err = validateWorker(input);
  if (err) return { ok: false, error: err };
  if (!(await isValidRoleSlug(input.role))) return { ok: false, error: "Pick a valid role" };

  const email = input.email.trim().toLowerCase();
  const { data: clash } = await supabase.from("User").select("id").eq("email", email).maybeSingle();
  if (clash) return { ok: false, error: `${email} is already on the team` };

  try {
    const password = input.password?.trim() || crypto.randomUUID();
    const { data: created, error } = await supabase.from("User").insert({
      name: input.name.trim(), email, phone: input.phone?.trim() || null, role: input.role,
      passwordHash: await bcrypt.hash(password, 10), monthlySalary: round2(input.monthlySalary),
      overtimeRate: input.overtimeRate != null ? round2(input.overtimeRate) : null,
      standardWorkingDays: input.standardWorkingDays ?? 26, active: input.active ?? true,
    }).select("id").single();
    if (error) throw error;
    revalidatePath("/staff");
    await logActivity({ type: "staff", title: `${input.name.trim()} registered`, description: `${input.role} · Rs. ${round2(input.monthlySalary).toLocaleString()}/mo` });
    return { ok: true, data: { id: created.id } };
  } catch (e) {
    console.error("registerWorkerAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to register worker" };
  }
}

export async function updateWorkerAction(id: string, input: WorkerInput): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing worker id" };
  const err = validateWorker(input);
  if (err) return { ok: false, error: err };
  if (!(await isValidRoleSlug(input.role))) return { ok: false, error: "Pick a valid role" };

  const email = input.email.trim().toLowerCase();
  const { data: clash } = await supabase.from("User").select("id").eq("email", email).maybeSingle();
  if (clash && clash.id !== id) return { ok: false, error: `${email} is already taken` };

  try {
    const { error } = await supabase.from("User").update({
      name: input.name.trim(), email, phone: input.phone?.trim() || null, role: input.role,
      monthlySalary: round2(input.monthlySalary),
      overtimeRate: input.overtimeRate != null ? round2(input.overtimeRate) : null,
      standardWorkingDays: input.standardWorkingDays ?? 26,
      ...(input.active != null ? { active: input.active } : {}),
      ...(input.password?.trim() ? { passwordHash: await bcrypt.hash(input.password.trim(), 10) } : {}),
    }).eq("id", id);
    if (error) throw error;
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("updateWorkerAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to update worker" };
  }
}

export async function setWorkerActiveAction(id: string, active: boolean): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing worker id" };
  const { data: target } = await supabase.from("User").select("id, role, active").eq("id", id).maybeSingle();
  if (!target) return { ok: false, error: "Worker not found" };

  if (!active && target.role === "admin") {
    const { count } = await supabase.from("User").select("*", { count: "exact", head: true }).eq("role", "admin").eq("active", true).neq("id", id);
    if ((count ?? 0) === 0) return { ok: false, error: "Can't deactivate the last active admin" };
  }

  try {
    const { error } = await supabase.from("User").update({ active }).eq("id", id);
    if (error) throw error;
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("setWorkerActiveAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to update status" };
  }
}

export type RecordAdvanceInput = {
  userId: string; month: string; amount: number; date: string; paymentChannelId: string; notes?: string | null;
};

export async function recordStaffAdvanceAction(input: RecordAdvanceInput): Promise<PayrollActionResult> {
  if (!input.userId) return { ok: false, error: "Missing worker" };
  if (!MONTH_RE.test(input.month)) return { ok: false, error: "Invalid month" };
  if (!Number.isFinite(input.amount) || input.amount <= 0) return { ok: false, error: "Enter an advance amount" };
  if (!input.paymentChannelId) return { ok: false, error: "Pick a payment method" };

  const amount = round2(input.amount);
  const date = new Date(input.date);
  if (Number.isNaN(date.getTime())) return { ok: false, error: "Invalid date" };

  const { data: worker } = await supabase.from("User").select("id, name, monthlySalary").eq("id", input.userId).maybeSingle();
  if (!worker) return { ok: false, error: "Worker not found" };

  const { data: existing } = await supabase.from("StaffAdvance").select("amount").eq("userId", input.userId).eq("month", input.month);
  const salary = Number(worker.monthlySalary);
  const already = round2((existing ?? []).reduce((s, a) => s + Number(a.amount), 0));
  if (salary > 0 && already + amount > salary) {
    return { ok: false, error: `Exceeds salary — Rs. ${round2(salary - already).toLocaleString()} remaining this month` };
  }

  const { data: channel } = await supabase.from("PaymentChannel").select("id, name, archived, currentBalance").eq("id", input.paymentChannelId).maybeSingle();
  if (!channel || channel.archived) return { ok: false, error: "Selected payment method isn't active" };
  if (Number(channel.currentBalance) < amount) {
    return { ok: false, error: `Insufficient balance in ${channel.name}. Need Rs. ${amount.toLocaleString()}, available Rs. ${Number(channel.currentBalance).toLocaleString()}.` };
  }

  try {
    await supabase.from("StaffAdvance").insert({ userId: input.userId, month: input.month, amount, date: date.toISOString().slice(0, 10), paymentChannelId: channel.id, notes: input.notes?.trim() || null });
    await supabase.from("PaymentChannel").update({ currentBalance: Number(channel.currentBalance) - amount }).eq("id", channel.id);
    revalidatePath("/staff");
    revalidatePath("/settings");
    await logActivity({ type: "staff", title: `Advance to ${worker.name}`, description: `Rs. ${amount.toLocaleString()} · ${channel.name}` });
    return { ok: true };
  } catch (e) {
    console.error("recordStaffAdvanceAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to record advance" };
  }
}

export async function deleteStaffAdvanceAction(id: string): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing advance id" };
  const { data: advance } = await supabase.from("StaffAdvance").select("id, amount, paymentChannelId").eq("id", id).maybeSingle();
  if (!advance) return { ok: false, error: "Advance not found" };
  try {
    await supabase.from("StaffAdvance").delete().eq("id", id);
    if (advance.paymentChannelId) {
      const { data: ch } = await supabase.from("PaymentChannel").select("currentBalance").eq("id", advance.paymentChannelId).single();
      await supabase.from("PaymentChannel").update({ currentBalance: Number(ch?.currentBalance ?? 0) + Number(advance.amount) }).eq("id", advance.paymentChannelId);
    }
    revalidatePath("/staff");
    revalidatePath("/settings");
    return { ok: true };
  } catch (e) {
    console.error("deleteStaffAdvanceAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to remove advance" };
  }
}

export type AddOvertimeInput = { userId: string; month: string; hours: number; rate: number };

export async function addStaffOvertimeAction(input: AddOvertimeInput): Promise<PayrollActionResult> {
  if (!input.userId) return { ok: false, error: "Missing worker" };
  if (!MONTH_RE.test(input.month)) return { ok: false, error: "Invalid month" };
  if (!Number.isFinite(input.hours) || input.hours <= 0) return { ok: false, error: "Enter the hours worked" };
  if (!Number.isFinite(input.rate) || input.rate < 0) return { ok: false, error: "Enter a valid rate" };
  const { data: worker } = await supabase.from("User").select("id, name").eq("id", input.userId).maybeSingle();
  if (!worker) return { ok: false, error: "Worker not found" };
  try {
    const { error } = await supabase.from("StaffOvertime").insert({ userId: input.userId, month: input.month, hours: round2(input.hours), rate: round2(input.rate) });
    if (error) throw error;
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("addStaffOvertimeAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to add overtime" };
  }
}

export async function deleteStaffOvertimeAction(id: string): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing overtime id" };
  try {
    const { error } = await supabase.from("StaffOvertime").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("deleteStaffOvertimeAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to remove overtime" };
  }
}

export type PaySalaryInput = {
  userId: string; month: string; paymentDate: string; absentDays: number; paymentChannelId: string; notes?: string | null;
};
export type PaySalaryResult = { ok: true; net: number } | { ok: false; error: string };

export async function paySalaryAction(input: PaySalaryInput): Promise<PaySalaryResult> {
  if (!input.userId) return { ok: false, error: "Missing worker" };
  if (!MONTH_RE.test(input.month)) return { ok: false, error: "Invalid month" };
  if (!input.paymentChannelId) return { ok: false, error: "Pick a payment method" };
  const absentDays = Number.isFinite(input.absentDays) && input.absentDays > 0 ? round2(input.absentDays) : 0;
  const paymentDate = new Date(input.paymentDate);
  if (Number.isNaN(paymentDate.getTime())) return { ok: false, error: "Invalid payment date" };

  const { data: worker } = await supabase.from("User").select("id, name, monthlySalary, standardWorkingDays").eq("id", input.userId).maybeSingle();
  if (!worker) return { ok: false, error: "Worker not found" };

  const { data: existing } = await supabase.from("SalaryPayment").select("id").eq("userId", input.userId).eq("month", input.month).maybeSingle();
  if (existing) return { ok: false, error: "Salary for this month is already paid" };

  const salary = Number(worker.monthlySalary);
  const stdDays = worker.standardWorkingDays || 26;

  const [{ data: otData }, { data: advData }] = await Promise.all([
    supabase.from("StaffOvertime").select("hours, rate").eq("userId", input.userId).eq("month", input.month),
    supabase.from("StaffAdvance").select("amount").eq("userId", input.userId).eq("month", input.month),
  ]);
  const overtimeEarned = round2((otData ?? []).reduce((s, o) => s + Number(o.hours) * Number(o.rate), 0));
  const advances = round2((advData ?? []).reduce((s, a) => s + Number(a.amount), 0));
  const absenceDeduction = round2(absentDays * (stdDays > 0 ? salary / stdDays : 0));
  const net = round2(salary + overtimeEarned - absenceDeduction - advances);

  if (net <= 0) return { ok: false, error: "Nothing left to pay after advances and deductions" };

  const { data: channel } = await supabase.from("PaymentChannel").select("id, name, archived, currentBalance").eq("id", input.paymentChannelId).maybeSingle();
  if (!channel || channel.archived) return { ok: false, error: "Selected payment method isn't active" };
  if (Number(channel.currentBalance) < net) {
    return { ok: false, error: `Insufficient balance in ${channel.name}. Need Rs. ${net.toLocaleString()}, available Rs. ${Number(channel.currentBalance).toLocaleString()}.` };
  }

  try {
    await supabase.from("SalaryPayment").insert({ userId: input.userId, month: input.month, paymentDate: paymentDate.toISOString().slice(0, 10), absentDays, netPaid: net, paymentChannelId: channel.id, notes: input.notes?.trim() || null });
    await supabase.from("PaymentChannel").update({ currentBalance: Number(channel.currentBalance) - net }).eq("id", channel.id);
    revalidatePath("/staff");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    await logActivity({ type: "staff", title: `Salary paid · ${worker.name}`, description: `Rs. ${net.toLocaleString()} · ${channel.name} · ${input.month}` });
    return { ok: true, net };
  } catch (e) {
    console.error("paySalaryAction failed", e);
    return { ok: false, error: e instanceof Error ? e.message : "Failed to pay salary" };
  }
}
