import { getApiClient } from "@/lib/session";
import {
  changeAgentStatusAction,
  saveKnowledgeBindingsAction,
  saveToolBindingsAction,
  publishAgentAction,
  saveDraftAction,
} from "../actions";
import { startRunAction } from "@/features/runs/actions";
import { loadTools } from "../load-tools";
import { loadKnowledgeBases } from "@/features/knowledge/load-knowledge";
import { loadAgentDetail } from "../load-agent-detail";
import { AgentDetailView } from "./agent-detail-view";

type AgentDetailScreenProps = {
  organizationId: string;
  workspaceId: string;
  agentId: string;
};

export async function AgentDetailScreen({ organizationId, workspaceId, agentId }: AgentDetailScreenProps) {
  const client = await getApiClient();
  const [result, tools, knowledge] = await Promise.all([
    loadAgentDetail(client, organizationId, workspaceId, agentId),
    loadTools(client),
    loadKnowledgeBases(client, organizationId, workspaceId),
  ]);

  return (
    <AgentDetailView
      result={result}
      backHref={`/org/${organizationId}/workspace/${workspaceId}/agents`}
      saveDraft={saveDraftAction.bind(null, organizationId, workspaceId, agentId)}
      publish={publishAgentAction.bind(null, organizationId, workspaceId, agentId)}
      disable={changeAgentStatusAction.bind(null, "disable", organizationId, workspaceId, agentId)}
      archive={changeAgentStatusAction.bind(null, "archive", organizationId, workspaceId, agentId)}
      saveTools={saveToolBindingsAction.bind(null, organizationId, workspaceId, agentId)}
      tools={tools}
      saveKnowledge={saveKnowledgeBindingsAction.bind(null, organizationId, workspaceId, agentId)}
      knowledge={knowledge}
      knowledgeHref={`/org/${organizationId}/workspace/${workspaceId}/knowledge`}
      startRun={startRunAction.bind(null, organizationId, workspaceId, agentId)}
      runBasePath={`/org/${organizationId}/workspace/${workspaceId}/runs`}
    />
  );
}
