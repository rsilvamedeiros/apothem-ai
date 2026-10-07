import { listApprovals, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import type { ApprovalStatus, ApprovalView } from "../runs/run-view";

export type LoadApprovalsResult =
  | { kind: "ok"; approvals: ApprovalView[]; nextCursor: string | null }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

const STATUSES: readonly ApprovalStatus[] = ["pending", "approved", "rejected", "expired"];

const MESSAGES: Record<number, string> = {
  400: "That page of approvals is no longer valid. Start again from the latest ones.",
  401: "You need to sign in again.",
  403: "Only owners and admins can view the approval inbox.",
  404: "This workspace was not found.",
};

/** Never forwards API error bodies; an unknown status filter falls back to "pending". */
export async function loadApprovals(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  options: { cursor?: string; status?: string },
): Promise<LoadApprovalsResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) {
    return { kind: "error", message: "This workspace was not found." };
  }
  const status = STATUSES.find((candidate) => candidate === options.status) ?? "pending";

  try {
    const { data, response } = await listApprovals(client, organizationId, workspaceId, {
      status,
      ...(options.cursor ? { cursor: options.cursor } : {}),
    });
    if (response.status >= 400 || !data) {
      return { kind: "error", message: MESSAGES[response.status] ?? "Approvals could not be loaded. Try again shortly." };
    }
    return { kind: "ok", approvals: data.approvals as ApprovalView[], nextCursor: data.nextCursor };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
