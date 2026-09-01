import { Button, StatusBadge } from "@apothem/ui";
import { SourceTypeCard } from "../components/source-type-card";
import { SOURCE_STATUS_TONE, SOURCE_TYPES } from "../source-types";
import styles from "./knowledge-screen.module.css";

export function KnowledgeScreen() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Knowledge</h1>
          <p className={styles.description}>
            Sources and collections agents can retrieve from, with traceable permissions.
          </p>
        </div>
        <Button type="button" disabled title="Requires apothem-api knowledge endpoints">
          Add source
        </Button>
      </div>

      <div className={styles.emptyState}>No knowledge sources connected yet.</div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Source types</h2>
        <p className={styles.sectionHint}>
          Ingestion isn&apos;t wired up yet — a source can be one of these kinds once
          apothem-api&apos;s knowledge endpoints ship.
        </p>
        <div className={styles.sourceTypeGrid}>
          {SOURCE_TYPES.map((sourceType) => (
            <SourceTypeCard key={sourceType.id} sourceType={sourceType} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Source lifecycle</h2>
        <div className={styles.statusLegend}>
          {Object.entries(SOURCE_STATUS_TONE).map(([status, tone]) => (
            <StatusBadge key={status} tone={tone}>
              {status.replace("_", " ")}
            </StatusBadge>
          ))}
        </div>
      </section>
    </div>
  );
}
