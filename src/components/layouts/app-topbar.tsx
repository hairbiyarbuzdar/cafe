"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarClock,
  Command as CommandIcon,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeSwitch } from "@/components/shared/theme-switch";
import { CommandPalette } from "@/components/shared/command-palette";
import { NetworkStatus } from "@/features/offline/network-status";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  pos: "Point of Sale",
  orders: "Orders",
  inventory: "Inventory",
  reports: "Reports",
  staff: "Staff",
  settings: "Settings",
};

export function AppTopbar() {
  const pathname = usePathname() ?? "/";
  const [openPalette, setOpenPalette] = React.useState(false);
  const segments = pathname.split("/").filter(Boolean);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenPalette((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const currentSegment = segments[segments.length - 1];
  const currentLabel = currentSegment
    ? (SEGMENT_LABELS[currentSegment] ??
      currentSegment.replace(/-/g, " ").replace(/^./, (s) => s.toUpperCase()))
    : "Workspace";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/65 md:h-14 md:px-4">
      <SidebarTrigger className="-ms-1 size-9 md:size-8" />
      <Separator orientation="vertical" className="hidden h-5 md:block" />

      {/* Compact crumb on mobile, full crumb trail on md+ */}
      <span className="truncate text-[14px] font-medium text-foreground md:hidden">
        {currentLabel}
      </span>
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="text-[13px]">
              Workspace
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.map((seg, idx) => {
            const href = "/" + segments.slice(0, idx + 1).join("/");
            const isLast = idx === segments.length - 1;
            const label =
              SEGMENT_LABELS[seg] ??
              seg.replace(/-/g, " ").replace(/^./, (s) => s.toUpperCase());
            return (
              <React.Fragment key={href}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="text-[13px] font-medium">
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href} className="text-[13px]">
                      {label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ms-auto flex items-center gap-1 md:gap-2">
        <NetworkStatus />

        {/* Mobile: search becomes an icon. Desktop: full quasi-input. */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-md md:hidden"
              onClick={() => setOpenPalette(true)}
              aria-label="Search"
            >
              <Search className="size-[18px]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpenPalette(true)}
          className="hidden h-9 w-[260px] justify-between gap-2 rounded-md border-border/70 bg-card px-3 text-[13px] font-normal text-muted-foreground shadow-none hover:bg-secondary/60 md:inline-flex xl:w-[320px]"
        >
          <span className="flex items-center gap-2">
            <Search className="size-4" />
            Search or jump to…
          </span>
          <kbd className="hidden items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10.5px] font-medium text-muted-foreground md:inline-flex">
            <CommandIcon className="size-3" /> K
          </kbd>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-md md:size-9"
            >
              <CalendarClock className="size-[18px]" />
              <span className="sr-only">Schedule</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Today&apos;s schedule</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-10 rounded-md md:size-9"
            >
              <Bell className="size-[18px]" />
              <span className="absolute end-2 top-2 size-1.5 rounded-full bg-destructive" />
              <span className="sr-only">Notifications</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <ThemeSwitch />

        <Separator orientation="vertical" className="mx-1 hidden h-6 md:block" />

        <Button
          asChild
          size="sm"
          className="hidden h-9 gap-1.5 rounded-md text-[13px] sm:inline-flex"
        >
          <Link href="/pos">
            <Plus className="size-4" />
            New order
          </Link>
        </Button>
        <Button
          asChild
          size="icon"
          className="h-10 w-10 rounded-md sm:hidden"
          aria-label="New order"
        >
          <Link href="/pos">
            <Plus className="size-[18px]" />
          </Link>
        </Button>
      </div>

      <CommandPalette open={openPalette} onOpenChange={setOpenPalette} />
    </header>
  );
}
