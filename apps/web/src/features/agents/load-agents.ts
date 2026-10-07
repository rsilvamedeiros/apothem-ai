import { listAgents, type ApothemApiClient } from "@apothem/api-client";
import { isNetworkError } from "@/lib/mock";
import type { AgentListItem } from "./components/agent-list";

export type LoadAgentsResult =
  | { kind: "ok"; agents: AgentListItem[] }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

const STATUS_MESSAGES: Record<number, string> = {
  401: "You need to sign in again.",
  403: "You don't have access to agents in this workspace.",
  404: "This workspace was not found.",
};

const GENERIC_MESSAGE = "Agents could not be loaded. Try again shortly.";

/** Never forwards API error bodies to the UI; messages are fixed per status. */
export async function loadAgents(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
): Promise<LoadAgentsResult> {
  try {
    const { data, response } = await listAgents(client, organizationId, workspaceId);
    if (response.status >= 400) {
      return { kind: "error", message: STATUS_MESSAGES[response.status] ?? GENERIC_MESSAGE };
    }
    return { kind: "ok", agents: (data ?? []) as AgentListItem[] };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
