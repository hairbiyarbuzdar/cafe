"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  CircleHelp,
  Coffee,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BRAND, PRIMARY_NAV } from "@/constants/nav";
import { initials } from "@/lib/utils";

const CURRENT_USER = {
  name: "Elena Volkova",
  email: "elena@brewline.co",
  role: "Owner",
  avatar: "",
};

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
              asChild
            >
              <Link href="/dashboard" className="gap-3">
                <span className="flex aspect-square size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
                  <Coffee className="size-4" />
                </span>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="text-[13px] font-semibold tracking-tight">
                    {BRAND.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Mission St · San Francisco
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-2" />

      <SidebarContent>
        {PRIMARY_NAV.map((group, gIdx) => (
          <SidebarGroup key={`${group.label}-${gIdx}`}>
            <SidebarGroupLabel className="px-2 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground/70">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={!!isActive}
                        tooltip={item.title}
                        className="h-9 gap-2.5"
                      >
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span className="text-[13px]">{item.title}</span>
                          {item.badge ? (
                            <Badge
                              variant="secondary"
                              className="ms-auto h-5 rounded-md border-0 bg-secondary/70 px-1.5 text-[10.5px] font-medium text-secondary-foreground/80 tabular-nums"
                            >
                              {item.badge}
                            </Badge>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <Avatar className="size-8 rounded-md">
                    <AvatarImage src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
                    <AvatarFallback className="rounded-md bg-primary/10 text-primary text-[11px] font-semibold">
                      {initials(CURRENT_USER.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-[13px] font-medium">
                      {CURRENT_USER.name}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {CURRENT_USER.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ms-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                sideOffset={8}
                className="w-60 rounded-lg"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium">
                      {CURRENT_USER.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {CURRENT_USER.role} · {CURRENT_USER.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <SettingsIcon className="size-4" />
                    Workspace settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CircleHelp className="size-4" />
                    Help and shortcuts
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
