import styles from "../stub.module.css";

export default function ConnectionsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Connections</h1>
      <p className={styles.description}>
        Tools and systems agents can act on, each with a typed contract and policy scope.
      </p>
      <div className={styles.emptyState}>No connections configured yet.</div>
    </div>
  );
}
