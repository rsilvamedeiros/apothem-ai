import type { ApothemApiClient } from "@apothem/api-client";
import { startRunCommand } from "./run-commands";
import type { RunPanelState } from "./components/run-panel";

const IDEMPOTENCY_KEY = /^[A-Za-z0-9_.:-]{1,100}$/;

function text(form: { get(key: string): unknown }, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Framework-free core of the start-run server action. Tenant and agent ids
 * come from the route (bound by the page), never from form fields. The key
 * comes from the form so a double submit replays one run; a missing or
 * malformed key is replaced rather than trusted.
 */
export async function submitRun(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  agentId: string,
  form: { get(key: string): unknown },
): Promise<RunPanelState> {
  const supplied = text(form, "idempotencyKey");
  const idempotencyKey = IDEMPOTENCY_KEY.test(supplied) ? supplied : crypto.randomUUID();

  const result = await startRunCommand(client, organizationId, workspaceId, agentId, text(form, "task"), idempotencyKey);
  return result.kind === "done" ? { run: result.run } : { message: result.message };
}
