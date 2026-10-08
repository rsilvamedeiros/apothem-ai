import type { ApothemApiClient } from "@apothem/api-client";
import type { ActionState } from "@/lib/action-state";
import { loadKnowledgeBases } from "@/features/knowledge/load-knowledge";
import { saveDraftCommand } from "./agent-commands";
import { parseKnowledgeBindingsForm } from "./knowledge-bindings";

/**
 * Framework-free core of the save-knowledge server action. The bases are
 * loaded from the API on every save, so the form can only choose among real,
 * active bases of this workspace; apothem-api validates the bindings again
 * when the agent is published and scopes every retrieval by workspace.
 */
export async function submitKnowledgeBindings(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  form: { get(key: string): unknown },
): Promise<ActionState> {
  const bases = await loadKnowledgeBases(client, organizationId, workspaceId);
  if (bases.kind === "error") return { ok: false, message: bases.message };
  if (bases.kind === "unreachable") return { ok: false, message: "apothem-api is unreachable. Try again shortly." };

  const parsed = parseKnowledgeBindingsForm(form, bases.bases);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const result = await saveDraftCommand(client, organizationId, workspaceId, agentId, { knowledgeBindings: parsed.value });
  return result.kind === "saved"
    ? { ok: true, message: "Knowledge saved. It applies to the next version you publish." }
    : { ok: false, message: result.message };
}
