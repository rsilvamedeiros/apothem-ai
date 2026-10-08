import { listToolPolicies, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import { rulesFromList, type ToolRules } from "./tool-policy-model";

export type LoadToolPoliciesResult =
  | { kind: "ok"; rules: ToolRules }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

const MESSAGES: Record<number, string> = {
  401: "You need to sign in again.",
  403: "You don't have access to this workspace's tool policy.",
  404: "This workspace was not found.",
};

/** Never forwards API error bodies. */
export async function loadToolPolicies(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
): Promise<LoadToolPoliciesResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) {
    return { kind: "error", message: MESSAGES[404]! };
  }

  try {
    const { data, response } = await listToolPolicies(client, organizationId, workspaceId);
    if (response.status >= 400 || !data) {
      return { kind: "error", message: MESSAGES[response.status] ?? "The tool policy could not be loaded. Try again shortly." };
    }
    return { kind: "ok", rules: rulesFromList(data.policies) };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
