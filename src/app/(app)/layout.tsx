import { cookies } from "next/headers";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { AppTopbar } from "@/components/layouts/app-topbar";
import { MobileTabbar } from "@/components/layouts/mobile-tabbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-surface-1">
        <AppTopbar />
        <main className="relative flex-1 px-3 py-4 pb-20 md:px-6 md:py-6 md:pb-8">
          <div className="mx-auto w-full max-w-[1440px] space-y-6">
            {children}
          </div>
        </main>
        <MobileTabbar />
      </SidebarInset>
    </SidebarProvider>
  );
}
