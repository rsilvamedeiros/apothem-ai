import type { ReactNode } from "react";
import Link from "next/link";
import { getOrganization, getWorkspace } from "@apothem/api-client";
import { getApiClient } from "@/lib/session";
import { isNetworkError, mockOrganization, mockWorkspace } from "@/lib/mock";
import { signOut } from "@/app/actions";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { label: "Overview", segment: "overview" },
  { label: "Agents", segment: "agents" },
  { label: "Knowledge", segment: "knowledge" },
  { label: "Connections", segment: "connections" },
  { label: "Flows", segment: "flows" },
  { label: "Approvals", segment: "approvals" },
  { label: "Runs", segment: "runs" },
  { label: "Settings", segment: "settings" },
] as const;

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
    if (!isNetworkError(error)) throw error;
    organization = mockOrganization(organizationId);
    workspace = mockWorkspace(organizationId, workspaceId);
    isMock = true;
  }

  const basePath = `/org/${organizationId}/workspace/${workspaceId}`;

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        {isMock && <span className={styles.demoBadge}>Demo mode</span>}
        <div className={styles.identity}>
          <Link href={`/org/${organizationId}`} className={styles.orgLink}>
            {organization?.name ?? "Organization"}
          </Link>
          <span className={styles.workspaceName}>{workspace?.name ?? "Workspace"}</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.segment} href={`${basePath}/${item.segment}`} className={styles.navItem}>
              {item.label}
            </Link>
          ))}
        </nav>

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
