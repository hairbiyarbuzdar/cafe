"use client";

import * as React from "react";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Database,
  KeyRound,
  Palette,
  Percent,
  Receipt,
  ShieldCheck,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export const SETTINGS_TABS = [
  { id: "profile", label: "My profile", icon: User },
  { id: "general", label: "Workspace", icon: Building2 },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "team", label: "Team & permissions", icon: Users },
  { id: "roles", label: "Roles", icon: ShieldCheck },
  { id: "payment-methods", label: "Payment methods", icon: Wallet },
  { id: "tax", label: "Tax", icon: Percent },
  { id: "fiscal", label: "Fiscal device (BRA)", icon: Receipt },
  { id: "data", label: "Data Import / Export", icon: Database },
  { id: "notifications", label: "Notifications", icon: ShieldCheck },
  { id: "security", label: "Security", icon: KeyRound },
] as const;

export type SettingsTab = (typeof SETTINGS_TABS)[number]["id"];

type Props = {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
};

export function SettingsNav({ active, onChange }: Props) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScrollability = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  React.useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    const timeoutId = setTimeout(checkScrollability, 100);
    return () => {
      window.removeEventListener("resize", checkScrollability);
      clearTimeout(timeoutId);
    };
  }, [checkScrollability]);

  React.useEffect(() => {
    if (scrollRef.current) {
      const activeTab = scrollRef.current.querySelector(
        `[data-id="${active}"]`
      ) as HTMLElement;
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [active]);

  return (
    <>
      {/* Mobile/tablet: horizontal scrollable chips */}
      <div className="group relative flex items-center md:hidden">
        <button
          type="button"
          onClick={() => scroll("left")}
          className={cn(
            "absolute -left-2 z-20 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft transition-opacity",
            canScrollLeft ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
          )}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div
          className={cn(
            "pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-background via-background/50 to-transparent transition-opacity duration-300",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-background via-background/50 to-transparent transition-opacity duration-300",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          className="flex w-full gap-1.5 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <motion.div
            className="flex gap-1.5 px-1"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
          >
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = active === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  data-id={tab.id}
                  onClick={() => onChange(tab.id)}
                  aria-pressed={isActive}
                  variants={{ hidden: { opacity: 0, y: 10, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } }}
                  className={cn(
                    "inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-[13px] font-medium transition-colors",
                    isActive
                      ? "border-primary/40 bg-primary text-primary-foreground shadow-soft"
                      : "border-border/70 bg-card text-foreground hover:bg-muted",
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className={cn(
            "absolute -right-2 z-20 flex size-7 items-center justify-center rounded-full border bg-card/90 shadow-soft transition-opacity",
            canScrollRight ? "opacity-0 group-hover:opacity-100" : "opacity-0 pointer-events-none"
          )}
          disabled={!canScrollRight}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

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
