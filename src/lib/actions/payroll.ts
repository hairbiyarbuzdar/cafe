"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

import { logActivity } from "@/lib/activity";
import { prisma } from "@/lib/prisma";
import { getWorkerHistory, type WorkerHistory } from "@/lib/queries/payroll";

/** Fetch a worker's lifetime payroll history (for the History modal). */
export async function getWorkerHistoryAction(
  userId: string,
): Promise<WorkerHistory | null> {
  if (!userId) return null;
  return getWorkerHistory(userId);
}

export type PayrollActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

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

async function isValidRoleSlug(slug: string): Promise<boolean> {
  if (!slug) return false;
  const found = await prisma.role.findUnique({
    where: { id: slug },
    select: { id: true },
  });
  return !!found;
}

// ──────────────────────────────────────────────────────────────
// Worker profile (a User, reused as a payroll worker)
// ──────────────────────────────────────────────────────────────

export type WorkerInput = {
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  monthlySalary: number;
  overtimeRate?: number | null;
  standardWorkingDays?: number;
  active?: boolean;
  /** Optional login password. Blank → a random one (worker can't sign
   * in until an admin sets one). On edit, blank leaves it unchanged. */
  password?: string | null;
};

function validateWorker(input: WorkerInput): string | null {
  const name = input.name?.trim();
  if (!name || name.length < 2) return "Name is required";
  const email = input.email?.trim().toLowerCase();
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email";
  const phone = input.phone?.trim();
  if (phone && !PHONE_RE.test(phone)) return "Enter a valid phone number";
  if (!Number.isFinite(input.monthlySalary) || input.monthlySalary < 0) {
    return "Monthly salary must be a positive number";
  }
  if (
    input.overtimeRate != null &&
    (!Number.isFinite(input.overtimeRate) || input.overtimeRate < 0)
  ) {
    return "Overtime rate must be a positive number";
  }
  if (
    input.standardWorkingDays != null &&
    (!Number.isInteger(input.standardWorkingDays) ||
      input.standardWorkingDays < 1 ||
      input.standardWorkingDays > 31)
  ) {
    return "Working days must be between 1 and 31";
  }
  if (input.password && input.password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return null;
}

export async function registerWorkerAction(
  input: WorkerInput,
): Promise<PayrollActionResult<{ id: string }>> {
  const err = validateWorker(input);
  if (err) return { ok: false, error: err };
  if (!(await isValidRoleSlug(input.role))) {
    return { ok: false, error: "Pick a valid role" };
  }

  const email = input.email.trim().toLowerCase();
  const clash = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (clash) return { ok: false, error: `${email} is already on the team` };

  try {
    // No password → a random one so the row is valid but login is
    // effectively disabled until an admin sets a real one.
    const password = input.password?.trim() || crypto.randomUUID();
    const created = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        phone: input.phone?.trim() || null,
        role: input.role,
        passwordHash: await bcrypt.hash(password, 10),
        monthlySalary: round2(input.monthlySalary),
        overtimeRate:
          input.overtimeRate != null ? round2(input.overtimeRate) : null,
        standardWorkingDays: input.standardWorkingDays ?? 26,
        active: input.active ?? true,
      },
      select: { id: true },
    });
    revalidatePath("/staff");
    await logActivity({
      type: "staff",
      title: `${input.name.trim()} registered`,
      description: `${input.role} · Rs. ${round2(input.monthlySalary).toLocaleString()}/mo`,
    });
    return { ok: true, data: { id: created.id } };
  } catch (e) {
    console.error("registerWorkerAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to register worker",
    };
  }
}

export async function updateWorkerAction(
  id: string,
  input: WorkerInput,
): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing worker id" };
  const err = validateWorker(input);
  if (err) return { ok: false, error: err };
  if (!(await isValidRoleSlug(input.role))) {
    return { ok: false, error: "Pick a valid role" };
  }

  const email = input.email.trim().toLowerCase();
  const clash = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (clash && clash.id !== id) {
    return { ok: false, error: `${email} is already taken` };
  }

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: input.name.trim(),
        email,
        phone: input.phone?.trim() || null,
        role: input.role,
        monthlySalary: round2(input.monthlySalary),
        overtimeRate:
          input.overtimeRate != null ? round2(input.overtimeRate) : null,
        standardWorkingDays: input.standardWorkingDays ?? 26,
        ...(input.active != null ? { active: input.active } : {}),
        ...(input.password?.trim()
          ? { passwordHash: await bcrypt.hash(input.password.trim(), 10) }
          : {}),
      },
    });
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("updateWorkerAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to update worker",
    };
  }
}

