import type { StatusTone } from "@apothem/ui";

export type RunStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

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
    hint: "Tools are not available yet. Adjust the instructions so the agent answers directly.",
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
