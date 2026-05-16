import Link from "next/link";

import { SectionCard } from "@/components/shared/section-card";
import { QUICK_ACTIONS } from "@/constants/nav";

export function QuickActions() {
  return (
    <SectionCard title="Quick actions" description="Jump to common tasks">
      <div className="grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              href={action.href}
              className="group flex flex-col items-start gap-2 rounded-md border bg-card p-3 transition-all hover:border-primary/40 hover:bg-accent/40"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-4" />
              </span>
              <span className="text-[12.5px] font-medium text-foreground">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </SectionCard>
  );
}
