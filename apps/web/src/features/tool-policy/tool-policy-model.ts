import type { WorkspaceToolRule } from "@apothem/api-client";
import type { StatusTone } from "@apothem/ui";

export type { WorkspaceToolRule };
export type RuleChoice = "none" | WorkspaceToolRule;
export type ToolRules = Record<string, WorkspaceToolRule>;
export type RuleChange = { tool: string; rule: WorkspaceToolRule | null };

export const RULE_OPTIONS: readonly { value: RuleChoice; label: string }[] = [
  { value: "none", label: "No workspace rule" },
  { value: "approval_required", label: "Always ask a person first" },
  { value: "blocked", label: "Blocked" },
];

const RULE_VIEW: Record<WorkspaceToolRule, { label: string; tone: StatusTone }> = {
  blocked: { label: "Blocked in this workspace", tone: "danger" },
  approval_required: { label: "Always asks first in this workspace", tone: "warning" },
};

export function describeRule(rule: string | undefined): { label: string; tone: StatusTone } | undefined {
  return rule !== undefined && Object.hasOwn(RULE_VIEW, rule) ? RULE_VIEW[rule as WorkspaceToolRule] : undefined;
}

/** API list -> one rule per tool. Anything malformed or unknown is ignored rather than guessed. */
export function rulesFromList(policies: unknown): ToolRules {
  const rules: ToolRules = {};
  if (!Array.isArray(policies)) return rules;
  for (const policy of policies) {
    if (typeof policy !== "object" || policy === null) continue;
    const { toolName, rule } = policy as { toolName?: unknown; rule?: unknown };
    if (typeof toolName === "string" && (rule === "blocked" || rule === "approval_required")) rules[toolName] = rule;
  }
  return rules;
}

export type ParsedRules = { ok: true; changes: RuleChange[] } | { ok: false; message: string };

/**
 * Form -> the changes to make, compared with the rules the server just
 * returned. Only catalog tools can appear, so the form cannot invent a tool; a
 * tool missing from the form is left as it is.
 */
export function parseRulesForm(
  form: { get(key: string): unknown },
  tools: readonly { name: string }[],
  current: ToolRules,
): ParsedRules {
  const changes: RuleChange[] = [];
  for (const tool of tools) {
    const raw = form.get(`rule:${tool.name}`);
    if (raw === null || raw === undefined) continue;
    if (raw !== "none" && raw !== "blocked" && raw !== "approval_required") {
      return { ok: false, message: "Choose no rule, always ask first, or blocked for each tool." };
    }
    const wanted = raw === "none" ? null : raw;
    const existing = Object.hasOwn(current, tool.name) ? current[tool.name]! : null;
    if (wanted !== existing) changes.push({ tool: tool.name, rule: wanted });
  }
  return { ok: true, changes };
}
