import type { ReactNode } from "react";
import Link from "next/link";
import { getOrganization, getWorkspace } from "@apothem/api-client";
import { Logomark } from "@apothem/ui";
import { getApiClient } from "@/lib/session";
import { canUseDemoFallback, mockOrganization, mockWorkspace } from "@/lib/mock";
import { signOut } from "@/app/actions";
import { loadApprovalSummary } from "@/features/approvals/load-approval-summary";
import { WorkspaceNav } from "./workspace-nav";
import styles from "./layout.module.css";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ organizationId: string; workspaceId: string }>;
};

export default async function WorkspaceLayout({ children, params }: LayoutProps) {
  const { organizationId, workspaceId } = await params;
  const client = await getApiClient();

  let organization;
  let workspace;
  let isMock = false;

  try {
    const [orgResult, workspaceResult] = await Promise.all([
      getOrganization(client, organizationId),
      getWorkspace(client, organizationId, workspaceId),
    ]);
    organization = orgResult.data;
    workspace = workspaceResult.data;
  } catch (error) {
    if (!canUseDemoFallback(error)) throw error;
    organization = mockOrganization(organizationId);
    workspace = mockWorkspace(organizationId, workspaceId);
    isMock = true;
  }

  const basePath = `/org/${organizationId}/workspace/${workspaceId}`;
  // Best effort: people who cannot decide approvals, or an API that is down, simply get no badge.
  const approvals = isMock ? { kind: "hidden" as const } : await loadApprovalSummary(client, organizationId, workspaceId);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Logomark size={18} className={styles.mark} />
          <span className={styles.wordmark}>APOTHEM</span>
          {isMock && <span className={styles.demoBadge}>Demo</span>}
        </div>

        <div className={styles.identity}>
          <Link href={`/org/${organizationId}`} className={styles.orgLink}>
            {organization?.name ?? "Organization"}
          </Link>
          <span className={styles.workspaceName}>{workspace?.name ?? "Workspace"}</span>
        </div>

        <WorkspaceNav basePath={basePath} pendingApprovals={approvals.kind === "ok" ? approvals.pending : 0} />

        <form action={signOut} className={styles.signOut}>
          <button type="submit" className={styles.signOutButton}>
            Sign out
          </button>
        </form>
      </aside>

      <div className={styles.content}>{children}</div>
    </div>
  );
}
