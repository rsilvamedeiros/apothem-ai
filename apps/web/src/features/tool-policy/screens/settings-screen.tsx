import { getApiClient } from "@/lib/session";
import { loadTools } from "@/features/agents/load-tools";
import { saveToolPoliciesAction } from "../actions";
import { loadToolPolicies } from "../load-tool-policies";
import { SettingsView } from "./settings-view";

type SettingsScreenProps = {
  organizationId: string;
  workspaceId: string;
};

export async function SettingsScreen({ organizationId, workspaceId }: SettingsScreenProps) {
  const client = await getApiClient();
  const [tools, policies] = await Promise.all([loadTools(client), loadToolPolicies(client, organizationId, workspaceId)]);
  return <SettingsView tools={tools} policies={policies} saveToolPolicies={saveToolPoliciesAction.bind(null, organizationId, workspaceId)} />;
}
