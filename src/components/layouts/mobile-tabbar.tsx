"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MOBILE_NAV } from "@/constants/nav";
import { cn } from "@/lib/utils";

export function MobileTabbar() {
  const pathname = usePathname() ?? "";
  return (
    <nav className="sticky bottom-0 z-30 grid grid-cols-5 gap-0.5 border-t bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur md:hidden">
      {MOBILE_NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-md px-1 py-1.5 text-[10px] font-medium transition",
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("size-[18px]", active && "fill-primary/10")} />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
