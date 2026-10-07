import { loadRun } from "@/features/runs/load-runs";
import { RunDetailView } from "@/features/runs/run-detail-view";
import { getApiClient } from "@/lib/session";

type RunPageProps = {
  params: Promise<{ organizationId: string; workspaceId: string; runId: string }>;
};

export default async function RunPage({ params }: RunPageProps) {
  const { organizationId, workspaceId, runId } = await params;
  const result = await loadRun(await getApiClient(), organizationId, workspaceId, runId);
  const base = `/org/${organizationId}/workspace/${workspaceId}`;

  return (
    <RunDetailView
      result={result}
      backHref={`${base}/runs`}
      agentHref={result.kind === "ok" ? `${base}/agents/${result.run.agentId}` : `${base}/agents`}
    />
  );
}
