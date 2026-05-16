import { cn } from "@/lib/utils";
import type { StaffRole, StaffStatus } from "@/types";

const ROLE_LABEL: Record<StaffRole, string> = {
  admin: "Admin",
  manager: "Manager",
  cashier: "Cashier",
  kitchen: "Kitchen",
  barista: "Barista",
};

const ROLE_TONE: Record<StaffRole, string> = {
  admin: "bg-primary/12 text-primary border-primary/20",
  manager: "bg-info/12 text-info border-info/20",
  cashier: "bg-success/12 text-success border-success/20",
  kitchen: "bg-warning/15 text-warning-foreground/85 border-warning/20",
  barista: "bg-secondary text-secondary-foreground border-border",
};

export function RoleBadge({ role, className }: { role: StaffRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        ROLE_TONE[role],
        className,
      )}
    >
      {ROLE_LABEL[role]}
    </span>
  );
}

const STATUS_LABEL: Record<StaffStatus, string> = {
  active: "Active",
  "on-leave": "On leave",
  "off-duty": "Off-duty",
};

const STATUS_DOT: Record<StaffStatus, string> = {
  active: "bg-success",
  "on-leave": "bg-warning",
  "off-duty": "bg-muted-foreground",
};

export function StatusDot({ status }: { status: StaffStatus }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
      <span className={`size-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}
