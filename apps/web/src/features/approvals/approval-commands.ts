import { decideApproval, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";

/** Same limit as apothem-api; the API validates again and its answer wins. */
export const MAX_DECISION_REASON_LENGTH = 500;

export type DecideApprovalResult = { kind: "done"; message: string } | { kind: "error"; message: string };

const MESSAGES: Record<number, string> = {
  400: "That decision was rejected. Review it and try again.",
  401: "You need to sign in again.",
  403: "You can't decide this approval. Only owners and admins can, and not their own request while another approver is available.",
  404: "This approval was not found.",
  409: "This approval can no longer be decided: it was already decided, expired, or the agent changed.",
};

function outcomeMessage(decision: "approve" | "reject", runStatus: string): string {
  if (decision === "reject") return "Rejected. Nothing was done.";
  if (runStatus === "completed") return "Approved. The action was performed and the run completed.";
  if (runStatus === "waiting_approval") return "Approved. The agent now needs another approval.";
  return "Approved, but the action could not be completed. See the run for details.";
}

/**
 * Approving executes the persisted proposal on the server exactly once;
 * rejecting performs no action. Messages are fixed, never API error bodies.
 */
export async function decideApprovalCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  approvalId: string,
  decision: string,
  reason: string | undefined,
): Promise<DecideApprovalResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(approvalId)) {
    return { kind: "error", message: "This approval was not found." };
  }
  if (decision !== "approve" && decision !== "reject") {
    return { kind: "error", message: "Choose approve or reject." };
  }
  const trimmed = reason?.trim() ?? "";
  if (trimmed.length > MAX_DECISION_REASON_LENGTH) {
    return { kind: "error", message: `Keep the reason under ${MAX_DECISION_REASON_LENGTH} characters.` };
  }

  try {
    const { data, response } = await decideApproval(client, organizationId, workspaceId, approvalId, {
      decision,
      ...(trimmed ? { reason: trimmed } : {}),
    });
    if (response.status < 300 && data?.approval && data.run) {
      return { kind: "done", message: outcomeMessage(decision, data.run.status) };
    }
    return { kind: "error", message: MESSAGES[response.status] ?? "Something went wrong. Try again shortly." };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "error", message: "apothem-api is unreachable. Try again shortly." };
    throw error;
  }
}
