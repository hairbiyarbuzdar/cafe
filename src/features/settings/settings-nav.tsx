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
    <nav className="flex w-full flex-wrap gap-1 md:flex-col md:gap-0.5">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-[12.5px] font-medium transition-colors md:w-full md:justify-start",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
