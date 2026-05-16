"use client";

import * as React from "react";
import {
  Building2,
  CreditCard,
  KeyRound,
  Palette,
  Plug,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const SETTINGS_TABS = [
  { id: "general", label: "Workspace", icon: Building2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "team", label: "Team & permissions", icon: Users },
  { id: "notifications", label: "Notifications", icon: ShieldCheck },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "security", label: "Security", icon: KeyRound },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

type Props = {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
};

export function SettingsNav({ active, onChange }: Props) {
  return (
    <>
      {/* Mobile/tablet: horizontal scrollable chips */}
      <ScrollArea className="-mx-3 w-[calc(100%+1.5rem)] md:hidden">
        <div className="flex gap-1.5 px-3 pb-2">
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange(tab.id)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-[13px] font-medium transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary text-primary-foreground shadow-soft"
                    : "border-border/70 bg-card text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Desktop: vertical list */}
      <nav className="hidden flex-col gap-1 md:flex">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex h-10 items-center gap-2.5 rounded-md px-3 text-[13.5px] font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
