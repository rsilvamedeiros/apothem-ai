import type { ApothemApiClient } from "@apothem/api-client";
import { createAgentCommand } from "./agent-commands";
import { parseCreateAgentForm } from "./agent-form";
import type { CreateAgentFormState } from "./components/create-agent-form";

export type SubmitCreateAgentResult =
  | { kind: "form"; state: CreateAgentFormState }
  | { kind: "redirect"; path: string };

/** Framework-free core of the create-agent server action (the action only adds redirect()). */
export async function submitCreateAgent(
  client: ApothemApiClient,
  organizationId: string,
  workspaceId: string,
  formData: { get(key: string): unknown },
): Promise<SubmitCreateAgentResult> {
  const parsed = parseCreateAgentForm(formData);
  if (!parsed.ok) return { kind: "form", state: { errors: parsed.errors } };

  const result = await createAgentCommand(client, organizationId, workspaceId, parsed.value);
  switch (result.kind) {
    case "created":
      return {
        kind: "redirect",
        path: `/org/${organizationId}/workspace/${workspaceId}/agents/${result.agentId}`,
      };
    case "invalid":
      return { kind: "form", state: { errors: result.errors } };
    case "error":
      return { kind: "form", state: { message: result.message } };
  }
}
