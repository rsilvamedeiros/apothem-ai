import { getApiClient } from "@/lib/session";
import {
  changeAgentStatusAction,
  publishAgentAction,
  saveDraftAction,
} from "../actions";
import { loadAgentDetail } from "../load-agent-detail";
import { AgentDetailView } from "./agent-detail-view";

type AgentDetailScreenProps = {
  organizationId: string;
  workspaceId: string;
  agentId: string;
};

export async function AgentDetailScreen({ organizationId, workspaceId, agentId }: AgentDetailScreenProps) {
  const client = await getApiClient();
  const result = await loadAgentDetail(client, organizationId, workspaceId, agentId);

  return (
    <AgentDetailView
      result={result}
      backHref={`/org/${organizationId}/workspace/${workspaceId}/agents`}
      saveDraft={saveDraftAction.bind(null, organizationId, workspaceId, agentId)}
      publish={publishAgentAction.bind(null, organizationId, workspaceId, agentId)}
      disable={changeAgentStatusAction.bind(null, "disable", organizationId, workspaceId, agentId)}
      archive={changeAgentStatusAction.bind(null, "archive", organizationId, workspaceId, agentId)}
    />
  );
}
