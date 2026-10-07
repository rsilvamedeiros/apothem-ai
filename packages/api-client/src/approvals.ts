import type { ApothemApiClient } from "./client";
import type { paths } from "./generated/schema";

type ListQuery = NonNullable<
  paths["/v1/organizations/{organizationId}/workspaces/{workspaceId}/approvals"]["get"]["parameters"]["query"]
>;

export type ApprovalDecision = "approve" | "reject";

const APPROVALS = "/v1/organizations/{organizationId}/workspaces/{workspaceId}/approvals" as const;

/** The approval inbox. Only owners and admins may read it. */
export async function listApprovals(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  query: ListQuery = {},
) {
  return client.GET(APPROVALS, { params: { path: { organizationId, workspaceId }, query } });
}

/** Approving executes the persisted proposal exactly once; rejecting performs no action. */
export async function decideApproval(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  approvalId: string,
  input: { decision: ApprovalDecision; reason?: string },
) {
  return client.POST(`${APPROVALS}/{approvalId}/decision`, {
    params: { path: { organizationId, workspaceId, approvalId } },
    body: input,
  });
}
