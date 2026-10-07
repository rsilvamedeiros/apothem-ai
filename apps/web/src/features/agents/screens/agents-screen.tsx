import { getApiClient } from "@/lib/session";
import { loadAgents } from "../load-agents";
import { AgentsView } from "./agents-view";

type AgentsScreenProps = {
  organizationId: string;
  workspaceId: string;
};

export async function AgentsScreen({ organizationId, workspaceId }: AgentsScreenProps) {
  const client = await getApiClient();
  const result = await loadAgents(client, organizationId, workspaceId);
  return <AgentsView result={result} allowDemo={process.env.NODE_ENV !== "production"} />;
}
