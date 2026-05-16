"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MOBILE_NAV } from "@/constants/nav";
import { cn } from "@/lib/utils";

export function MobileTabbar() {
  const pathname = usePathname() ?? "";
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="sticky bottom-0 z-30 grid grid-cols-5 gap-1 border-t border-border/70 bg-background/95 px-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden"
    >
      {MOBILE_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-1 py-1 text-[11px] font-medium transition-colors",
              active
                ? "text-primary"
                : "text-muted-foreground active:bg-muted/60",
            )}
          >
            {active ? (
              <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary" />
            ) : null}
            <Icon
              className={cn(
                "size-[22px] transition-transform",
                active && "scale-110",
              )}
              strokeWidth={active ? 2.1 : 1.75}
            />
            <span className="leading-none">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}
