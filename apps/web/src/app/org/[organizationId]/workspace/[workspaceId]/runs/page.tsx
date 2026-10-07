import { loadRuns } from "@/features/runs/load-runs";
import { RunsView } from "@/features/runs/runs-view";
import { getApiClient } from "@/lib/session";

type RunsPageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
  searchParams: Promise<{ cursor?: string | string[] }>;
};

const MAX_CURSOR_LENGTH = 512;

export default async function RunsPage({ params, searchParams }: RunsPageProps) {
  const { organizationId, workspaceId } = await params;
  const { cursor: rawCursor } = await searchParams;
  // The cursor is untrusted input: only a single, bounded string is forwarded.
  const cursor =
    typeof rawCursor === "string" && rawCursor.length > 0 && rawCursor.length <= MAX_CURSOR_LENGTH ? rawCursor : undefined;

  const result = await loadRuns(await getApiClient(), organizationId, workspaceId, cursor ? { cursor } : {});

  return (
    <RunsView
      result={result}
      basePath={`/org/${organizationId}/workspace/${workspaceId}/runs`}
      isLaterPage={cursor !== undefined}
    />
  );
}
