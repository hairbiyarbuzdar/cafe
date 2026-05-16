import { Calendar, Clock, Mail, MoreHorizontal, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RoleBadge, StatusDot } from "@/features/staff/role-badge";
import { STAFF } from "@/mock/staff";
import { formatCurrency, initials } from "@/lib/utils";

export function StaffCards() {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {STAFF.map((s) => (
        <article
          key={s.id}
          className="group rounded-lg border bg-card p-4 shadow-elevated transition-colors hover:border-primary/30"
        >
          <header className="flex items-start gap-3">
            <Avatar className="size-10 rounded-md">
              <AvatarFallback className="rounded-md bg-primary/10 text-[12px] font-semibold text-primary">
                {initials(s.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-foreground">
                {s.name}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <RoleBadge role={s.role} />
                <StatusDot status={s.status} />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-md text-muted-foreground opacity-0 transition group-hover:opacity-100"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </header>

          <dl className="mt-3 space-y-1 text-[12px]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="size-3" />
              <span className="truncate text-foreground/85">{s.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="size-3" />
              {s.phone}
            </div>
          </dl>

          <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
            <Metric label="Shifts" value={`${s.shiftsThisWeek}`} icon={Calendar} />
            <Metric label="Hours" value={`${s.hoursThisWeek}h`} icon={Clock} />
            <Metric label="Rate" value={formatCurrency(s.hourlyRate)} />
          </div>
        </article>
      ))}
    </section>
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
