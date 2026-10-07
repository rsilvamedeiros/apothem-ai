import { decideApprovalAction } from "@/features/approvals/actions";
import { ApprovalsView } from "@/features/approvals/approvals-view";
import { loadApprovals } from "@/features/approvals/load-approvals";
import type { ApprovalStatus } from "@/features/runs/run-view";
import { getApiClient } from "@/lib/session";

type ApprovalsPageProps = {
  params: Promise<{ organizationId: string; workspaceId: string }>;
  searchParams: Promise<{ cursor?: string | string[]; status?: string | string[] }>;
};

const MAX_CURSOR_LENGTH = 512;
const STATUSES: readonly ApprovalStatus[] = ["pending", "approved", "rejected", "expired"];

export default async function ApprovalsPage({ params, searchParams }: ApprovalsPageProps) {
  const { organizationId, workspaceId } = await params;
  const { cursor: rawCursor, status: rawStatus } = await searchParams;
  // Query values are untrusted: only a single bounded cursor and a known status are forwarded.
  const cursor =
    typeof rawCursor === "string" && rawCursor.length > 0 && rawCursor.length <= MAX_CURSOR_LENGTH ? rawCursor : undefined;
  const status = STATUSES.find((candidate) => candidate === rawStatus) ?? "pending";

  const result = await loadApprovals(await getApiClient(), organizationId, workspaceId, {
    status,
    ...(cursor ? { cursor } : {}),
  });
  const base = `/org/${organizationId}/workspace/${workspaceId}`;

  return (
    <ApprovalsView
      result={result}
      basePath={`${base}/approvals`}
      runBasePath={`${base}/runs`}
      status={status}
      decide={(approvalId) => decideApprovalAction.bind(null, organizationId, workspaceId, approvalId)}
    />
  );
}
