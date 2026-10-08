import type { ApothemApiClient } from "./client";

const POLICIES = "/v1/organizations/{organizationId}/workspaces/{workspaceId}/tool-policies" as const;

export type WorkspaceToolRule = "blocked" | "approval_required";

/** Anyone who can read agents may read the rules. */
export async function listToolPolicies(client: ApothemApiClient, organizationId: string, workspaceId: string) {
  return client.GET(POLICIES, { params: { path: { organizationId, workspaceId } } });
}

/** A rule is a ceiling: it can block a tool or force approval, never enable anything. Owners and admins only. */
export async function setToolPolicy(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  toolName: string,
  rule: WorkspaceToolRule,
) {
  return client.PUT(`${POLICIES}/{toolName}`, {
    params: { path: { organizationId, workspaceId, toolName } },
    body: { rule },
  });
}

export async function removeToolPolicy(client: ApothemApiClient, organizationId: string, workspaceId: string, toolName: string) {
  return client.DELETE(`${POLICIES}/{toolName}`, { params: { path: { organizationId, workspaceId, toolName } } });
}
