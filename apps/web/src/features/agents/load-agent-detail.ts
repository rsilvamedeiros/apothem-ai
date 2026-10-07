import {
  getAgent,
  listAgentVersions,
  type ApothemApiClient,
} from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import type { AgentStatus } from "./agent-status";

export type AgentDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: AgentStatus;
  activeVersionId: string | null;
};

export type AgentDraftView = { instructions: string; toolBindings: unknown; updatedAt: string };

export type AgentVersionView = {
  id: string;
  versionNumber: number;
  checksum: string;
  createdAt: string;
};

export type LoadAgentDetailResult =
  | { kind: "ok"; agent: AgentDetail; draft: AgentDraftView; versions: AgentVersionView[] }
  | { kind: "not_found" }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

export async function loadAgentDetail(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
): Promise<LoadAgentDetailResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(agentId)) {
    return { kind: "not_found" };
  }

  try {
    const [agentResult, versionsResult] = await Promise.all([
      getAgent(client, organizationId, workspaceId, agentId),
      listAgentVersions(client, organizationId, workspaceId, agentId),
    ]);

    const status = agentResult.response.status;
    if (status === 404) return { kind: "not_found" };
    if (status === 401) return { kind: "error", message: "You need to sign in again." };
    if (status === 403) return { kind: "error", message: "You don't have access to this agent." };
    if (status >= 400 || !agentResult.data) {
      return { kind: "error", message: "The agent could not be loaded. Try again shortly." };
    }

    return {
      kind: "ok",
      agent: agentResult.data.agent as AgentDetail,
      draft: agentResult.data.draft as AgentDraftView,
      versions: versionsResult.response.status < 300 ? ((versionsResult.data ?? []) as AgentVersionView[]) : [],
    };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
