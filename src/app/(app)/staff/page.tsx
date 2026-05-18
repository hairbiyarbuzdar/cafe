import { Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { AddMemberDialog } from "@/features/staff/add-member-dialog";
import { AttendanceChart } from "@/features/staff/attendance-chart";
import { ManageRolesDialog } from "@/features/staff/manage-roles-dialog";
import { ScheduleGrid } from "@/features/staff/schedule-grid";
import { StaffCards } from "@/features/staff/staff-cards";
import { listPendingMembers, listPublicUsers } from "@/lib/queries/users";

export const metadata = { title: "Staff" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const [members, pending] = await Promise.all([
    listPublicUsers(),
    listPendingMembers(),
  ]);
  const totalSeats = members.length + pending.length;

  return (
    <>
      <PageHeader
        title="Staff"
        description="Manage your team, build schedules, and track attendance."
        actions={
          <AddMemberDialog
            trigger={
              <Button size="sm" className="h-8 rounded-md text-[12.5px]">
                <Plus className="size-3.5" />
                Add member
              </Button>
            }
          />
        }
      />

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label="Active team"
          value={`${members.length}`}
          hint={`${totalSeats} total ${totalSeats === 1 ? "seat" : "seats"}`}
        />
        <Stat
          label="Awaiting invite"
          value={`${pending.length}`}
          hint="not yet auth-capable"
        />
        <Stat label="Schedule" value="—" hint="shifts not tracked yet" />
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
        <ManageRolesDialog users={members} />
      </div>

      <StaffCards members={members} pending={pending} />
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
