"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/features/staff/role-badge";
import { ShiftDialog } from "@/features/staff/shift-dialog";
import type { ScheduleShift } from "@/lib/queries/schedule";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types/auth";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Monday-anchored start of the current calendar week. Must match
 * the server's `listThisWeekSchedule` so column→date stays aligned. */
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // 0 = Monday
  d.setDate(d.getDate() - day);
  return d;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function ScheduleGrid({
  members,
  shifts,
}: {
  members: SessionUser[];
  shifts: ScheduleShift[];
}) {
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ScheduleShift | null>(null);
  const [defaultUserId, setDefaultUserId] = React.useState<string | undefined>(
    undefined,
  );
  const [defaultDate, setDefaultDate] = React.useState<string | undefined>(
    undefined,
  );

  const weekStart = React.useMemo(() => startOfWeek(new Date()), []);
  const dayDates = React.useMemo(() => {
    return DAYS.map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  function openCreate(userId: string, date: string) {
    setEditing(null);
    setDefaultUserId(userId);
    setDefaultDate(date);
    setOpen(true);
  }
  function openEdit(shift: ScheduleShift) {
    setEditing(shift);
    setDefaultUserId(undefined);
    setDefaultDate(undefined);
    setOpen(true);
  }
  function openBlank() {
    setEditing(null);
    setDefaultUserId(members[0]?.id);
    setDefaultDate(isoDay(weekStart));
    setOpen(true);
  }

  if (members.length === 0) {
    return (
      <SectionCard
        title="This week's schedule"
        description="Add team members from above to start scheduling"
        contentClassName="p-0"
      >
        <div className="px-4 py-10 text-center text-[12.5px] text-muted-foreground">
          No team members yet.
        </div>
      </SectionCard>
    );
  }

  const byUser = new Map<string, ScheduleShift[]>();
  for (const s of shifts) {
    const list = byUser.get(s.userId) ?? [];
    list.push(s);
    byUser.set(s.userId, list);
  }

  return (
    <>
      <SectionCard
        title="This week's schedule"
        description={
          shifts.length > 0
            ? `${shifts.length} shifts published`
            : "Nothing scheduled yet"
        }
        action={
          <Button
            size="xs"
            variant="outline"
            className="h-8 rounded-md text-[12px]"
            onClick={openBlank}
          >
            <Plus className="size-3.5" />
            Add shift
          </Button>
        }
        contentClassName="p-0"
      >
        <div className="overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-[180px_repeat(7,minmax(0,1fr))] border-t">
            <div className="border-e bg-surface-1 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
              Team member
            </div>
            {DAYS.map((d, i) => (
              <div
                key={d}
                className="border-e bg-surface-1 px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground last:border-e-0"
              >
                {d}
                <span className="ms-1 text-[10px] font-normal text-muted-foreground/70">
                  {dayDates[i]!.getDate()}
                </span>
              </div>
            ))}
            {members.map((member, rowIdx) => (
              <ScheduleRow
                key={member.id}
                member={member}
                shifts={byUser.get(member.id) ?? []}
                dayDates={dayDates}
                isLast={rowIdx === members.length - 1}
                onCreate={openCreate}
                onEdit={openEdit}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      <ShiftDialog
        open={open}
        onOpenChange={setOpen}
        members={members}
        shift={editing}
        defaultUserId={defaultUserId}
        defaultDate={defaultDate}
      />
    </>
  );
}

function ScheduleRow({
  member,
  shifts,
  dayDates,
  isLast,
  onCreate,
  onEdit,
}: {
  member: SessionUser;
  shifts: ScheduleShift[];
  dayDates: Date[];
  isLast: boolean;
  onCreate: (userId: string, date: string) => void;
  onEdit: (shift: ScheduleShift) => void;
}) {
  return (
    <>
      <div
        className={cn(
          "flex items-center gap-2 border-e px-4 py-2.5",
          !isLast && "border-b",
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-medium text-foreground">
            {member.name}
          </p>
          <div className="mt-0.5">
            <RoleBadge role={member.role} />
          </div>
        </div>
      </div>
      {DAYS.map((d, i) => {
        const shift = shifts.find((s) => s.day === d);
        const date = isoDay(dayDates[i]!);
        return (
          <div
            key={d}
            className={cn(
              "border-e px-2 py-2 last:border-e-0",
              !isLast && "border-b",
            )}
          >
            {shift ? (
              <button
                type="button"
                onClick={() => onEdit(shift)}
                className={cn(
                  "block w-full rounded-md border px-2 py-1.5 text-left text-[11px] transition-colors",
                  shift.status === "completed"
                    ? "border-success/20 bg-success/10 text-success hover:bg-success/15"
                    : shift.status === "confirmed"
                      ? "border-primary/25 bg-primary/10 text-primary hover:bg-primary/15"
                      : shift.status === "missed"
                        ? "border-destructive/25 bg-destructive/10 text-destructive hover:bg-destructive/15"
                        : "border-info/20 bg-info/10 text-info hover:bg-info/15",
                )}
              >
                <div className="font-medium tabular-nums">
                  {shift.start} – {shift.end}
                </div>
                <div className="text-[10px] capitalize opacity-80">
                  {shift.status}
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onCreate(member.id, date)}
                aria-label={`Add shift for ${member.name} on ${d}`}
                className="flex h-9 w-full items-center justify-center rounded-md border border-dashed bg-muted/20 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="size-3.5 opacity-60" />
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}
