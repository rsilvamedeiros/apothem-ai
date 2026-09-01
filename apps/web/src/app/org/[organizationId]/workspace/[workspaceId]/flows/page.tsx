import styles from "../stub.module.css";

export default function FlowsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Flows</h1>
      <p className={styles.description}>
        Multi-step orchestrations that combine agents, tools, and approvals.
      </p>
      <div className={styles.emptyState}>No flows defined yet.</div>
    </div>
  );
}
