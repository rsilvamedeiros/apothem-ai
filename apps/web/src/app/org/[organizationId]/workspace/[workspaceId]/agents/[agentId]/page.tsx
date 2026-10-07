import { AgentDetailScreen } from "@/features/agents/screens/agent-detail-screen";

type AgentPageProps = {
  params: Promise<{ organizationId: string; workspaceId: string; agentId: string }>;
};

export default async function AgentPage({ params }: AgentPageProps) {
  const { organizationId, workspaceId, agentId } = await params;
  return (
    <AgentDetailScreen organizationId={organizationId} workspaceId={workspaceId} agentId={agentId} />
  );
}
