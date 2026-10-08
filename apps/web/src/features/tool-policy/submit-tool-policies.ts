import type { ApothemApiClient } from "@apothem/api-client";
import type { ActionState } from "@/lib/action-state";
import { loadTools } from "@/features/agents/load-tools";
import { applyRuleChangesCommand } from "./tool-policy-commands";
import { loadToolPolicies } from "./load-tool-policies";
import { parseRulesForm } from "./tool-policy-model";

/**
 * Framework-free core of the save-policy server action. The catalog and the
 * current rules are loaded from the API on every save, so the form can only
 * choose among real tools and only real differences are sent; apothem-api
 * checks permission and the tool again for every change.
 */
export async function submitToolPolicies(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  form: { get(key: string): unknown },
): Promise<ActionState> {
  const catalog = await loadTools(client);
  if (catalog.kind === "error") return { ok: false, message: catalog.message };

  const current = await loadToolPolicies(client, organizationId, workspaceId);
  if (current.kind === "error") return { ok: false, message: current.message };
  if (current.kind === "unreachable") return { ok: false, message: "apothem-api is unreachable. Try again shortly." };

  const parsed = parseRulesForm(form, catalog.tools, current.rules);
  if (!parsed.ok) return { ok: false, message: parsed.message };
  if (parsed.changes.length === 0) return { ok: true, message: "Nothing changed." };

  const result = await applyRuleChangesCommand(client, organizationId, workspaceId, parsed.changes);
  return result.kind === "done"
    ? { ok: true, message: "Tool policy saved. It applies to the next run." }
    : { ok: false, message: result.message };
}
