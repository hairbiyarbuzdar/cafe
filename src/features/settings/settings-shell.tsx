"use client";

import * as React from "react";

import { DataTransferPanel } from "@/features/settings/data-transfer/data-transfer-panel";
import { FiscalPanel } from "@/features/settings/fiscal/fiscal-panel";
import { PaymentMethodsPanel } from "@/features/settings/payment-methods/payment-methods-panel";
import { ProfilePanel } from "@/features/settings/profile/profile-panel";
import { RolesManagerPanel } from "@/features/settings/roles/roles-manager-panel";
import { SettingsNav, type SettingsTab } from "@/features/settings/settings-nav";
import {
  AppearancePanel,
  NotificationsPanel,
  SecurityPanel,
  TeamPanel,
} from "@/features/settings/settings-panels";
import { WorkspacePanel } from "@/features/settings/workspace/workspace-panel";
import { TaxPanel } from "@/features/settings/tax/tax-panel";
import type {
  FiscalSubmissionSummary,
  PublicFiscalConfig,
} from "@/lib/queries/fiscal";
import type {
  PaymentChannel,
  Transfer,
} from "@/lib/queries/payment-channels";
import type { Role } from "@/lib/queries/roles";
import type { TaxConfig } from "@/lib/queries/tax";
import type { PendingMember } from "@/lib/queries/users";
import type { Workspace } from "@/lib/queries/workspace";
import type { SessionUser } from "@/types/auth";

export function SettingsShell({
  currentUser,
  teamMembers,
  pendingMembers,
  paymentChannels,
  transfers,
  fiscalConfig,
  fiscalSubmissions,
  taxConfig,
  roles,
  workspace,
}: {
  currentUser: SessionUser;
  teamMembers: SessionUser[];
  pendingMembers: PendingMember[];
  paymentChannels: PaymentChannel[];
  transfers: Transfer[];
  fiscalConfig: PublicFiscalConfig;
  fiscalSubmissions: FiscalSubmissionSummary[];
  taxConfig: TaxConfig;
  roles: Role[];
  workspace: Workspace;
}) {
  const [tab, setTab] = React.useState<SettingsTab>("profile");

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-20 md:self-start">
        <SettingsNav active={tab} onChange={setTab} />
      </aside>

      <div className="min-w-0">
        {tab === "profile" ? <ProfilePanel user={currentUser} /> : null}
        {tab === "general" ? <WorkspacePanel workspace={workspace} /> : null}
        {tab === "appearance" ? <AppearancePanel /> : null}
        {tab === "team" ? (
          <TeamPanel
            members={teamMembers}
            pending={pendingMembers}
            roles={roles}
          />
        ) : null}
        {tab === "roles" ? <RolesManagerPanel roles={roles} /> : null}
        {tab === "payment-methods" ? (
          <PaymentMethodsPanel
            channels={paymentChannels}
            transfers={transfers}
          />
        ) : null}
        {tab === "tax" ? <TaxPanel config={taxConfig} /> : null}
        {tab === "fiscal" ? (
          <FiscalPanel config={fiscalConfig} submissions={fiscalSubmissions} />
        ) : null}
        {tab === "data" ? <DataTransferPanel /> : null}
        {tab === "notifications" ? <NotificationsPanel /> : null}
        {tab === "security" ? <SecurityPanel /> : null}
      </div>
    </div>
  );
}
