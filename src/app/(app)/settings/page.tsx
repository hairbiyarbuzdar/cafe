import { PageHeader } from "@/components/layouts/page-header";
import { SettingsShell } from "@/features/settings/settings-shell";
import {
  getFiscalConfig,
  listRecentFiscalSubmissions,
} from "@/lib/queries/fiscal";
import {
  listPaymentChannels,
  listTransfers,
} from "@/lib/queries/payment-channels";
import { listPendingMembers, listPublicUsers } from "@/lib/queries/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [
    teamMembers,
    pendingMembers,
    paymentChannels,
    transfers,
    fiscalConfig,
    fiscalSubmissions,
  ] = await Promise.all([
    listPublicUsers(),
    listPendingMembers(),
    listPaymentChannels({ includeArchived: true }),
    listTransfers(),
    getFiscalConfig(),
    listRecentFiscalSubmissions(20),
  ]);

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your café, customize the experience, and manage team access."
      />
      <SettingsShell
        teamMembers={teamMembers}
        pendingMembers={pendingMembers}
        paymentChannels={paymentChannels}
        transfers={transfers}
        fiscalConfig={fiscalConfig}
        fiscalSubmissions={fiscalSubmissions}
      />
    </>
  );
}
