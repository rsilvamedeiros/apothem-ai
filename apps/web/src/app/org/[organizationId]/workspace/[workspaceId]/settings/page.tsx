import { SettingsScreen } from "@/features/tool-policy/screens/settings-screen";

type SettingsPageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { organizationId, workspaceId } = await params;
  return <SettingsScreen organizationId={organizationId} workspaceId={workspaceId} />;
}
