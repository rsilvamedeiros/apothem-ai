"use server";

import { revalidatePath } from "next/cache";
import { getApiClient } from "@/lib/session";
import type { RunPanelState } from "./components/run-panel";
import { submitRun } from "./submit-run";

export async function startRunAction(
  organizationId: string,
  workspaceId: string,
  agentId: string,
  _previous: RunPanelState,
  formData: FormData,
): Promise<RunPanelState> {
  const state = await submitRun(await getApiClient(), organizationId, workspaceId, agentId, formData);
  if (state.run) revalidatePath(`/org/${organizationId}/workspace/${workspaceId}/runs`);
  return state;
}
