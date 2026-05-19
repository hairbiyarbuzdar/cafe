import "server-only";

import { prisma } from "@/lib/prisma";
import type { Role } from "@/types/auth";

export type ScheduleShift = {
  id: string;
  userId: string;
  userName: string;
  role: Role;
  /** Day-of-week label ("Mon"…"Sun") — same as the UI grid expects. */
  day: string;
  /** Local "HH:mm" string. */
  start: string;
  end: string;
  status: "scheduled" | "confirmed" | "completed" | "missed";
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
function hhmm(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Monday-anchored start of the calendar week containing `date`. */
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - day);
  return d;
}

/**
 * Shifts for the current week, grouped by user. The grid component
 * keys off `day` (Mon/Tue/…) to place cells.
 */
export async function listThisWeekSchedule(): Promise<ScheduleShift[]> {
  const start = startOfWeek(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const rows = await prisma.shift.findMany({
    where: { date: { gte: start, lt: end } },
    include: { user: { select: { name: true, role: true } } },
    orderBy: [{ date: "asc" }, { start: "asc" }],
  });

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.user.name,
    role: r.user.role as Role,
    day: DAYS[new Date(r.date).getDay()] ?? "?",
    start: hhmm(r.start),
    end: hhmm(r.end),
    status: r.status,
  }));
}

export type AttendanceBucket = {
  day: string;
  onTime: number;
  late: number;
  absent: number;
};

/**
 * Attendance bucketed by day for the last 7 days, ending today.
 * Days with no attendance rows show zeros across the board.
 */
export async function attendance7d(): Promise<AttendanceBucket[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 6);

  const rows = await prisma.$queryRaw<
    { day: Date; state: string; count: number }[]
  >`
    SELECT date_trunc('day', date) AS day,
           state::text             AS state,
           COUNT(*)::int           AS count
    FROM "Attendance"
    WHERE date >= ${start}
    GROUP BY 1, 2
    ORDER BY 1
  `;

  const byKey = new Map<string, AttendanceBucket>();
  for (const r of rows) {
    const key = r.day.toISOString().slice(0, 10);
    const bucket = byKey.get(key) ?? {
      day: DAYS[new Date(r.day).getDay()] ?? key,
      onTime: 0,
      late: 0,
      absent: 0,
    };
    if (r.state === "onTime") bucket.onTime = Number(r.count);
    else if (r.state === "late") bucket.late = Number(r.count);
    else if (r.state === "absent") bucket.absent = Number(r.count);
    byKey.set(key, bucket);
  }

  const out: AttendanceBucket[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().slice(0, 10);
    out.push(
      byKey.get(key) ?? {
        day: DAYS[d.getDay()] ?? key,
        onTime: 0,
        late: 0,
        absent: 0,
      },
    );
  }
  return out;
}
