import { SectionCard } from "@/components/shared/section-card";
import { RoleBadge } from "@/features/staff/role-badge";
import type { ScheduleShift } from "@/lib/queries/schedule";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types/auth";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScheduleGrid({
  members,
  shifts,
}: {
  members: SessionUser[];
  shifts: ScheduleShift[];
}) {
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
    <SectionCard
      title="This week's schedule"
      description={
        shifts.length > 0
          ? `${shifts.length} shifts published`
          : "Nothing scheduled yet"
      }
      contentClassName="p-0"
    >
      <div className="overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-[180px_repeat(7,minmax(0,1fr))] border-t">
          <div className="border-e bg-surface-1 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
            Team member
          </div>
          {DAYS.map((d) => (
            <div
              key={d}
              className="border-e bg-surface-1 px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground last:border-e-0"
            >
              {d}
            </div>
          ))}
          {members.map((member, rowIdx) => (
            <ScheduleRow
              key={member.id}
              member={member}
              shifts={byUser.get(member.id) ?? []}
              isLast={rowIdx === members.length - 1}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function ScheduleRow({
  member,
  shifts,
  isLast,
}: {
  member: SessionUser;
  shifts: ScheduleShift[];
  isLast: boolean;
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
      {DAYS.map((d) => {
        const shift = shifts.find((s) => s.day === d);
        return (
          <div
            key={d}
            className={cn(
              "border-e px-2 py-2 last:border-e-0",
              !isLast && "border-b",
            )}
          >
            {shift ? (
              <div
                className={cn(
                  "rounded-md border px-2 py-1.5 text-[11px] transition-colors",
                  shift.status === "completed"
                    ? "border-success/20 bg-success/10 text-success"
                    : shift.status === "confirmed"
                      ? "border-primary/25 bg-primary/10 text-primary"
                      : shift.status === "missed"
                        ? "border-destructive/25 bg-destructive/10 text-destructive"
                        : "border-info/20 bg-info/10 text-info",
                )}
              >
                <div className="font-medium tabular-nums">
                  {shift.start} – {shift.end}
                </div>
                <div className="text-[10px] capitalize opacity-80">
                  {shift.status}
                </div>
              </div>
            ) : (
              <div className="h-9 rounded-md border border-dashed bg-muted/20" />
            )}
          </div>
        );
      })}
    </>
  );
}
