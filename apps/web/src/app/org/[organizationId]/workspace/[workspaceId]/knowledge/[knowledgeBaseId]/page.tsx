import { KnowledgeBaseScreen } from "@/features/knowledge/screens/knowledge-base-screen";

type KnowledgeBasePageProps = {
  params: Promise<{ organizationId: string; workspaceId: string; knowledgeBaseId: string }>;
};

export default async function KnowledgeBasePage({ params }: KnowledgeBasePageProps) {
  const { organizationId, workspaceId, knowledgeBaseId } = await params;
  return <KnowledgeBaseScreen organizationId={organizationId} workspaceId={workspaceId} knowledgeBaseId={knowledgeBaseId} />;
}
