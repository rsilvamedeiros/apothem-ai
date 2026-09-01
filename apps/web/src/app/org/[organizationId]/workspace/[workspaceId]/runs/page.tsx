import styles from "../stub.module.css";

export default function RunsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Runs</h1>
      <p className={styles.description}>
        Durable execution records: inputs, tool calls, approvals, and final outcome.
      </p>
      <div className={styles.emptyState}>No runs yet.</div>
    </div>
  );
}
