import {
  archiveAgent,
  createAgent,
  disableAgent,
  publishAgent,
  updateAgentDraft,
  type ApothemApiClient,
} from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import { INSTRUCTIONS_MAX_LENGTH, type CreateAgentFieldErrors, type CreateAgentInput } from "./agent-form";

/**
 * Commands wrap API calls and translate every outcome into a fixed,
 * user-safe result. API error bodies are never forwarded to the UI.
 */
const UNREACHABLE = "apothem-api is unreachable. Try again shortly.";
const WORKSPACE_NOT_FOUND = "This workspace was not found.";
const SIGN_IN_AGAIN = "You need to sign in again.";
const GENERIC = "Something went wrong. Try again shortly.";

export type CreateAgentResult =
  | { kind: "created"; agentId: string }
  | { kind: "invalid"; errors: CreateAgentFieldErrors }
  | { kind: "error"; message: string };

export type PublishAgentResult =
  | { kind: "published"; versionNumber: number }
  | { kind: "error"; message: string };

async function guarded<T extends { kind: string }>(
  call: () => Promise<T>,
  onNetworkError: T,
): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (isNetworkError(error)) return onNetworkError;
    throw error;
  }
}

export async function createAgentCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  input: CreateAgentInput,
): Promise<CreateAgentResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) {
    return { kind: "error", message: WORKSPACE_NOT_FOUND };
  }

  return guarded<CreateAgentResult>(
    async () => {
      const { data, response } = await createAgent(client, organizationId, workspaceId, input);
      if (response.status < 300 && data?.agent?.id) {
        return { kind: "created", agentId: data.agent.id };
      }
      switch (response.status) {
        case 409:
          return { kind: "invalid", errors: { slug: "This slug is already used in this workspace." } };
        case 400:
          return { kind: "error", message: "Some fields are invalid. Review the form and try again." };
        case 401:
          return { kind: "error", message: SIGN_IN_AGAIN };
        case 403:
          return { kind: "error", message: "You don't have permission to create agents in this workspace." };
        case 404:
          return { kind: "error", message: WORKSPACE_NOT_FOUND };
        default:
          return { kind: "error", message: GENERIC };
      }
    },
    { kind: "error", message: UNREACHABLE },
  );
}

export async function publishAgentCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
): Promise<PublishAgentResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(agentId)) {
    return { kind: "error", message: "This agent was not found." };
  }

  return guarded<PublishAgentResult>(
    async () => {
      const { data, response } = await publishAgent(client, organizationId, workspaceId, agentId);
      if (response.status < 300 && data) {
        return { kind: "published", versionNumber: data.versionNumber };
      }
      switch (response.status) {
        case 400:
          return { kind: "error", message: "Add instructions to the draft before publishing." };
        case 401:
          return { kind: "error", message: SIGN_IN_AGAIN };
        case 403:
          return { kind: "error", message: "You don't have permission to publish agents." };
        case 404:
          return { kind: "error", message: "This agent was not found." };
        case 409:
          return { kind: "error", message: "This agent is archived and cannot be published." };
        default:
          return { kind: "error", message: GENERIC };
      }
    },
    { kind: "error", message: UNREACHABLE },
  );
}

export type SaveDraftResult = { kind: "saved" } | { kind: "error"; message: string };
export type ChangeStatusResult = { kind: "done" } | { kind: "error"; message: string };

const AGENT_NOT_FOUND = "This agent was not found.";

export async function saveDraftCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  patch: { instructions: string },
): Promise<SaveDraftResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(agentId)) {
    return { kind: "error", message: AGENT_NOT_FOUND };
  }
  if (patch.instructions.length > INSTRUCTIONS_MAX_LENGTH) {
    return { kind: "error", message: "Instructions are limited to 50,000 characters." };
  }

  return guarded<SaveDraftResult>(
    async () => {
      const { response } = await updateAgentDraft(client, organizationId, workspaceId, agentId, patch);
      if (response.status < 300) return { kind: "saved" };
      switch (response.status) {
        case 401:
          return { kind: "error", message: SIGN_IN_AGAIN };
        case 403:
          return { kind: "error", message: "You don't have permission to edit this agent." };
        case 404:
          return { kind: "error", message: AGENT_NOT_FOUND };
        case 409:
          return { kind: "error", message: "This agent is archived and cannot be edited." };
        case 400:
          return { kind: "error", message: "The instructions were rejected. Review them and try again." };
        default:
          return { kind: "error", message: GENERIC };
      }
    },
    { kind: "error", message: UNREACHABLE },
  );
}

export async function changeAgentStatusCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  action: "disable" | "archive",
): Promise<ChangeStatusResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(agentId)) {
    return { kind: "error", message: AGENT_NOT_FOUND };
  }

  return guarded<ChangeStatusResult>(
    async () => {
      const call = action === "disable" ? disableAgent : archiveAgent;
      const { response } = await call(client, organizationId, workspaceId, agentId);
      if (response.status < 300) return { kind: "done" };
      switch (response.status) {
        case 401:
          return { kind: "error", message: SIGN_IN_AGAIN };
        case 403:
          return { kind: "error", message: "You don't have permission to change this agent." };
        case 404:
          return { kind: "error", message: AGENT_NOT_FOUND };
        case 409:
          return { kind: "error", message: "Archived agents cannot change status." };
        default:
          return { kind: "error", message: GENERIC };
      }
    },
    { kind: "error", message: UNREACHABLE },
  );
}
