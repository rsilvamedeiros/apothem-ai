import { AgentsScreen } from "@/features/agents/screens/agents-screen";

type AgentsPageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
};

export default async function AgentsPage({ params }: AgentsPageProps) {
  const { organizationId, workspaceId } = await params;
  return <AgentsScreen organizationId={organizationId} workspaceId={workspaceId} />;
}
