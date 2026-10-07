"use server";

import { redirect } from "next/navigation";
import { getApiClient } from "@/lib/session";
import type { CreateAgentFormState } from "./components/create-agent-form";
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
