import { startRun, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import { MAX_RUN_INPUT_LENGTH, type RunView } from "./run-view";

export { MAX_RUN_INPUT_LENGTH };

export type StartRunResult = { kind: "done"; run: RunView } | { kind: "error"; message: string };

const MESSAGES: Record<number, string> = {
  400: "The task was rejected. Review it and try again.",
  401: "You need to sign in again.",
  403: "You don't have permission to run this agent.",
  404: "This agent was not found.",
  409: "This agent cannot run right now. Publish it first; disabled and archived agents cannot run.",
};

/**
 * Starts a run. A run that ends `failed` is still a successful call: the
 * failure is part of the durable record and is shown to the user, so only
 * transport and permission problems are reported as errors here.
 */
export async function startRunCommand(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  task: string,
  idempotencyKey: string,
): Promise<StartRunResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(agentId)) {
    return { kind: "error", message: "This agent was not found." };
  }
  const input = task.trim();
  if (input.length === 0 || input.length > MAX_RUN_INPUT_LENGTH) {
    return { kind: "error", message: `Enter a task between 1 and ${MAX_RUN_INPUT_LENGTH} characters.` };
  }

  try {
    const { data, response } = await startRun(client, organizationId, workspaceId, agentId, { input, idempotencyKey });
    if (response.status < 300 && data?.run) return { kind: "done", run: data.run as RunView };
    return { kind: "error", message: MESSAGES[response.status] ?? "Something went wrong. Try again shortly." };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "error", message: "apothem-api is unreachable. Try again shortly." };
    throw error;
  }
}
