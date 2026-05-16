"use client";

import * as React from "react";
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

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/65 md:px-4">
      <SidebarTrigger className="-ms-1" />
      <Separator orientation="vertical" className="h-5" />

      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard" className="text-[12.5px]">
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
                    <BreadcrumbPage className="text-[12.5px] font-medium">
                      {label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href} className="text-[12.5px]">
                      {label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ms-auto flex items-center gap-1.5 md:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpenPalette(true)}
          className="h-8 w-[220px] justify-between gap-2 rounded-md border-border/80 bg-card px-2.5 text-[12px] font-normal text-muted-foreground shadow-none hover:bg-secondary/60 md:w-[280px]"
        >
          <span className="flex items-center gap-2">
            <Search className="size-3.5" />
            Search or jump to...
          </span>
          <kbd className="hidden items-center gap-0.5 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-flex">
            <CommandIcon className="size-3" /> K
          </kbd>
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-md">
              <CalendarClock className="size-4" />
              <span className="sr-only">Schedule</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Today's schedule</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 rounded-md"
            >
              <Bell className="size-4" />
              <span className="absolute end-1.5 top-1.5 size-1.5 rounded-full bg-destructive" />
              <span className="sr-only">Notifications</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <ThemeSwitch />

        <Separator orientation="vertical" className="mx-1 h-5" />

        <Button size="sm" className="h-8 gap-1.5 rounded-md text-[12.5px]">
          <Plus className="size-3.5" />
          New order
        </Button>
      </div>

      <CommandPalette open={openPalette} onOpenChange={setOpenPalette} />
    </header>
  );
}
