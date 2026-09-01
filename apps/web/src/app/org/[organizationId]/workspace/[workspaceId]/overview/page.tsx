import styles from "../stub.module.css";

export default function OverviewPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Overview</h1>
      <p className={styles.description}>
        A snapshot of agent activity, pending approvals, and workspace health.
      </p>
      <div className={styles.emptyState}>No activity yet in this workspace.</div>
    </div>
  );
}
