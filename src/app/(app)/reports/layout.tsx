import * as React from "react";

import { PageHeader } from "@/components/layouts/page-header";
import { ReportsNav } from "@/features/reports/reports-nav";

export const metadata = { title: "Reports" };

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Executive summary and deep-dive reports across every part of the business."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-20 md:self-start">
          <ReportsNav />
        </aside>
        <div className="min-w-0 space-y-4">{children}</div>
      </div>
    </>
  );
}
