import { KnowledgeScreen } from "@/features/knowledge/screens/knowledge-screen";

type KnowledgePageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
};

export default async function KnowledgePage({ params }: KnowledgePageProps) {
  const { organizationId, workspaceId } = await params;
  return <KnowledgeScreen organizationId={organizationId} workspaceId={workspaceId} />;
}
