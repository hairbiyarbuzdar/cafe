import { cn } from "@/lib/utils";
import { ROLE_LABEL } from "@/lib/permissions";
import type { StaffStatus } from "@/types";

const BUILT_IN_TONE: Record<string, string> = {
  admin: "bg-primary/12 text-primary border-primary/20",
  manager: "bg-info/12 text-info border-info/20",
  cashier: "bg-success/12 text-success border-success/20",
  kitchen: "bg-warning/15 text-warning-foreground/85 border-warning/20",
};

const CUSTOM_TONE = "bg-secondary text-secondary-foreground border-border";

function humanise(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RoleBadge({
  role,
  label,
  className,
}: {
  /** Role slug — one of the built-ins or a custom slug from the DB. */
  role: string;
  /** Display name. Falls back to a friendly form of the slug. */
  label?: string;
  className?: string;
}) {
  const tone = BUILT_IN_TONE[role] ?? CUSTOM_TONE;
  const text = label ?? ROLE_LABEL[role] ?? humanise(role);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
        tone,
        className,
      )}
    >
      {text}
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
