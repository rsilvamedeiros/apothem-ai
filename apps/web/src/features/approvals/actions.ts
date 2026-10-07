"use server";

import { revalidatePath } from "next/cache";
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
  if (result.kind === "done") {
    const base = `/org/${organizationId}/workspace/${workspaceId}`;
    revalidatePath(`${base}/approvals`);
    revalidatePath(`${base}/runs`);
  }
  return { ok: result.kind === "done", message: result.message };
}