export async function setWorkerActiveAction(
  id: string,
  active: boolean,
): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing worker id" };
  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, active: true },
  });
  if (!target) return { ok: false, error: "Worker not found" };

  // Don't strand the workspace: block deactivating the last active admin.
  if (!active && target.role === "admin") {
    const otherAdmins = await prisma.user.count({
      where: { role: "admin", active: true, id: { not: id } },
    });
    if (otherAdmins === 0) {
      return { ok: false, error: "Can't deactivate the last active admin" };
    }
  }

  try {
    await prisma.user.update({ where: { id }, data: { active } });
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("setWorkerActiveAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to update status",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Cash advances
// ──────────────────────────────────────────────────────────────

export type RecordAdvanceInput = {
  userId: string;
  month: string;
  amount: number;
  date: string;
  paymentChannelId: string;
  notes?: string | null;
};

export async function recordStaffAdvanceAction(
  input: RecordAdvanceInput,
): Promise<PayrollActionResult> {
  if (!input.userId) return { ok: false, error: "Missing worker" };
  if (!MONTH_RE.test(input.month)) return { ok: false, error: "Invalid month" };
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    return { ok: false, error: "Enter an advance amount" };
  }
  if (!input.paymentChannelId) {
    return { ok: false, error: "Pick a payment method" };
  }
  const amount = round2(input.amount);
  const date = new Date(input.date);
  if (Number.isNaN(date.getTime())) return { ok: false, error: "Invalid date" };

  const worker = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true, name: true, monthlySalary: true },
  });
  if (!worker) return { ok: false, error: "Worker not found" };

  // Advances can't exceed the monthly salary.
  const taken = await prisma.staffAdvance.aggregate({
    where: { userId: input.userId, month: input.month },
    _sum: { amount: true },
  });
  const salary = toNumber(worker.monthlySalary);
  const already = toNumber(taken._sum.amount);
  if (salary > 0 && already + amount > salary) {
    return {
      ok: false,
      error: `Exceeds salary — Rs. ${round2(salary - already).toLocaleString()} remaining this month`,
    };
  }

  const channel = await prisma.paymentChannel.findUnique({
    where: { id: input.paymentChannelId },
    select: { id: true, name: true, archived: true, currentBalance: true },
  });
  if (!channel || channel.archived) {
    return { ok: false, error: "Selected payment method isn't active" };
  }
  if (toNumber(channel.currentBalance) < amount) {
    return {
      ok: false,
      error: `Insufficient balance in ${channel.name}. Need Rs. ${amount.toLocaleString()}, available Rs. ${toNumber(channel.currentBalance).toLocaleString()}.`,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.staffAdvance.create({
        data: {
          userId: input.userId,
          month: input.month,
          amount,
          date,
          paymentChannelId: channel.id,
          notes: input.notes?.trim() || null,
        },
      });
      await tx.paymentChannel.update({
        where: { id: channel.id },
        data: { currentBalance: { decrement: amount } },
      });
    });
    revalidatePath("/staff");
    revalidatePath("/settings");
    await logActivity({
      type: "staff",
      title: `Advance to ${worker.name}`,
      description: `Rs. ${amount.toLocaleString()} · ${channel.name}`,
    });
    return { ok: true };
  } catch (e) {
    console.error("recordStaffAdvanceAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to record advance",
    };
  }
}

