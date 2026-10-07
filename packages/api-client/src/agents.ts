import type { ApothemApiClient } from "./client";
import type { paths } from "./generated/schema";

type AgentDraftPatch = NonNullable<
  paths["/v1/organizations/{organizationId}/workspaces/{workspaceId}/agents/{agentId}/draft"]["patch"]["requestBody"]
>["content"]["application/json"];

const AGENTS = "/v1/organizations/{organizationId}/workspaces/{workspaceId}/agents" as const;
const AGENT = `${AGENTS}/{agentId}` as const;

function workspaceParams(organizationId: string, workspaceId: string) {
  return { organizationId, workspaceId };
}

function agentParams(organizationId: string, workspaceId: string, agentId: string) {
  return { organizationId, workspaceId, agentId };
}

export async function listAgents(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
) {
  return client.GET(AGENTS, { params: { path: workspaceParams(organizationId, workspaceId) } });
}

export async function createAgent(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  input: { name: string; slug: string; description?: string },
) {
  return client.POST(AGENTS, {
    params: { path: workspaceParams(organizationId, workspaceId) },
    body: input,
  });
}

export async function getAgent(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
) {
  return client.GET(AGENT, {
    params: { path: agentParams(organizationId, workspaceId, agentId) },
  });
}

export async function updateAgentDraft(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  patch: AgentDraftPatch,
) {
  return client.PATCH(`${AGENT}/draft`, {
    params: { path: agentParams(organizationId, workspaceId, agentId) },
    body: patch,
  });
}

export async function publishAgent(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
) {
  return client.POST(`${AGENT}/publish`, {
    params: { path: agentParams(organizationId, workspaceId, agentId) },
  });
}

export async function disableAgent(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
) {
  return client.POST(`${AGENT}/disable`, {
    params: { path: agentParams(organizationId, workspaceId, agentId) },
  });
}

export async function archiveAgent(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
) {
  return client.POST(`${AGENT}/archive`, {
    params: { path: agentParams(organizationId, workspaceId, agentId) },
  });
}

export async function listAgentVersions(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
) {
  return client.GET(`${AGENT}/versions`, {
    params: { path: agentParams(organizationId, workspaceId, agentId) },
  });
}
