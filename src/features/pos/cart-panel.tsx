"use client";

import * as React from "react";
import {
  Bike,
  CircleX,
  Clock,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  Trash2,
  Unlink,
  UserRound,
  Utensils,
  Check, // Added for combobox
  ChevronsUpDown, // Added for combobox
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
// Removed Select components as they are replaced by Popover/Command for waiter selection
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ReceiptPreviewDialog, type ReceiptPayload } from "@/features/receipts/receipt-preview-dialog";
import type {
  KitchenTicketData,
  PaymentReceiptData,
  ReceiptLineItem,
} from "@/features/receipts/receipt-models";
import {
  addItemsToHeldOrderAction,
  placeOrderAction,
} from "@/lib/actions/orders";
import { tryAutoPrintReceipts } from "@/lib/print/print-receipts";
import { PayHeldOrdersPicker } from "@/features/pos/pay-held-orders-picker";
import { TablePicker } from "@/features/pos/table-picker";
import type { HeldOrderSummary } from "@/lib/queries/orders";
import type { PaymentChannel } from "@/lib/queries/payment-channels";
import type { KitchenTicketItem } from "@/types";
import { cartSubtotal, useCart } from "@/store/cart-store";
import { useMenu } from "@/store/menu-store";
import { useStaff, waitersOf } from "@/store/staff-store";
import { useStations } from "@/store/stations-store";
import { useTables } from "@/store/tables-store";
import { useWorkspace } from "@/store/workspace-store";
import { cn, formatCurrency } from "@/lib/utils";
import type { OrderChannel } from "@/types";

// Import Popover components for the combobox
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// Import Command components for the combobox
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"; // Assuming Shadcn's command component which wraps cmdk

type Staff = { id: string; name: string };

type CartPanelProps = {
  /** Fired when the user opens the place-order dialog
   *  (useful for closing a wrapping bottom sheet on mobile). */
  onChargeStart?: () => void;
  /** Held orders — drives the Pay picker rendered alongside the
   * place-order button. */
  heldOrders?: HeldOrderSummary[];
  /** Configured payment channels — passed to the embedded
   * TakePaymentDialog so cashiers pick from real workspace methods. */
  paymentChannels?: PaymentChannel[];
};

