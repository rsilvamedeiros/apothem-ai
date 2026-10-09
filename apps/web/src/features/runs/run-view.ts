import type { StatusTone } from "@apothem/ui";

/** Same limit as apothem-api; the API validates again and its answer wins. */
export const MAX_RUN_INPUT_LENGTH = 20_000;

export type RunStatus = "queued" | "running" | "waiting_approval" | "completed" | "failed" | "cancelled";

/** Mirrors the API's run response; presentation only. */
export type RunView = {
  id: string;
  agentId: string;
  agentVersionId: string;
  requestedByPrincipalId: string;
  status: RunStatus;
  input: { text: string };
  output: { text: string } | null;
  errorCode: string | null;
  errorMessage: string | null;
  modelProvider: string | null;
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
};

export type RunStepView = {
  id: string;
  sequence: number;
  type: string;
  status: string;
  modelProvider: string | null;
  model: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  finishReason: string | null;
  durationMs: number | null;
  errorCode: string | null;
};

const STATUS_VIEW: Record<RunStatus, { label: string; tone: StatusTone }> = {
  queued: { label: "Queued", tone: "neutral" },
  running: { label: "Running", tone: "info" },
  waiting_approval: { label: "Waiting for approval", tone: "warning" },
  completed: { label: "Completed", tone: "success" },
  failed: { label: "Failed", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "warning" },
};

export function describeRunStatus(status: RunStatus): { label: string; tone: StatusTone } {
  return Object.hasOwn(STATUS_VIEW, status) ? STATUS_VIEW[status] : { label: "Unknown", tone: "neutral" };
}

const ERROR_GUIDANCE: Record<string, { title: string; hint: string }> = {
  RUN_CONFIG_INVALID: {
    title: "The agent version is misconfigured",
    hint: "Fix the model policy or guardrails in the draft and publish a new version.",
  },
  MODEL_POLICY_NO_ROUTE: {
    title: "No approved model matches this agent",
    hint: "Relax the model policy (providers, capabilities, quality tier or cost budget) and publish again.",
  },
  MODEL_PROVIDER_UNAVAILABLE: {
    title: "The model provider is unavailable",
    hint: "This is usually temporary. Try again in a moment.",
  },
  MODEL_REQUEST_REJECTED: {
    title: "The model rejected the request",
    hint: "Rephrase the task or review the agent instructions for content the provider refuses.",
  },
  RUN_BUDGET_EXCEEDED: {
    title: "The run took too long",
    hint: "Shorten the task, or raise the time limit in the agent guardrails (up to 60 seconds).",
  },
  TOOL_NOT_BOUND: {
    title: "The model asked for a tool this agent does not have",
    hint: "Bind the tool to the agent and publish a new version, or adjust the instructions so the agent answers directly.",
  },
  TOOL_BLOCKED_BY_POLICY: {
    title: "A workspace policy does not allow this tool",
    hint: "An owner or admin blocked this tool for the workspace, so nothing was done. Ask them to change the policy in workspace settings, or adjust the agent.",
  },
  TOOL_ARGUMENT_INVALID: {
    title: "The model proposed an invalid action",
    hint: "Its arguments did not match the tool contract, so nothing was done. Clarify the instructions and try again.",
  },
  TOOL_LIMIT_EXCEEDED: {
    title: "The agent reached its tool call limit",
    hint: "A run may use at most 3 tools. Simplify the task or the instructions.",
  },
  TOOL_EXECUTION_FAILED: {
    title: "A tool could not complete its action",
    hint: "Nothing further was done. Try again; if it keeps failing, contact support with the run id.",
  },
  APPROVAL_REJECTED: {
    title: "A person rejected the proposed action",
    hint: "The action was not performed. Start a new run if you still need it.",
  },
  APPROVAL_EXPIRED: {
    title: "The approval request expired",
    hint: "Nobody decided in time, so the action was not performed. Start a new run to ask again.",
  },
  APPROVAL_INVALIDATED: {
    title: "The approval no longer applied",
    hint: "The agent was disabled or archived, or a workspace policy blocked the tool, before the decision, so the action was not performed.",
  },
  RUN_INTERNAL_ERROR: {
    title: "The run failed unexpectedly",
    hint: "Try again. If it keeps failing, contact support with the run id.",
  },
};

const GENERIC_GUIDANCE = { title: "The run failed", hint: "Try again. If it keeps failing, contact support with the run id." };

/** Unknown codes never reach the screen; only known guidance does. */
export function describeRunError(code: string | null): { title: string; hint: string } {
  return code !== null && Object.hasOwn(ERROR_GUIDANCE, code) ? ERROR_GUIDANCE[code]! : GENERIC_GUIDANCE;
}

export function formatDuration(milliseconds: number | null): string {
  if (milliseconds === null) return "—";
  if (milliseconds < 1000) return `${milliseconds} ms`;
  return `${Number((milliseconds / 1000).toFixed(1))} s`;
}

/** A passage the run read from knowledge: identity and location only, never the text. */
export type RunSourceView = {
  stepSequence: number;
  evidenceId: string;
  title: string;
  section: string | null;
  ordinal: number;
};

export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";

/** Mirrors the API's approval response; presentation only. */
export type ApprovalView = {
  id: string;
  runId: string;
  agentId: string;
  stepSequence: number;
  toolName: string;
  arguments: Record<string, unknown>;
  requestedByPrincipalId: string;
  status: ApprovalStatus;
  expiresAt: string;
  decidedByPrincipalId: string | null;
  decisionReason: string | null;
  selfApproved: boolean;
  decidedAt: string | null;
  createdAt: string;
};

const APPROVAL_STATUS_VIEW: Record<ApprovalStatus, { label: string; tone: StatusTone }> = {
  pending: { label: "Pending", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  expired: { label: "Expired", tone: "neutral" },
};

export function describeApprovalStatus(status: ApprovalStatus): { label: string; tone: StatusTone } {
  return Object.hasOwn(APPROVAL_STATUS_VIEW, status) ? APPROVAL_STATUS_VIEW[status] : { label: "Unknown", tone: "neutral" };
}

/** "create_note" -> "Create note". Display only; the catalog name stays the identity. */
export function formatToolName(name: string): string {
  const words = name.split("_").filter((word) => word.length > 0);
  const text = words.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}
