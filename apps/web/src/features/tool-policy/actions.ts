"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { getApiClient } from "@/lib/session";
import { submitToolPolicies } from "./submit-tool-policies";

/**
 * Tenant ids come from the route (bound by the page), never from form fields,
 * and apothem-api re-checks permission for every change.
 */
export async function saveToolPoliciesAction(
  organizationId: string,
  workspaceId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const state = await submitToolPolicies(await getApiClient(), organizationId, workspaceId, formData);
  if (state.ok) {
    // The agent pages show which tools the workspace restricts.
    revalidatePath(`/org/${organizationId}/workspace/${workspaceId}/settings`);
    revalidatePath(`/org/${organizationId}/workspace/${workspaceId}/agents`, "layout");
  }
  return state;
}
