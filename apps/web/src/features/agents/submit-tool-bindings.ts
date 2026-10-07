import type { ApothemApiClient } from "@apothem/api-client";
import type { ActionState } from "@/lib/action-state";
import { saveDraftCommand } from "./agent-commands";
import { loadTools } from "./load-tools";
import { parseToolBindingsForm } from "./tool-bindings";

/**
 * Framework-free core of the save-tools server action. The catalog is loaded
 * from the API on every save, so the form can only choose among real tools;
 * apothem-api validates the bindings again when the agent is published.
 */
export async function submitToolBindings(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  form: { get(key: string): unknown },
): Promise<ActionState> {
  const catalog = await loadTools(client);
  if (catalog.kind === "error") return { ok: false, message: catalog.message };

  const parsed = parseToolBindingsForm(form, catalog.tools);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const result = await saveDraftCommand(client, organizationId, workspaceId, agentId, { toolBindings: parsed.value });
  return result.kind === "saved"
    ? { ok: true, message: "Tools saved. They apply to the next version you publish." }
    : { ok: false, message: result.message };
}
