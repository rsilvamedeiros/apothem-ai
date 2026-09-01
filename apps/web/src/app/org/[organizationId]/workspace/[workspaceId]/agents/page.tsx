import styles from "../stub.module.css";

export default function AgentsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Agents</h1>
      <p className={styles.description}>
        Agents defined for this workspace, their published version, and draft state.
      </p>
      <div className={styles.emptyState}>No agents yet. Create one from a template or blank.</div>
    </div>
  );
}
