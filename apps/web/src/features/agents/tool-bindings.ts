import type { StatusTone } from "@apothem/ui";

/** Same limit as apothem-api; the API validates again when the agent is published. */
export const MAX_TOOL_BINDINGS = 5;

export type ToolRisk = "read_only" | "reversible_write" | "irreversible";
export type ApprovalMode = "required" | "auto";
export type BindingMode = "off" | ApprovalMode;

/** One catalog entry as served by GET /v1/tools. */
export type ToolOption = {
  name: string;
  description: string;
  risk: ToolRisk;
  allowedApprovalModes: ApprovalMode[];
};

export type ToolBindingInput = { tool: string; approval: ApprovalMode };

const RISK_VIEW: Record<ToolRisk, { label: string; tone: StatusTone }> = {
  read_only: { label: "Read only", tone: "success" },
  reversible_write: { label: "Changes data (can be undone)", tone: "warning" },
  irreversible: { label: "Irreversible", tone: "danger" },
};

export function describeRisk(risk: ToolRisk): { label: string; tone: StatusTone } {
  return Object.hasOwn(RISK_VIEW, risk) ? RISK_VIEW[risk] : { label: "Unknown risk", tone: "neutral" };
}

/** Stored bindings -> one mode per catalog tool. Anything stale or malformed counts as off. */
export function bindingsToModes(bindings: unknown, tools: readonly ToolOption[]): Record<string, BindingMode> {
  const modes: Record<string, BindingMode> = Object.fromEntries(tools.map((tool) => [tool.name, "off" as const]));
  if (!Array.isArray(bindings)) return modes;
  for (const binding of bindings) {
    if (typeof binding !== "object" || binding === null) continue;
    const { tool, approval } = binding as { tool?: unknown; approval?: unknown };
    if (typeof tool !== "string" || !Object.hasOwn(modes, tool)) continue;
    if (approval === "required" || approval === "auto") modes[tool] = approval;
  }
  return modes;
}

export type ParsedBindings = { ok: true; value: ToolBindingInput[] } | { ok: false; message: string };

/**
 * Form -> bindings, in catalog order. Only catalog tools can appear, so the
 * form cannot invent a tool; apothem-api still validates again at publish time.
 */
export function parseToolBindingsForm(form: { get(key: string): unknown }, tools: readonly ToolOption[]): ParsedBindings {
  const bindings: ToolBindingInput[] = [];
  for (const tool of tools) {
    const raw = form.get(`tool:${tool.name}`);
    if (raw === null || raw === undefined || raw === "" || raw === "off") continue;
    if (raw !== "required" && raw !== "auto") {
      return { ok: false, message: "Choose off, ask first, or automatic for each tool." };
    }
    if (!tool.allowedApprovalModes.includes(raw)) {
      return { ok: false, message: "That tool can only run after a person approves it." };
    }
    bindings.push({ tool: tool.name, approval: raw });
  }
  if (bindings.length > MAX_TOOL_BINDINGS) {
    return { ok: false, message: `An agent can use at most ${MAX_TOOL_BINDINGS} tools.` };
  }
  return { ok: true, value: bindings };
}
