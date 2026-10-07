import type { StatusTone } from "@apothem/ui";

export type AgentStatus = "draft" | "active" | "disabled" | "archived";

const STATUS_VIEW: Record<AgentStatus, { label: string; tone: StatusTone }> = {
  draft: { label: "Draft", tone: "neutral" },
  active: { label: "Active", tone: "success" },
  disabled: { label: "Disabled", tone: "warning" },
  archived: { label: "Archived", tone: "neutral" },
};

/** Presentation only — the API owns what each status allows. */
export function describeAgentStatus(status: AgentStatus): { label: string; tone: StatusTone } {
  return Object.hasOwn(STATUS_VIEW, status)
    ? STATUS_VIEW[status]
    : { label: "Unknown", tone: "neutral" };
}
