import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppTopbar } from "@/components/layouts/app-topbar";
import { MobileTabbar } from "@/components/layouts/mobile-tabbar";
import { AmbientBackground } from "@/components/shared/ambient-background";
import { getCurrentUser } from "@/lib/auth";
import { listMenuCategories, listMenuItems } from "@/lib/queries/menu";
import { listKitchenStations } from "@/lib/queries/stations";
import { DataHydrator } from "@/providers/data-hydrator";
import { SessionProvider } from "@/providers/session-provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware enforces auth before we get here, but we double-check
  // so any internal misroute still ends in /login rather than a crash.
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [cookieStore, items, stations, categories] = await Promise.all([
    cookies(),
    listMenuItems(),
    listKitchenStations(),
    listMenuCategories(),
  ]);
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SessionProvider user={user}>
      <DataHydrator items={items} stations={stations} categories={categories} />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AmbientBackground />
        <AppSidebar />
        <SidebarInset className="min-w-0 border border-border/60 bg-background shadow-elevated">
          <AppTopbar />
          <main className="relative flex-1 px-3 py-4 pb-20 md:px-6 md:py-6 md:pb-8">
            <div className="mx-auto w-full max-w-[1440px] space-y-6">
              {children}
            </div>
          </main>
          <MobileTabbar />
        </SidebarInset>
      </SidebarProvider>
    </SessionProvider>
  );
}
