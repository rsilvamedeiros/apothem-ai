import { getRun, listRuns, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import type { ApprovalView, RunStepView, RunView } from "./run-view";

export type LoadRunsResult =
  | { kind: "ok"; runs: RunView[]; nextCursor: string | null }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

export type LoadRunResult =
  | { kind: "ok"; run: RunView; steps: RunStepView[]; approvals: ApprovalView[] }
  | { kind: "not_found" }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

const LIST_MESSAGES: Record<number, string> = {
  400: "That page of runs is no longer valid. Start again from the latest runs.",
  401: "You need to sign in again.",
  403: "You do not have permission to view runs.",
  404: "This workspace was not found.",
};

/** Never forwards API error bodies; messages are fixed per status. */
export async function loadRuns(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  options: { cursor?: string; agentId?: string },
): Promise<LoadRunsResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId)) {
    return { kind: "error", message: "This workspace was not found." };
  }
  try {
    const { data, response } = await listRuns(client, organizationId, workspaceId, {
      ...(options.cursor ? { cursor: options.cursor } : {}),
      ...(options.agentId && isUuid(options.agentId) ? { agentId: options.agentId } : {}),
    });
    if (response.status >= 400 || !data) {
      return { kind: "error", message: LIST_MESSAGES[response.status] ?? "Runs could not be loaded. Try again shortly." };
    }
    return { kind: "ok", runs: data.runs as RunView[], nextCursor: data.nextCursor };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}

export async function loadRun(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  runId: string,
): Promise<LoadRunResult> {
  if (!isUuid(organizationId) || !isUuid(workspaceId) || !isUuid(runId)) return { kind: "not_found" };
  try {
    const { data, response } = await getRun(client, organizationId, workspaceId, runId);
    if (response.status === 404) return { kind: "not_found" };
    if (response.status >= 400 || !data) {
      return {
        kind: "error",
        message: response.status === 401 || response.status === 403 ? LIST_MESSAGES[response.status]! : "The run could not be loaded. Try again shortly.",
      };
    }
    return {
      kind: "ok",
      run: data.run as RunView,
      steps: data.steps as RunStepView[],
      approvals: data.approvals as ApprovalView[],
    };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
