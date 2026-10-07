import { AuditView } from "@/features/audit/audit-view";
import { loadAuditEvents } from "@/features/audit/load-audit-events";
import { getApiClient } from "@/lib/session";

type AuditPageProps = {
  params: Promise<{ organizationId: string }>;
  searchParams: Promise<{ cursor?: string | string[] }>;
};

const MAX_CURSOR_LENGTH = 512;

export default async function AuditPage({ params, searchParams }: AuditPageProps) {
  const { organizationId } = await params;
  const { cursor: rawCursor } = await searchParams;
  // The cursor is untrusted input: only a single, bounded string is forwarded.
  const cursor =
    typeof rawCursor === "string" && rawCursor.length > 0 && rawCursor.length <= MAX_CURSOR_LENGTH
      ? rawCursor
      : undefined;

  const client = await getApiClient();
  const result = await loadAuditEvents(client, organizationId, cursor ? { cursor } : {});

  return (
    <AuditView
      result={result}
      basePath={`/org/${organizationId}/audit`}
      isLaterPage={cursor !== undefined}
    />
  );
}
