"use client";

import * as React from "react";

import { FiscalPanel } from "@/features/settings/fiscal/fiscal-panel";
import { PaymentMethodsPanel } from "@/features/settings/payment-methods/payment-methods-panel";
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
import type {
  FiscalSubmissionSummary,
  PublicFiscalConfig,
} from "@/lib/queries/fiscal";
import type {
  PaymentChannel,
  Transfer,
} from "@/lib/queries/payment-channels";
import type { PendingMember } from "@/lib/queries/users";
import type { SessionUser } from "@/types/auth";

export function SettingsShell({
  teamMembers,
  pendingMembers,
  paymentChannels,
  transfers,
  fiscalConfig,
  fiscalSubmissions,
}: {
  teamMembers: SessionUser[];
  pendingMembers: PendingMember[];
  paymentChannels: PaymentChannel[];
  transfers: Transfer[];
  fiscalConfig: PublicFiscalConfig;
  fiscalSubmissions: FiscalSubmissionSummary[];
}) {
  const [tab, setTab] = React.useState<SettingsTab>("general");

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-20 md:self-start">
        <SettingsNav active={tab} onChange={setTab} />
      </aside>

      <div className="min-w-0">
        {tab === "general" ? <GeneralPanel /> : null}
        {tab === "appearance" ? <AppearancePanel /> : null}
        {tab === "team" ? (
          <TeamPanel members={teamMembers} pending={pendingMembers} />
        ) : null}
        {tab === "payment-methods" ? (
          <PaymentMethodsPanel
            channels={paymentChannels}
            transfers={transfers}
          />
        ) : null}
        {tab === "fiscal" ? (
          <FiscalPanel config={fiscalConfig} submissions={fiscalSubmissions} />
        ) : null}
        {tab === "notifications" ? <NotificationsPanel /> : null}
        {tab === "billing" ? <BillingPanel /> : null}
        {tab === "integrations" ? <IntegrationsPanel /> : null}
        {tab === "security" ? <SecurityPanel /> : null}
      </div>
    </div>
  );
}
