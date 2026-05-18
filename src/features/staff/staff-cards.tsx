"use client";

import { Calendar, Clock, Hourglass, Mail } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoleBadge } from "@/features/staff/role-badge";
import { MemberActionsMenu, type MemberRef } from "@/features/staff/member-actions";
import type { PendingMember } from "@/lib/queries/users";
import { initials } from "@/lib/utils";
import type { SessionUser } from "@/types/auth";

/**
 * Renders one card per live user, then one per pending invite. Shift
 * and pay metrics are placeholders until the schedule/payroll
 * features arrive — explicitly drawn as "—" so it's obvious that
 * those fields aren't tracked yet (rather than fabricated mock
 * numbers, which used to mislead reviewers).
 */
export function StaffCards({
  members,
  pending,
}: {
  members: SessionUser[];
  pending: PendingMember[];
}) {
  if (members.length === 0 && pending.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card/40 p-10 text-center text-[13px] text-muted-foreground">
        No team members yet. Add one from the page header.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {members.map((m) => (
        <MemberCard key={m.id} member={m} />
      ))}
      {pending.map((p) => (
        <PendingCard key={p.id} member={p} />
      ))}
    </section>
  );
}

function MemberCard({ member }: { member: SessionUser }) {
  const ref: MemberRef = {
    id: member.id,
    type: "user",
    name: member.name,
    email: member.email,
  };
  return (
    <article className="group rounded-lg border bg-card p-4 shadow-elevated transition-colors hover:border-primary/30">
      <header className="flex items-start gap-3">
        <Avatar className="size-10 rounded-md">
          <AvatarFallback className="rounded-md bg-primary/10 text-[12px] font-semibold text-primary">
            {initials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-foreground">
            {member.name}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <RoleBadge role={member.role} />
          </div>
        </div>
        <MemberActionsMenu member={ref} />
      </header>

      <dl className="mt-3 space-y-1 text-[12px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="size-3" />
          <span className="truncate text-foreground/85">{member.email}</span>
        </div>
      </dl>

      <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
        <Metric label="Shifts" value="—" icon={Calendar} />
        <Metric label="Hours" value="—" icon={Clock} />
        <Metric label="Rate" value="—" />
      </div>
    </article>
  );
}

function PendingCard({ member }: { member: PendingMember }) {
  const ref: MemberRef = {
    id: member.id,
    type: "pending",
    name: member.name,
    email: member.email,
  };
  return (
    <article className="group rounded-lg border border-dashed bg-card/40 p-4 transition-colors hover:border-primary/30">
      <header className="flex items-start gap-3">
        <Avatar className="size-10 rounded-md">
          <AvatarFallback className="rounded-md border border-dashed border-border bg-muted text-[12px] font-semibold text-muted-foreground">
            {initials(member.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-semibold text-foreground">
            {member.name}
          </p>
          <Badge
            variant="outline"
            className="mt-1 rounded-md border-dashed text-[10.5px] font-normal text-muted-foreground"
          >
            <Hourglass className="size-3" />
            Awaiting invite
          </Badge>
        </div>
        <MemberActionsMenu member={ref} />
      </header>

      <dl className="mt-3 space-y-1 text-[12px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="size-3" />
          <span className="truncate text-foreground/85">{member.email}</span>
        </div>
      </dl>

      <p className="mt-3 border-t pt-3 text-[11.5px] text-muted-foreground">
        Assign a role + password from{" "}
        <span className="font-medium text-foreground">Settings → Team</span> to grant access.
      </p>
    </article>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Clock;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="inline-flex items-center gap-1 text-[10.5px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        {Icon ? <Icon className="size-3" /> : null}
        {label}
      </span>
      <span className="text-[13px] font-semibold tabular-nums text-foreground">
        {value}
      </span>
    </div>
  );
}
