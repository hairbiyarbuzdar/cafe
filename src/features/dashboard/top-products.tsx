import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { TopProduct } from "@/types";

export function TopProducts({ data }: { data: TopProduct[] }) {
  return (
    <SectionCard
      title="Top products"
      description="Best sellers today"
      action={
        <Button variant="ghost" size="xs" className="text-[11.5px]">
          See all
        </Button>
      }
      contentClassName="p-0"
    >
      <ul className="divide-y">
        {data.length === 0 ? (
          <li className="px-4 py-6 text-center text-[12.5px] text-muted-foreground md:px-5">
            No paid orders in the past week.
          </li>
        ) : null}
        {data.map((p) => (
          <li
            key={p.rank}
            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40 md:px-5"
          >
            <span className="flex size-6 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold tabular-nums text-secondary-foreground">
              {p.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-foreground">
                {p.name}
              </p>
              <p className="text-[11px] text-muted-foreground">{p.category}</p>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[12.5px] font-medium tabular-nums text-foreground">
                {formatCurrency(p.revenue, { maximumFractionDigits: 0 })}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="tabular-nums">{formatNumber(p.units)} units</span>
                <TrendIndicator delta={p.delta} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
