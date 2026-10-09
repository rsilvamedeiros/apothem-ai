import { getApprovalSummary, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";

/**
 * The count is a courtesy shown on every page of the workspace, so anything
 * that is not a clean answer (no permission, API down, malformed data) simply
 * hides it. It never blocks navigation and never shows a guess.
 */
export type ApprovalSummaryResult = { kind: "ok"; pending: number } | { kind: "hidden" };

export async function loadApprovalSummary(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
): Promise<ApprovalSummaryResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) return { kind: "hidden" };

  try {
    const { data, response } = await getApprovalSummary(client, organizationId, workspaceId);
    if (response.status >= 400 || !data) return { kind: "hidden" };
    const { pending } = data;
    return Number.isInteger(pending) && pending >= 0 ? { kind: "ok", pending } : { kind: "hidden" };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "hidden" };
    throw error;
  }
}
