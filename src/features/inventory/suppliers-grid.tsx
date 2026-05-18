import { Mail, Phone, Star } from "lucide-react";

import { SectionCard } from "@/components/shared/section-card";
import type { Supplier } from "@/types";
import { initials } from "@/lib/utils";

export function SuppliersGrid({ suppliers }: { suppliers: Supplier[] }) {
  return (
    <SectionCard title="Suppliers" description="Active vendor relationships" contentClassName="p-0">
      <ul className="divide-y">
        {suppliers.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 md:px-5"
          >
            <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold text-secondary-foreground">
              {initials(s.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">{s.name}</p>
              <p className="truncate text-[11.5px] text-muted-foreground">
                {s.contact} · {s.itemsSupplied} items
              </p>
            </div>
            <div className="hidden items-center gap-3 text-[11px] text-muted-foreground md:flex">
              <span className="inline-flex items-center gap-1">
                <Mail className="size-3" />
                {s.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="size-3" />
                {s.phone}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-1.5 py-0.5 text-[11px] font-medium text-warning-foreground/85">
              <Star className="size-3 fill-warning text-warning" />
              {s.rating.toFixed(1)}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
