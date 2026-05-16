import { SectionCard } from "@/components/shared/section-card";
import { RoleBadge } from "@/features/staff/role-badge";
import { SHIFTS, STAFF } from "@/mock/staff";
import { cn } from "@/lib/utils";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScheduleGrid() {
  return (
    <SectionCard
      title="This week's schedule"
      description="Drag-and-drop scheduler · published Mon 06:00"
      contentClassName="p-0"
    >
      <div className="overflow-x-auto">
        <div className="min-w-[760px] grid grid-cols-[180px_repeat(7,minmax(0,1fr))] border-t">
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
          {STAFF.map((staff, rowIdx) => (
            <ScheduleRow
              key={staff.id}
              staff={staff}
              isLast={rowIdx === STAFF.length - 1}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function ScheduleRow({
  staff,
  isLast,
}: {
  staff: (typeof STAFF)[number];
  isLast: boolean;
}) {
  const rowShifts = SHIFTS.filter((sh) => sh.staffId === staff.id);
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
            {staff.name}
          </p>
          <div className="mt-0.5">
            <RoleBadge role={staff.role} />
          </div>
        </div>
      </div>
      {DAYS.map((d) => {
        const shift = rowShifts.find((s) => s.date === d);
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
