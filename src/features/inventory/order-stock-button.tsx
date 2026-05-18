"use client";

import * as React from "react";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReceiveStockDialog } from "@/features/inventory/receive-stock-dialog";
import type { InventoryItem, Supplier } from "@/types";

/**
 * Per-row "Order" button on the low-stock card. Opens the receive-stock
 * dialog already focused on the right item so the operator just enters
 * the incoming quantity.
 */
export function OrderStockButton({
  item,
  suppliers,
}: {
  item: InventoryItem;
  suppliers: Supplier[];
}) {
  return (
    <ReceiveStockDialog
      defaultItemId={item.id}
      suppliers={suppliers}
      trigger={
        <Button
          size="xs"
          variant="outline"
          className="h-6 rounded-md text-[11px]"
        >
          <Package className="size-3" />
          Order
        </Button>
      }
    />
  );
}
