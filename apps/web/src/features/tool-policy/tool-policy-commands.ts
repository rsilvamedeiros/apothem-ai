import { removeToolPolicy, setToolPolicy, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import type { RuleChange } from "./tool-policy-model";

export type ApplyChangesResult = { kind: "done"; applied: number } | { kind: "error"; message: string };

const MESSAGES: Record<number, string> = {
  400: "That rule was rejected. Review it and try again.",
  401: "You need to sign in again.",
  403: "Only owners and admins can change the tool policy.",
  404: "This workspace or tool was not found.",
};

/**
 * Applies the changes one by one and stops at the first refusal, so a person
 * never sees a success message for something that did not happen. The message
 * is fixed; API error bodies are never forwarded.
 */
export async function applyRuleChangesCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  changes: readonly RuleChange[],
): Promise<ApplyChangesResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) {
    return { kind: "error", message: "This workspace was not found." };
  }

  let applied = 0;
  try {
    for (const change of changes) {
      const { response } = change.rule
        ? await setToolPolicy(client, organizationId, workspaceId, change.tool, change.rule)
        : await removeToolPolicy(client, organizationId, workspaceId, change.tool);
      if (response.status >= 300) {
        const reason = MESSAGES[response.status] ?? "Something went wrong. Try again shortly.";
        return { kind: "error", message: applied > 0 ? `${reason} ${applied} earlier ${applied === 1 ? "change was" : "changes were"} saved.` : reason };
      }
      applied += 1;
    }
    return { kind: "done", applied };
  } catch (error) {
    if (isNetworkError(error)) {
      return { kind: "error", message: "apothem-api is unreachable. Try again shortly." };
    }
    throw error;
  }
}
