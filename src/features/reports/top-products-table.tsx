import { SectionCard } from "@/components/shared/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendIndicator } from "@/components/shared/trend-indicator";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { TopProduct } from "@/types";

export function TopProductsTable({ data }: { data: TopProduct[] }) {
  return (
    <SectionCard
      title="Top performing products"
      description="Ranked by revenue this week"
      contentClassName="p-0"
    >
      <Table className="text-[12.5px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="h-9 w-12 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              #
            </TableHead>
            <TableHead className="h-9 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              Product
            </TableHead>
            <TableHead className="h-9 text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="h-9 text-right text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              Units
            </TableHead>
            <TableHead className="h-9 text-right text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              Revenue
            </TableHead>
            <TableHead className="h-9 text-right text-[11px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
              Δ wk
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                No paid orders in the past week.
              </TableCell>
            </TableRow>
          ) : null}
          {data.map((p) => (
            <TableRow key={p.rank}>
              <TableCell className="tabular-nums text-muted-foreground">
                {p.rank}
              </TableCell>
              <TableCell className="font-medium text-foreground">{p.name}</TableCell>
              <TableCell className="text-muted-foreground">{p.category}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatNumber(p.units)}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatCurrency(p.revenue)}
              </TableCell>
              <TableCell className="text-right">
                <TrendIndicator delta={p.delta} className="ms-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
