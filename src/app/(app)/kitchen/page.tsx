import { Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layouts/page-header";
import { KitchenBoard } from "@/features/kitchen/kitchen-board";
import { listActiveKitchenTickets } from "@/lib/queries/kitchen";
import { listKitchenStations } from "@/lib/queries/stations";

export const metadata = { title: "Kitchen display" };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const [tickets, stations] = await Promise.all([
    listActiveKitchenTickets(),
    listKitchenStations(),
  ]);
  const activeStationCount = stations.filter((s) => s.active).length;

  return (
    <>
      <PageHeader
        title="Kitchen display"
        description="Each station receives only the items it prepares. Update tickets as they move through pending → preparing → ready → served."
        meta={
          <>
            <Badge variant="secondary" className="rounded-md font-normal">
              <span className="me-1 inline-block size-1.5 rounded-full bg-success" />
              Service active
            </Badge>
            <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
              {tickets.length} tickets in flight
            </Badge>
            <Badge variant="outline" className="rounded-md font-normal text-muted-foreground">
              {activeStationCount} active stations
            </Badge>
          </>
        }
        actions={
          <Button variant="outline" size="sm" className="h-9 rounded-md text-[12.5px]" disabled>
            <Filter className="size-4" />
            Recall
          </Button>
        }
      />

      <KitchenBoard stations={stations} tickets={tickets} />
    </>
  );
}