export function CartPanel({
  onChargeStart,
  heldOrders = [],
  paymentChannels = [],
}: CartPanelProps = {}) {
  const items = useCart((s) => s.items);
  const channel = useCart((s) => s.channel);
  const note = useCart((s) => s.note);
  const discountPct = useCart((s) => s.discountPct);
  const tableId = useCart((s) => s.tableId);
  const guests = useCart((s) => s.guests);
  const taxRate = useCart((s) => s.taxRate);
  const taxLabel = useCart((s) => s.taxLabel);
  const attachedOrderId = useCart((s) => s.attachedOrderId);
  const attachedOrderNumber = useCart((s) => s.attachedOrderNumber);
  const setNote = useCart((s) => s.setNote);
  const setDiscountPct = useCart((s) => s.setDiscountPct);
  const setQuantity = useCart((s) => s.setQuantity);
  const setGuests = useCart((s) => s.setGuests);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const detach = useCart((s) => s.detach);

  const tables = useTables((s) => s.tables);
  const selectTable = useTables((s) => s.selectTable);
  const selectedTable = tables.find((t) => t.id === tableId);
  const menuItems = useMenu((s) => s.items);
  const stations = useStations((s) => s.stations);
  const workspace = useWorkspace((s) => s.workspace);

  const allStaff = useStaff((s) => s.staff);
  const waiters = React.useMemo(() => waitersOf(allStaff), [allStaff]);

  const [isPlacing, setIsPlacing] = React.useState(false);
  const [assignedStaffId, setAssignedStaffId] = React.useState<string | null>(null);
  const [openWaiterCombobox, setOpenWaiterCombobox] = React.useState(false); // State for combobox popover

  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [receipts, setReceipts] = React.useState<ReceiptPayload[]>([]);

  // Sync assigned waiter from table when selection changes
  React.useEffect(() => {
    if (tableId) {
      const table = tables.find((t) => t.id === tableId);
      if (table?.waiterId) {
        setAssignedStaffId(table.waiterId);
      }
    } else {
      setAssignedStaffId(null);
    }
  }, [tableId, tables]);

  const isAttach = Boolean(attachedOrderId);
  const subtotal = cartSubtotal(items);
  const discount = subtotal * (discountPct / 100);
  const taxable = subtotal - discount;
  const tax = taxable * taxRate;
  const total = taxable + tax;

  async function handlePrint(orderNumber: string, orderTotal: number) {
    if (!workspace) return;

    const wsHeader = {
      name: workspace.name,
      city: workspace.city,
      addressLine: workspace.addressLine,
      taxId: workspace.taxId,
      legalEntity: workspace.legalEntity,
      receiptFooter: workspace.receiptFooter,
      receiptWidth: workspace.receiptWidth,
    };

    const placedAt = new Intl.DateTimeFormat("en-GB", {
      timeZone: workspace.timezone || undefined,
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());

    const toPrint: ReceiptPayload[] = [];

    // 1. Kitchen Tickets (Grouped by Station)
    if (stations.length > 0) {
      const stationById = new Map(stations.map((s) => [s.id, s]));
      const byStation = new Map<string, ReceiptLineItem[]>();

      for (const ci of items) {
        const menu = menuItems.find((m) => m.id === ci.productId);
        if (!menu) continue;
        const list = byStation.get(menu.stationId) ?? [];
        list.push({
          quantity: ci.quantity,
          name: ci.name,
          amount: ci.unitPrice * ci.quantity,
          modifiers: ci.modifiers.length > 0 ? ci.modifiers.map((m) => m.name) : undefined,
        });
        byStation.set(menu.stationId, list);
      }

      for (const [stationId, lineItems] of byStation.entries()) {
        const stationName = stationById.get(stationId)?.name ?? "Kitchen";
        const data: KitchenTicketData = {
          header: { workspace: wsHeader, kind: `Kitchen · ${stationName}`, printedAt: placedAt },
          orderNumber,
          channel,
          table: selectedTable?.name ?? null,
          guests: channel === "dine-in" ? guests : null,
          stationName,
          items: lineItems,
          placedAt,
          notes: note?.trim() || null,
        };
        toPrint.push({ kind: "kitchen", data });
      }
    }

    // 2. Customer Bill (For non-dine-in or when requested)
    // Note: Held orders usually just get the kitchen ticket, 
    // but we can add a bill payload here if required.

    if (toPrint.length > 0) {
      try {
        const printed = await tryAutoPrintReceipts(toPrint);
        if (printed) {
          toast.success(
            toPrint.length > 1
              ? `${toPrint.length} receipts sent to printer`
              : "Receipt sent to printer",
          );
        } else {
          setReceipts(toPrint);
          setReceiptOpen(true);
        }
      } catch (err) {
        toast.error("Couldn't reach the printer", {
          description: err instanceof Error ? err.message : "Print failed",
        });
        setReceipts(toPrint);
        setReceiptOpen(true);
      }
    }
  }

  async function handlePlaceOrder() {
    if (items.length === 0 || isPlacing) return;

    if (channel === "dine-in" && !isAttach && !tableId) {
      toast.error("Pick a table first");
      return;
    }

    setIsPlacing(true);
    onChargeStart?.(); // Signal action start (e.g. close mobile drawer)

    let finalOrderNumber = "";
    let finalTotal = 0;

    try {
      if (isAttach) {
        const res = await addItemsToHeldOrderAction(
          attachedOrderId!,
          items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            modifiers: i.modifiers,
            note: i.note,
          })),
        );
        if (!res.ok) throw new Error(res.error);
        toast.success(`Items added to ${attachedOrderNumber}`);
        finalOrderNumber = attachedOrderNumber!;
        finalTotal = res.total;
      } else {
        const res = await placeOrderAction({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            modifiers: i.modifiers,
            note: i.note,
          })),
          channel,
          tableId: tableId ?? undefined,
          guests,
          note,
          discountPct,
          taxRate,
          assignedStaffId,
        });
        if (!res.ok) throw new Error(res.error);
        toast.success(`Order ${res.orderNumber} placed`);
        finalOrderNumber = res.orderNumber;
        finalTotal = res.total;
      }

      // Trigger printing/preview
      await handlePrint(finalOrderNumber, finalTotal);

      clear();
      selectTable(undefined);
      if (isAttach) detach();
      setAssignedStaffId(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  }

  const selectedWaiter = waiters.find((w) => w.id === assignedStaffId);
  return (
    <aside className="flex h-full min-h-0 w-full flex-col bg-card">
      <header className="flex items-center justify-between border-b px-4 py-3.5">
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold tracking-tight text-foreground">
            {isAttach ? `Adding to ${attachedOrderNumber}` : "New order"}
          </h2>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] text-muted-foreground">
            <ChannelInline channel={channel} />
            {selectedTable ? (
              <>
                <span aria-hidden>·</span>
                <span className="font-medium text-foreground">{selectedTable.name}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>
              {items.length === 0
                ? "no items"
                : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) === 1 ? "" : "s"}`}
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          disabled={items.length === 0}
          onClick={() => {
            clear();
            selectTable(undefined);
            toast.success("Cart cleared", { description: "Started a fresh order" });
          }}
          className="text-muted-foreground"
          aria-label="Clear cart"
        >
          <Trash2 className="size-4" />
        </Button>
      </header>

      {isAttach ? (
        <div className="flex items-center justify-between gap-3 border-b border-warning/20 bg-warning/8 px-4 py-2 text-[12px]">
          <span className="inline-flex items-center gap-1.5 text-warning-foreground/85">
            <Badge variant="outline" className="rounded-md border-warning/40 text-warning-foreground/85">
              Attach mode
            </Badge>
            New items append to{" "}
            <span className="font-mono text-foreground">{attachedOrderNumber}</span>
          </span>
          <Button
            variant="ghost"
            size="xs"
            className="text-[11.5px] text-muted-foreground"
            onClick={() => {
              detach();
              toast.success("Detached", { description: "Starting a new order" });
            }}
          >
            <Unlink className="size-3" />
            Detach
          </Button>
        </div>
      ) : null}

      {channel === "dine-in" && !isAttach ? (
        <>
          <TablePicker />

          <div className="flex items-center justify-between gap-3 border-b px-4 py-2">
            <span className="text-[12.5px] text-muted-foreground">
              Guests
            </span>

            <div className="inline-flex items-center overflow-hidden rounded-md border bg-card">
              <button
                type="button"
                onClick={() => setGuests(guests - 1)}
                disabled={guests <= 1}
                className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted disabled:opacity-40"
                aria-label="Decrease guests"
              >
                <Minus className="size-3.5" />
              </button>

              <span className="min-w-9 text-center text-[13px] font-medium tabular-nums">
                {guests}
              </span>

              <button
                type="button"
                onClick={() => setGuests(guests + 1)}
                disabled={guests >= 20}
                className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted disabled:opacity-40"
                aria-label="Increase guests"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </>
      ) : null}

      <ScrollArea className="min-h-0 flex-1">
        {items.length === 0 ? (
          <EmptyCart isAttach={isAttach} />
        ) : (
          <ul className="divide-y">
            {items.map((item) => {
              const unit =
                item.unitPrice + item.modifiers.reduce((s, m) => s + m.priceDelta, 0);
              const lineTotal = unit * item.quantity;
              return (
                <li key={item.productId} className="flex gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {item.name}
                      </p>
                      <button
                        onClick={() => remove(item.productId)}
                        aria-label="Remove"
                        className="text-muted-foreground transition hover:text-destructive"
                      >
                        <CircleX className="size-3.5" />
                      </button>
                    </div>
                    {item.modifiers.length > 0 ? (
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {item.modifiers.map((m) => m.name).join(" · ")}
                      </p>
                    ) : (
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatCurrency(unit)} ea
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center overflow-hidden rounded-md border bg-card">
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted"
                          aria-label="Decrease"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-9 text-center text-[13px] font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          className="flex size-8 items-center justify-center text-muted-foreground transition hover:bg-muted"
                          aria-label="Increase"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-[13.5px] font-semibold tabular-nums text-foreground">
                        {formatCurrency(lineTotal)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>

      <div className="space-y-3 border-t bg-surface-1 px-4 py-4">
        {channel === "dine-in" && tableId && waiters.length > 0 ? (
          <div className="space-y-1.5 rounded-md border bg-card p-3">
            <Label className="block text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
              Assigned Waiter
            </Label>

            <Popover
              open={openWaiterCombobox}
              onOpenChange={setOpenWaiterCombobox}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openWaiterCombobox}
                  className="h-9 w-full justify-between rounded-md bg-card text-[12.5px]"
                >
                  {selectedWaiter ? selectedWaiter.name : "Select waiter..."}

                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder="Search waiter..." />

                  <CommandList>
                    <CommandEmpty>No waiter found.</CommandEmpty>

                    <CommandGroup>
                      <CommandItem
                        value="Unassigned"
                        onSelect={() => {
                          setAssignedStaffId(null);
                          setOpenWaiterCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            assignedStaffId === null
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />

                        Unassigned
                      </CommandItem>

                      {waiters.map((waiter) => (
                        <CommandItem
                          key={waiter.id}
                          value={waiter.name}
                          onSelect={() => {
                            setAssignedStaffId(waiter.id);
                            setOpenWaiterCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              assignedStaffId === waiter.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />

                          {waiter.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        ) : null}

        <dl className="space-y-1.5 text-[12.5px]">
          <Row label="Subtotal" value={formatCurrency(subtotal)} />
          {!isAttach && discount > 0 ? (
            <Row label={`Discount (${discountPct}%)`} value={`−${formatCurrency(discount)}`} muted />
          ) : null}
          {!isAttach ? (
            <Row label={`${taxLabel} (${(taxRate * 100).toFixed(2)}%)`} value={formatCurrency(tax)} muted />
          ) : null}
          <Separator className="my-1.5" />
          <Row
            label={isAttach ? "New items total" : "Total (due on pickup)"}
            value={formatCurrency(isAttach ? subtotal : total)}
            bold
          />
        </dl>

        <p className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
          <Clock className="size-3" />
          {isAttach
            ? "Additions are sent to the kitchen; payment is collected at pickup."
            : "Sends to the kitchen on hold. Payment is collected at pickup / served."}
        </p>

        <div className="flex items-stretch gap-2">
          <Button
            className="h-12 flex-1 rounded-md text-[14px] font-semibold shadow-soft"
            disabled={
              items.length === 0 ||
              (channel === "dine-in" && !isAttach && !tableId) ||
              isPlacing
            }
            title={
              channel === "dine-in" && !isAttach && !tableId
                ? "Pick a table before placing a dine-in order"
                : undefined
            }
            onClick={handlePlaceOrder}
          >
            {isPlacing ? (
              "Placing..."
            ) : (
              <>
                <ReceiptText className="size-4" />
                {isAttach
                  ? `Add to ${attachedOrderNumber}`
                  : channel === "dine-in" && !tableId
                    ? "Pick a table to place order"
                    : `Place order · ${formatCurrency(total)}`}
              </>
            )}
          </Button>
          <PayHeldOrdersPicker
            orders={heldOrders}
            channels={paymentChannels}
            className="h-12"
          />
        </div>
      </div>

      <ReceiptPreviewDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        title="Order receipts"
        description={receipts.length > 1 ? `Kitchen tickets (${receipts.length}).` : "Print to the printer or download as a PDF."}
        receipts={receipts}
      />
    </aside>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt
        className={cn(
          "text-[12.5px]",
          muted ? "text-muted-foreground" : "text-foreground",
          bold && "text-[13px] font-semibold",
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "tabular-nums",
          muted ? "text-muted-foreground" : "text-foreground",
          bold && "text-[14.5px] font-semibold",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

const CHANNEL_META: Record<
  OrderChannel,
  { label: string; icon: typeof Utensils }
> = {
  "dine-in": { label: "Dine-in", icon: Utensils },
  takeaway: { label: "Takeaway", icon: ShoppingBag },
  delivery: { label: "Delivery", icon: Bike },
  online: { label: "Online", icon: ShoppingBag },
};

function ChannelInline({ channel }: { channel: OrderChannel }) {
  const meta = CHANNEL_META[channel];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1 font-medium text-foreground">
      <Icon className="size-3" />
      {meta.label}
    </span>
  );
}

function EmptyCart({ isAttach }: { isAttach: boolean }) {
  return (
    <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-secondary/60">
        <ReceiptText className="size-5 text-muted-foreground" />
      </div>
      <p className="text-[13.5px] font-medium text-foreground">
        {isAttach ? "No new items yet" : "Cart is empty"}
      </p>
      <p className="text-[12.5px] text-muted-foreground">
        {isAttach
          ? "Tap a product to append it to the held order."
          : "Tap a product to add it to the order."}
      </p>
    </div>
  );
}
