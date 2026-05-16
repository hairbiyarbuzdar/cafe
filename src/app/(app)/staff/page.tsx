import { Plus, UserPlus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { AttendanceChart } from "@/features/staff/attendance-chart";
import { ScheduleGrid } from "@/features/staff/schedule-grid";
import { StaffCards } from "@/features/staff/staff-cards";
import { STAFF } from "@/mock/staff";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Staff" };

export default function StaffPage() {
  const active = STAFF.filter((s) => s.status === "active").length;
  const hours = STAFF.reduce((sum, s) => sum + s.hoursThisWeek, 0);
  const payroll = STAFF.reduce((sum, s) => sum + s.hoursThisWeek * s.hourlyRate, 0);

  return (
    <>
      <PageHeader
        title="Staff"
        description="Manage your team, build schedules, and track attendance."
        actions={
          <>
            <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
              <UserPlus className="size-3.5" />
              Invite
            </Button>
            <Button size="sm" className="h-8 rounded-md text-[12.5px]">
              <Plus className="size-3.5" />
              Add member
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Active team" value={`${active}`} hint={`${STAFF.length} total members`} />
        <Stat label="Hours this week" value={`${hours}h`} hint="across all roles" />
        <Stat
          label="Projected payroll"
          value={formatCurrency(payroll, { maximumFractionDigits: 0 })}
          hint="this week, pre-tax"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ScheduleGrid />
        </div>
        <AttendanceChart />
      </section>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-[14px] font-semibold tracking-tight text-foreground">
          Team members
        </h2>
        <Button variant="ghost" size="xs" className="text-[11.5px]">
          Manage roles
        </Button>
      </div>

      <StaffCards />
    </>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-elevated">
      <div>
        <p className="text-[11.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1.5 text-[20px] font-semibold tabular-nums text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{hint}</p>
      </div>
      <span className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Users className="size-4" />
      </span>
    </div>
  );
}
