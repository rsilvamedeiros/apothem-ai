import { Button } from "@apothem/ui";
import { UseCaseCard } from "../components/use-case-card";
import { USE_CASE_TEMPLATES } from "../use-case-templates";
import styles from "./agents-screen.module.css";

export function AgentsScreen() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Agents</h1>
          <p className={styles.description}>
            Agents defined for this workspace, their published version, and draft state.
          </p>
        </div>
        <Button type="button" disabled title="Requires apothem-api agents endpoints">
          New agent
        </Button>
      </div>

      <div className={styles.emptyState}>No agents yet in this workspace.</div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Start from a use case</h2>
        <p className={styles.sectionHint}>
          Agent creation isn&apos;t wired up yet — these previews show the templates it will
          start from.
        </p>
        <div className={styles.templateGrid}>
          {USE_CASE_TEMPLATES.map((template) => (
            <UseCaseCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </div>
  );
}
