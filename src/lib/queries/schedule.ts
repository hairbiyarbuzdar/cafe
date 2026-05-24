import "server-only";

import { supabase } from "@/lib/supabase";
import type { Role } from "@/types/auth";

export type ScheduleShift = {
  id: string; userId: string; userName: string; role: Role;
  date: string; day: string; start: string; end: string;
  status: "scheduled" | "confirmed" | "completed" | "missed"; notes?: string | null;
};

export type AttendanceBucket = { day: string; onTime: number; late: number; absent: number };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function hhmm(iso: string) {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function startOfWeek(date: Date): Date {
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

export async function listThisWeekSchedule(): Promise<ScheduleShift[]> {
  const start = startOfWeek(new Date());
  const end = new Date(start); end.setDate(end.getDate() + 7);

  const { data, error } = await supabase
    .from("Shift")
    .select("*, User(name, role)")
    .gte("date", start.toISOString().slice(0, 10))
    .lt("date", end.toISOString().slice(0, 10))
    .order("date").order("start");
  if (error) throw new Error(error.message);

  return (data ?? []).map((r) => {
    const user = (Array.isArray(r.User) ? r.User[0] : r.User) as { name: string; role: string } | null;
    const dayDate = new Date(r.date);
    return {
      id: r.id, userId: r.userId,
      userName: user?.name ?? "", role: (user?.role ?? "") as Role,
      date: r.date, day: DAYS[dayDate.getDay()] ?? "?",
      start: hhmm(r.start), end: hhmm(r.end),
      status: r.status as ScheduleShift["status"], notes: r.notes,
    };
  });
}

export async function attendance7d(): Promise<AttendanceBucket[]> {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(today); start.setDate(start.getDate() - 6);

  // Supabase doesn't have an Attendance table in the schema — return zeros
  // until attendance tracking is implemented via Supabase.
  const out: AttendanceBucket[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    out.push({ day: DAYS[d.getDay()] ?? d.toISOString().slice(0, 10), onTime: 0, late: 0, absent: 0 });
  }
  return out;
}
