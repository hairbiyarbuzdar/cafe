import { redirect } from "next/navigation";

import { PageHeader } from "@/components/layouts/page-header";
import { SettingsShell } from "@/features/settings/settings-shell";
import { getCurrentUser } from "@/lib/auth";
import {
  getFiscalConfig,
  listRecentFiscalSubmissions,
} from "@/lib/queries/fiscal";
import {
  listPaymentChannels,
  listTransfers,
} from "@/lib/queries/payment-channels";
import { listRoles } from "@/lib/queries/roles";
import { getTaxConfig } from "@/lib/queries/tax";
import { listPendingMembers, listPublicUsers } from "@/lib/queries/users";
import { ensureBuiltInRoles } from "@/lib/roles-seed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  // Make sure the four built-in role rows exist before anyone opens
  // the Roles or Team panels — keeps a freshly wiped workspace from
  // throwing on the first visit.
  await ensureBuiltInRoles();

  const [
    teamMembers,
    pendingMembers,
    paymentChannels,
    transfers,
    fiscalConfig,
    fiscalSubmissions,
    taxConfig,
    roles,
  ] = await Promise.all([
    listPublicUsers(),
    listPendingMembers(),
    listPaymentChannels({ includeArchived: true }),
    listTransfers(),
    getFiscalConfig(),
    listRecentFiscalSubmissions(20),
    getTaxConfig(),
    listRoles(),
  ]);

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your café, customize the experience, and manage team access."
      />
      <SettingsShell
        currentUser={currentUser}
        teamMembers={teamMembers}
        pendingMembers={pendingMembers}
        paymentChannels={paymentChannels}
        transfers={transfers}
        fiscalConfig={fiscalConfig}
        fiscalSubmissions={fiscalSubmissions}
        taxConfig={taxConfig}
        roles={roles}
      />
    </>
  );
}
