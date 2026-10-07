import type { ApothemApiClient } from "./client";
import type { paths } from "./generated/schema";

type ListRunsQuery = NonNullable<
  paths["/v1/organizations/{organizationId}/workspaces/{workspaceId}/runs"]["get"]["parameters"]["query"]
>;

const RUNS = "/v1/organizations/{organizationId}/workspaces/{workspaceId}/runs" as const;

/** Starts and executes a run of the agent's active published version. The server decides everything except the task text. */
export async function startRun(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  input: { input: string; idempotencyKey?: string },
) {
  return client.POST("/v1/organizations/{organizationId}/workspaces/{workspaceId}/agents/{agentId}/runs", {
    params: { path: { organizationId, workspaceId, agentId } },
    body: input,
  });
}

export async function listRuns(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  query: ListRunsQuery = {},
) {
  return client.GET(RUNS, { params: { path: { organizationId, workspaceId }, query } });
}

export async function getRun(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  runId: string,
) {
  return client.GET(`${RUNS}/{runId}`, { params: { path: { organizationId, workspaceId, runId } } });
}
