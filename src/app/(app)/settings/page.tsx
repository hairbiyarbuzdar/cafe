import { PageHeader } from "@/components/layouts/page-header";
import { SettingsShell } from "@/features/settings/settings-shell";
import { listPublicUsers } from "@/lib/queries/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const teamMembers = await listPublicUsers();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Configure your café, customize the experience, and manage team access."
      />
      <SettingsShell teamMembers={teamMembers} />
    </>
  );
}
