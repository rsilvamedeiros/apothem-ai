import type { ChangeStatusResult, PublishAgentResult, SaveDraftResult } from "./agent-commands";
import type { ActionState } from "./components/action-state";

export function saveDraftState(result: SaveDraftResult): ActionState {
  return result.kind === "saved"
    ? { ok: true, message: "Draft saved." }
    : { ok: false, message: result.message };
}

export function publishState(result: PublishAgentResult): ActionState {
  return result.kind === "published"
    ? { ok: true, message: `Published version ${result.versionNumber}.` }
    : { ok: false, message: result.message };
}

export function changeStatusState(
  action: "disable" | "archive",
  result: ChangeStatusResult,
): ActionState {
  if (result.kind === "error") return { ok: false, message: result.message };
  return { ok: true, message: action === "disable" ? "Agent disabled." : "Agent archived." };
}
