"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronsUpDown,
  CircleHelp,
  Coffee,
  LogOut,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import { PRIMARY_NAV } from "@/constants/nav";
import { useCurrentUser } from "@/hooks/use-current-user";
import { hasPermission, ROLE_LABEL } from "@/lib/permissions";
import type { Workspace } from "@/lib/queries/workspace";
import { useAuth } from "@/store/auth-store";
import { initials } from "@/lib/utils";

export function AppSidebar({ workspace }: { workspace: Workspace }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const signOut = useAuth((s) => s.signOut);

  const address = workspace.addressLine || workspace.city;

  async function handleSignOut() {
    await signOut();
    toast.success("Signed out");
    router.replace("/login");
    router.refresh();
  }

  const visibleNav = React.useMemo(() => {
    return PRIMARY_NAV.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || hasPermission(user, item.permission),
      ),
    })).filter((group) => group.items.length > 0);
  }, [user]);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent group-data-[collapsible=icon]:justify-center"
              asChild
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-soft">
                  <Coffee className="size-4" strokeWidth={2} />
                </span>

                <div className="grid flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-[14px] font-semibold tracking-tight">
                    {workspace.name}
                  </span>
                  {address ? (
                    <span className="truncate text-[11.5px] text-muted-foreground">
                      {address}
                    </span>
                  ) : null}
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-2" />

      <SidebarContent>
        {visibleNav.map((group, gIdx) => (
          <SidebarGroup key={`${group.label}-${gIdx}`}>
            <SidebarGroupLabel className="px-2 text-[11.5px] font-medium uppercase tracking-[0.08em] text-muted-foreground/80">
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
                        className="h-10 gap-2.5 rounded-md text-[13.5px] data-[active=true]:bg-sidebar-accent data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary data-[active=true]:shadow-soft"
                      >
                        <Link href={item.href}>
                          <Icon className="size-[18px]" strokeWidth={1.85} />
                          <span>{item.title}</span>
                          {item.badge ? (
                            <Badge
                              variant="secondary"
                              className="ms-auto h-5 rounded-md border-0 bg-secondary/80 px-1.5 text-[11px] font-medium text-secondary-foreground/90 tabular-nums"
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
                  <Avatar className="size-9 rounded-lg">
                    <AvatarImage src={user?.avatar ?? undefined} alt={user?.name ?? ""} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/15 to-primary/10 text-[12px] font-semibold text-primary">
                      {user ? initials(user.name) : "—"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-[13.5px] font-medium">
                      {user?.name ?? "Sign in"}
                    </span>
                    <span className="truncate text-[11.5px] text-muted-foreground">
                      {user
                        ? (user.roleName ?? ROLE_LABEL[user.role] ?? user.role)
                        : "No session"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ms-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                sideOffset={8}
                className="w-64 rounded-lg"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium">
                      {user?.name ?? "Guest"}
                    </span>
                    <span className="text-[11.5px] text-muted-foreground">
                      {user
                        ? `${user.roleName ?? ROLE_LABEL[user.role] ?? user.role} · ${user.email}`
                        : ""}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <SettingsIcon className="size-4" />
                      Workspace settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CircleHelp className="size-4" />
                    Help and shortcuts
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
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
