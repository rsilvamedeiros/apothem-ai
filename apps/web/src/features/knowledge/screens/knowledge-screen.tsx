import { getApiClient } from "@/lib/session";
import { createKnowledgeBaseAction } from "../actions";
import { loadKnowledgeBases } from "../load-knowledge";
import { KnowledgeView } from "./knowledge-view";

type KnowledgeScreenProps = {
  organizationId: string;
  workspaceId: string;
};

export async function KnowledgeScreen({ organizationId, workspaceId }: KnowledgeScreenProps) {
  const result = await loadKnowledgeBases(await getApiClient(), organizationId, workspaceId);
  return (
    <KnowledgeView
      result={result}
      basePath={`/org/${organizationId}/workspace/${workspaceId}/knowledge`}
      createBase={createKnowledgeBaseAction.bind(null, organizationId, workspaceId)}
    />
  );
}
