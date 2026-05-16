"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ChartLine,
  CreditCard,
  LayoutDashboard,
  Moon,
  PackageSearch,
  PlusCircle,
  Receipt,
  Settings,
  Sun,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  const { setTheme } = useTheme();

  const go = React.useCallback(
    (href: string) => {
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, router],
  );

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Jump to a page, create a record, or change appearance."
    >
      <CommandInput placeholder="Search or jump to..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}>
            <LayoutDashboard /> Dashboard
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/pos")}>
            <CreditCard /> Point of Sale
            <CommandShortcut>G P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/orders")}>
            <Receipt /> Orders
            <CommandShortcut>G O</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/inventory")}>
            <PackageSearch /> Inventory
            <CommandShortcut>G I</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/reports")}>
            <ChartLine /> Reports
            <CommandShortcut>G R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/staff")}>
            <Users /> Staff
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => go("/settings")}>
            <Settings /> Settings
            <CommandShortcut>G ,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Create">
          <CommandItem onSelect={() => go("/pos")}>
            <PlusCircle /> New order
          </CommandItem>
          <CommandItem onSelect={() => go("/inventory")}>
            <PlusCircle /> New product
          </CommandItem>
          <CommandItem onSelect={() => go("/staff")}>
            <PlusCircle /> Invite team member
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Appearance">
          <CommandItem onSelect={() => setTheme("light")}>
            <Sun /> Light mode
          </CommandItem>
          <CommandItem onSelect={() => setTheme("dark")}>
            <Moon /> Dark mode
          </CommandItem>
          <CommandItem onSelect={() => setTheme("system")}>
            <Settings /> System default
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
