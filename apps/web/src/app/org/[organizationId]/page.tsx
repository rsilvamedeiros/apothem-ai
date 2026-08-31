import { getOrganization, listWorkspaces } from "@apothem/api-client";
import { Button, Card } from "@apothem/ui";
import { getApiClient } from "@/lib/session";
import { createWorkspaceAction } from "./actions";
import styles from "./page.module.css";

export default async function OrganizationPage({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const { organizationId } = await params;
  const client = await getApiClient();

  const [orgResult, workspacesResult] = await Promise.all([
    getOrganization(client, organizationId),
    listWorkspaces(client, organizationId),
  ]);

  if (orgResult.error || !orgResult.data) {
    return (
      <main className={styles.main}>
        <div className={styles.content}>
          <p className={styles.error}>
            Could not load organization {organizationId}. Confirm the
            principal id has membership and apothem-api is running.
          </p>
        </div>
      </main>
    );
  }

  const organization = orgResult.data;
  const workspaces = workspacesResult.data ?? [];

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <div className={styles.orgName}>{organization.name}</div>
          <div className={styles.orgSlug}>{organization.slug}</div>
        </div>
      </header>

      <div className={styles.content}>
        <section>
          <h2 className={styles.sectionTitle}>Workspaces</h2>
          {workspaces.length === 0 ? (
            <p className={styles.empty}>No workspaces yet.</p>
          ) : (
            <div className={styles.workspaceList}>
              {workspaces.map((workspace) => (
                <Card key={workspace.id} className={styles.workspaceItem}>
                  <span>{workspace.name}</span>
                  <span className={styles.orgSlug}>{workspace.slug}</span>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className={styles.sectionTitle}>Create workspace</h2>
          <form
            className={styles.form}
            action={createWorkspaceAction.bind(null, organizationId)}
          >
            <label>
              Name
              <input name="name" required />
            </label>
            <label>
              Slug
              <input name="slug" required />
            </label>
            <Button type="submit">Create</Button>
          </form>
        </section>
      </div>
    </main>
  );
}
