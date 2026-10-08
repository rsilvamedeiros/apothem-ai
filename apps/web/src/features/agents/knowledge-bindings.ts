import { isUuid } from "@/lib/ids";
import { KNOWLEDGE_LIMITS, type KnowledgeBaseView } from "@/features/knowledge/knowledge-model";

/** The tool an agent needs, in addition to the bindings below, to search knowledge. */
export const SEARCH_KNOWLEDGE_TOOL = "search_knowledge";

export type KnowledgeBindingInput = { knowledgeBaseId: string };

/** Stored bindings -> the ids they name. Anything malformed or repeated is ignored. */
export function bindingsToSelection(bindings: unknown): string[] {
  if (!Array.isArray(bindings)) return [];
  const ids: string[] = [];
  for (const binding of bindings) {
    if (typeof binding !== "object" || binding === null) continue;
    const { knowledgeBaseId } = binding as { knowledgeBaseId?: unknown };
    if (typeof knowledgeBaseId === "string" && isUuid(knowledgeBaseId) && !ids.includes(knowledgeBaseId)) ids.push(knowledgeBaseId);
  }
  return ids;
}

/** True when the saved tool bindings let the agent call the search tool. */
export function hasSearchTool(toolBindings: unknown): boolean {
  if (!Array.isArray(toolBindings)) return false;
  return toolBindings.some(
    (binding) => typeof binding === "object" && binding !== null && (binding as { tool?: unknown }).tool === SEARCH_KNOWLEDGE_TOOL,
  );
}

/** How many saved ids point at a base that is archived or no longer there: they would retrieve nothing. */
export function countUnavailable(selection: readonly string[], bases: readonly KnowledgeBaseView[]): number {
  const active = new Set(bases.filter((base) => base.status === "active").map((base) => base.id));
  return selection.filter((id) => !active.has(id)).length;
}

export type ParsedKnowledgeBindings = { ok: true; value: KnowledgeBindingInput[] } | { ok: false; message: string };

/**
 * Form -> bindings, in the order the bases were listed. Only active bases the
 * API just returned can appear, so the form cannot invent an id; apothem-api
 * validates again at publish time and scopes retrieval by workspace.
 */
export function parseKnowledgeBindingsForm(form: { get(key: string): unknown }, bases: readonly KnowledgeBaseView[]): ParsedKnowledgeBindings {
  const value = bases
    .filter((base) => base.status === "active" && form.get(`base:${base.id}`) === "on")
    .map((base) => ({ knowledgeBaseId: base.id }));
  if (value.length > KNOWLEDGE_LIMITS.bindings) {
    return { ok: false, message: `An agent can use at most ${KNOWLEDGE_LIMITS.bindings} knowledge bases.` };
  }
  return { ok: true, value };
}
