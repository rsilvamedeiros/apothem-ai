"use server";

import type { ActionState } from "@/lib/action-state";
import { getApiClient } from "@/lib/session";
import { decideApprovalCommand } from "./approval-commands";

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/**
 * Tenant and approval ids come from the route (bound by the page), never from
 * form fields; apothem-api re-checks permission and separation of duties.
 *
 * Nothing is revalidated on purpose. A server action that revalidates also
 * refreshes the page it was called from, and the decided card would vanish
 * from the "pending" list together with the outcome message the person needs
 * to read. Pages here are dynamic, so the next visit loads fresh data anyway.
 */
export async function decideApprovalAction(
  organizationId: string,
  workspaceId: string,
  approvalId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await decideApprovalCommand(
    await getApiClient(),
    organizationId,
    workspaceId,
    approvalId,
    text(formData, "decision"),
    text(formData, "reason"),
  );
  return { ok: result.kind === "done", message: result.message };
}
