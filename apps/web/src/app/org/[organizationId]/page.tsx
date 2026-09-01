import { getOrganization, listWorkspaces } from "@apothem/api-client";
import { Button, Card } from "@apothem/ui";
import { createWorkspaceAction } from "./actions";
import { getApiClient } from "@/lib/session";
import { isNetworkError, mockOrganization, mockWorkspaces } from "@/lib/mock";
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
    <main className={styles.main}>
      {isMock && (
        <p className={styles.demoBanner}>
          Demo mode — apothem-api is unreachable, showing fixture data so you can review
          the layout.
        </p>
      )}
      <div className={styles.header}>
        <span className={styles.wordmark}>APOTHEM</span>
        <h1 className={styles.headline}>{organization.name}</h1>
        <p className={styles.hint}>Choose a workspace to continue.</p>
      </div>

      <div className={styles.workspaceGrid}>
        {workspaces.map((workspace) => (
          <Card key={workspace.id} className={styles.workspaceCard}>
            <span className={styles.workspaceName}>{workspace.name}</span>
            <span className={styles.workspaceSlug}>{workspace.slug}</span>
            <Button href={`/org/${organizationId}/workspace/${workspace.id}/overview`}>
              Open
            </Button>
          </Card>
        ))}
        {workspaces.length === 0 && (
          <p className={styles.hint}>No workspaces yet. Create the first one below.</p>
        )}
      </div>

      <Card className={styles.createCard}>
        <h2 className={styles.subheadline}>New workspace</h2>
        <form className={styles.form} action={boundCreateWorkspace}>
          <label>
            Name
            <input name="name" placeholder="Support Operations" required />
          </label>
          <label>
            Slug
            <input name="slug" placeholder="support-operations" required />
          </label>
          <Button type="submit">Create workspace</Button>
        </form>
      </Card>
    </main>
  );
}
