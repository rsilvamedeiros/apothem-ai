import styles from "../stub.module.css";

export default function ApprovalsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Approvals</h1>
      <p className={styles.description}>
        High-risk actions awaiting a human decision before they execute.
      </p>
      <div className={styles.emptyState}>No pending approvals.</div>
    </div>
  );
}
