"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getApiClient } from "@/lib/session";
import {
  changeAgentStatusCommand,
  publishAgentCommand,
  saveDraftCommand,
} from "./agent-commands";
import type { ActionState } from "./components/action-state";
import type { CreateAgentFormState } from "./components/create-agent-form";
import { changeStatusState, publishState, saveDraftState } from "./to-action-state";
import { submitCreateAgent } from "./submit-create-agent";

/**
 * Tenant ids come from the route (bound by the page), never from form fields,
 * and apothem-api re-checks membership on every call.
 */
export async function createAgentAction(
  organizationId: string,
  workspaceId: string,
  _previous: CreateAgentFormState,
  formData: FormData,
): Promise<CreateAgentFormState> {
  const client = await getApiClient();
  const result = await submitCreateAgent(client, organizationId, workspaceId, formData);
  if (result.kind === "redirect") redirect(result.path);
  return result.state;
}

function refresh(organizationId: string, workspaceId: string, agentId: string): void {
  revalidatePath(`/org/${organizationId}/workspace/${workspaceId}/agents`);
  revalidatePath(`/org/${organizationId}/workspace/${workspaceId}/agents/${agentId}`);
}

export async function saveDraftAction(
  organizationId: string,
  workspaceId: string,
  agentId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const instructions = formData.get("instructions");
  const client = await getApiClient();
  const result = await saveDraftCommand(client, organizationId, workspaceId, agentId, {
    instructions: typeof instructions === "string" ? instructions : "",
  });
  if (result.kind === "saved") refresh(organizationId, workspaceId, agentId);
  return saveDraftState(result);
}

export async function publishAgentAction(
  organizationId: string,
  workspaceId: string,
  agentId: string,
): Promise<ActionState> {
  const client = await getApiClient();
  const result = await publishAgentCommand(client, organizationId, workspaceId, agentId);
  if (result.kind === "published") refresh(organizationId, workspaceId, agentId);
  return publishState(result);
}

export async function changeAgentStatusAction(
  action: "disable" | "archive",
  organizationId: string,
  workspaceId: string,
  agentId: string,
): Promise<ActionState> {
  const client = await getApiClient();
  const result = await changeAgentStatusCommand(client, organizationId, workspaceId, agentId, action);
  if (result.kind === "done") refresh(organizationId, workspaceId, agentId);
  return changeStatusState(action, result);
}
