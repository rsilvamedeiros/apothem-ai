import styles from "../stub.module.css";

export default function KnowledgePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Knowledge</h1>
      <p className={styles.description}>
        Sources and collections agents can retrieve from, with traceable permissions.
      </p>
      <div className={styles.emptyState}>No knowledge sources connected yet.</div>
    </div>
  );
}