export async function deleteStaffAdvanceAction(
  id: string,
): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing advance id" };
  const advance = await prisma.staffAdvance.findUnique({
    where: { id },
    select: { id: true, amount: true, paymentChannelId: true },
  });
  if (!advance) return { ok: false, error: "Advance not found" };
  try {
    await prisma.$transaction(async (tx) => {
      await tx.staffAdvance.delete({ where: { id } });
      // Refund the channel it came out of.
      if (advance.paymentChannelId) {
        await tx.paymentChannel.update({
          where: { id: advance.paymentChannelId },
          data: { currentBalance: { increment: toNumber(advance.amount) } },
        });
      }
    });
    revalidatePath("/staff");
    revalidatePath("/settings");
    return { ok: true };
  } catch (e) {
    console.error("deleteStaffAdvanceAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to remove advance",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Overtime / extra hours
// ──────────────────────────────────────────────────────────────

export type AddOvertimeInput = {
  userId: string;
  month: string;
  hours: number;
  rate: number;
};

export async function addStaffOvertimeAction(
  input: AddOvertimeInput,
): Promise<PayrollActionResult> {
  if (!input.userId) return { ok: false, error: "Missing worker" };
  if (!MONTH_RE.test(input.month)) return { ok: false, error: "Invalid month" };
  if (!Number.isFinite(input.hours) || input.hours <= 0) {
    return { ok: false, error: "Enter the hours worked" };
  }
  if (!Number.isFinite(input.rate) || input.rate < 0) {
    return { ok: false, error: "Enter a valid rate" };
  }
  const worker = await prisma.user.findUnique({
    where: { id: input.userId },
    select: { id: true, name: true },
  });
  if (!worker) return { ok: false, error: "Worker not found" };

  try {
    await prisma.staffOvertime.create({
      data: {
        userId: input.userId,
        month: input.month,
        hours: round2(input.hours),
        rate: round2(input.rate),
      },
    });
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("addStaffOvertimeAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to add overtime",
    };
  }
}

export async function deleteStaffOvertimeAction(
  id: string,
): Promise<PayrollActionResult> {
  if (!id) return { ok: false, error: "Missing overtime id" };
  try {
    await prisma.staffOvertime.delete({ where: { id } });
    revalidatePath("/staff");
    return { ok: true };
  } catch (e) {
    console.error("deleteStaffOvertimeAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to remove overtime",
    };
  }
}

// ──────────────────────────────────────────────────────────────
// Finalize salary payment
// ──────────────────────────────────────────────────────────────

export type PaySalaryInput = {
  userId: string;
  month: string;
  paymentDate: string;
  absentDays: number;
  paymentChannelId: string;
  notes?: string | null;
};

export type PaySalaryResult =
  | { ok: true; net: number }
  | { ok: false; error: string };

/**
 * Finalize a worker's salary for a month: net = salary + overtime −
 * absence − advances. Debits the chosen payment method by the net and
 * records a `SalaryPayment` (which marks the month PAID). Advances were
 * already debited when recorded, so only the net is debited here.
 */
export async function paySalaryAction(
  input: PaySalaryInput,
): Promise<PaySalaryResult> {
  if (!input.userId) return { ok: false, error: "Missing worker" };
  if (!MONTH_RE.test(input.month)) return { ok: false, error: "Invalid month" };
  if (!input.paymentChannelId) {
    return { ok: false, error: "Pick a payment method" };
  }
  const absentDays =
    Number.isFinite(input.absentDays) && input.absentDays > 0
      ? round2(input.absentDays)
      : 0;
  const paymentDate = new Date(input.paymentDate);
  if (Number.isNaN(paymentDate.getTime())) {
    return { ok: false, error: "Invalid payment date" };
  }

  const worker = await prisma.user.findUnique({
    where: { id: input.userId },
    select: {
      id: true,
      name: true,
      monthlySalary: true,
      standardWorkingDays: true,
    },
  });
  if (!worker) return { ok: false, error: "Worker not found" };

  const existing = await prisma.salaryPayment.findUnique({
    where: { userId_month: { userId: input.userId, month: input.month } },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "Salary for this month is already paid" };
  }

  const salary = toNumber(worker.monthlySalary);
  const stdDays = worker.standardWorkingDays || 26;

  const [otAgg, advAgg] = await Promise.all([
    prisma.staffOvertime.findMany({
      where: { userId: input.userId, month: input.month },
      select: { hours: true, rate: true },
    }),
    prisma.staffAdvance.aggregate({
      where: { userId: input.userId, month: input.month },
      _sum: { amount: true },
    }),
  ]);
  const overtimeEarned = round2(
    otAgg.reduce((s, o) => s + toNumber(o.hours) * toNumber(o.rate), 0),
  );
  const advances = toNumber(advAgg._sum.amount);
  const absenceDeduction = round2(
    absentDays * (stdDays > 0 ? salary / stdDays : 0),
  );
  const net = round2(salary + overtimeEarned - absenceDeduction - advances);

  if (net <= 0) {
    return {
      ok: false,
      error: "Nothing left to pay after advances and deductions",
    };
  }

  const channel = await prisma.paymentChannel.findUnique({
    where: { id: input.paymentChannelId },
    select: { id: true, name: true, archived: true, currentBalance: true },
  });
  if (!channel || channel.archived) {
    return { ok: false, error: "Selected payment method isn't active" };
  }
  if (toNumber(channel.currentBalance) < net) {
    return {
      ok: false,
      error: `Insufficient balance in ${channel.name}. Need Rs. ${net.toLocaleString()}, available Rs. ${toNumber(channel.currentBalance).toLocaleString()}.`,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.salaryPayment.create({
        data: {
          userId: input.userId,
          month: input.month,
          paymentDate,
          absentDays,
          netPaid: net,
          paymentChannelId: channel.id,
          notes: input.notes?.trim() || null,
        },
      });
      await tx.paymentChannel.update({
        where: { id: channel.id },
        data: { currentBalance: { decrement: net } },
      });
    });
    revalidatePath("/staff");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    await logActivity({
      type: "staff",
      title: `Salary paid · ${worker.name}`,
      description: `Rs. ${net.toLocaleString()} · ${channel.name} · ${input.month}`,
    });
    return { ok: true, net };
  } catch (e) {
    console.error("paySalaryAction failed", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Failed to pay salary",
    };
  }
}
