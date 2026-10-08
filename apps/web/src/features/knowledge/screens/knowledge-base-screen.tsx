import { getApiClient } from "@/lib/session";
import {
  addDocumentAction,
  archiveKnowledgeBaseAction,
  removeDocumentAction,
  searchKnowledgeAction,
} from "../actions";
import { loadKnowledgeBase } from "../load-knowledge";
import { KnowledgeBaseView } from "./knowledge-base-view";

type KnowledgeBaseScreenProps = {
  organizationId: string;
  workspaceId: string;
  knowledgeBaseId: string;
};

export async function KnowledgeBaseScreen({ organizationId, workspaceId, knowledgeBaseId }: KnowledgeBaseScreenProps) {
  const result = await loadKnowledgeBase(await getApiClient(), organizationId, workspaceId, knowledgeBaseId);
  return (
    <KnowledgeBaseView
      result={result}
      backHref={`/org/${organizationId}/workspace/${workspaceId}/knowledge`}
      addDocument={addDocumentAction.bind(null, organizationId, workspaceId, knowledgeBaseId)}
      removeDocument={(documentId) => removeDocumentAction.bind(null, organizationId, workspaceId, knowledgeBaseId, documentId)}
      archive={archiveKnowledgeBaseAction.bind(null, organizationId, workspaceId, knowledgeBaseId)}
      search={searchKnowledgeAction.bind(null, organizationId, workspaceId, knowledgeBaseId)}
    />
  );
}
