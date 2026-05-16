"use client";

import * as React from "react";

import { PageHeader } from "@/components/layouts/page-header";
import { SettingsNav, type SettingsTab } from "@/features/settings/settings-nav";
import {
  AppearancePanel,
  BillingPanel,
  GeneralPanel,
  IntegrationsPanel,
  NotificationsPanel,
  SecurityPanel,
  TeamPanel,
} from "@/features/settings/settings-panels";

export default function SettingsPage() {
  const [tab, setTab] = React.useState<SettingsTab>("general");

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your café, customize the experience, and manage team access."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-20 md:self-start">
          <SettingsNav active={tab} onChange={setTab} />
        </aside>

        <div className="min-w-0">
          {tab === "general" ? <GeneralPanel /> : null}
          {tab === "appearance" ? <AppearancePanel /> : null}
          {tab === "team" ? <TeamPanel /> : null}
          {tab === "notifications" ? <NotificationsPanel /> : null}
          {tab === "billing" ? <BillingPanel /> : null}
          {tab === "integrations" ? <IntegrationsPanel /> : null}
          {tab === "security" ? <SecurityPanel /> : null}
        </div>
      </div>
    </>
  );
}
