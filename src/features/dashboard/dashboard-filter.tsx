"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CHANNELS = [
  { value: "all", label: "All channels" },
  { value: "dine-in", label: "Dine-in" },
  { value: "takeaway", label: "Takeaway" },
  { value: "delivery", label: "Delivery" },
  { value: "online", label: "Online" },
];

/**
 * Dashboard scope filter — same dialog shape as the Orders advanced
 * filter, but it re-scopes the whole dashboard (KPIs, charts) by writing
 * `from` / `to` / `channel` into the URL, which the server page reads to
 * re-fetch every metric.
 */
export function DashboardFilter() {
  const router = useRouter();
  const sp = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [channel, setChannel] = React.useState("all");

  const spFrom = sp.get("from") ?? "";
  const spTo = sp.get("to") ?? "";
  const spChannel = sp.get("channel") ?? "all";
  const active =
    (spFrom ? 1 : 0) + (spTo ? 1 : 0) + (spChannel !== "all" ? 1 : 0);

  React.useEffect(() => {
    if (open) {
      setFrom(spFrom);
      setTo(spTo);
      setChannel(spChannel);
    }
  }, [open, spFrom, spTo, spChannel]);

  function apply() {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (channel && channel !== "all") params.set("channel", channel);
    const qs = params.toString();
    router.push(qs ? `/dashboard?${qs}` : "/dashboard");
    setOpen(false);
  }

  function reset() {
    setFrom("");
    setTo("");
    setChannel("all");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-md text-[12.5px]">
          <Filter className="size-3.5" />
          Filter
          {active > 0 ? (
            <span className="ms-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {active}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[460px] gap-4 rounded-lg p-0">
        <DialogHeader className="px-5 pt-5">
          <DialogTitle className="text-[15px] font-semibold tracking-tight">
            Filter dashboard
          </DialogTitle>
          <DialogDescription className="text-[12.5px]">
            Re-scope every metric and chart by date range and channel.
            Leave dates empty for today.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3.5 px-5 pb-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="df-from" className="text-[12px] font-medium">
                Date from
              </Label>
              <Input
                id="df-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="df-to" className="text-[12px] font-medium">
                Date to
              </Label>
              <Input
                id="df-to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[12px] font-medium">Channel</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-2 border-t bg-surface-1 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-md text-[12.5px] text-muted-foreground"
            onClick={reset}
            disabled={!from && !to && channel === "all"}
          >
            <X className="size-3.5" />
            Reset
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-md text-[12.5px]"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" className="h-9 rounded-md text-[12.5px]" onClick={apply}>
              Apply filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
