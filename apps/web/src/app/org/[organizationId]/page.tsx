import { getOrganization, listWorkspaces } from "@apothem/api-client";
import { Button, Card, Logomark } from "@apothem/ui";
import { createWorkspaceAction } from "./actions";
import { getApiClient } from "@/lib/session";
import { isNetworkError, mockOrganization, mockWorkspaces } from "@/lib/mock";
import { signOut } from "@/app/actions";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ organizationId: string }>;
};

export default async function OrganizationPage({ params }: PageProps) {
  const { organizationId } = await params;
  const client = await getApiClient();

  let organization;
  let workspaces;
  let isMock = false;

  try {
    const [orgResult, workspacesResult] = await Promise.all([
      getOrganization(client, organizationId),
      listWorkspaces(client, organizationId),
    ]);

    if (orgResult.error || !orgResult.data) {
      return (
        <main className={styles.main}>
          <p className={styles.hint}>
            Could not load organization {organizationId}. Confirm the principal id has
            membership and apothem-api is running.
          </p>
        </main>
      );
    }

    organization = orgResult.data;
    workspaces = workspacesResult.data ?? [];
  } catch (error) {
    if (!isNetworkError(error)) throw error;
    organization = mockOrganization(organizationId);
    workspaces = mockWorkspaces(organizationId);
    isMock = true;
  }

  const boundCreateWorkspace = createWorkspaceAction.bind(null, organizationId);

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <Logomark size={22} className={styles.mark} />
          <span className={styles.wordmark}>APOTHEM</span>
        </div>
        <form action={signOut}>
          <button type="submit" className={styles.signOutButton}>
            Sign out
          </button>
        </form>
      </header>

      <main className={styles.main}>
        {isMock && (
          <p className={styles.demoBanner}>
            Demo mode — apothem-api is unreachable, showing fixture data so you can
            review the layout.
          </p>
        )}

        <div className={styles.intro}>
          <span className={styles.orgSlug}>{organization.slug}</span>
          <h1 className={styles.headline}>{organization.name}</h1>
          <p className={styles.hint}>Choose a workspace to continue.</p>
        </div>

        <div className={styles.workspaceGrid}>
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className={styles.workspaceCard}>
              <div className={styles.workspaceIcon}>{workspace.name.charAt(0).toUpperCase()}</div>
              <div className={styles.workspaceMeta}>
                <span className={styles.workspaceName}>{workspace.name}</span>
                <span className={styles.workspaceSlug}>{workspace.slug}</span>
              </div>
              <Button
                href={`/org/${organizationId}/workspace/${workspace.id}/overview`}
                variant="secondary"
                className={styles.workspaceOpen}
              >
                Open
              </Button>
            </Card>
          ))}

          <Card className={styles.createCard}>
            <span className={styles.createLabel}>New workspace</span>
            <form className={styles.createForm} action={boundCreateWorkspace}>
              <input name="name" placeholder="Workspace name" required />
              <input name="slug" placeholder="workspace-slug" required />
              <Button type="submit" variant="secondary" className={styles.createSubmit}>
                Create
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
