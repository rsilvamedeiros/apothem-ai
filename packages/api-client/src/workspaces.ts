import type { ApothemApiClient } from "./client";

export async function listWorkspaces(client: ApothemApiClient, organizationId: string) {
  return client.GET("/v1/organizations/{organizationId}/workspaces", {
    params: { path: { organizationId } },
  });
}

export async function createWorkspace(
  client: ApothemApiClient,
  organizationId: string,
  input: { name: string; slug: string },
) {
  return client.POST("/v1/organizations/{organizationId}/workspaces", {
    params: { path: { organizationId } },
    body: input,
  });
}

export async function getWorkspace(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
) {
  return client.GET("/v1/organizations/{organizationId}/workspaces/{workspaceId}", {
    params: { path: { organizationId, workspaceId } },
  });
}
