import styles from "../stub.module.css";

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>
      <p className={styles.description}>
        Workspace membership, roles, and governance defaults.
      </p>
      <div className={styles.emptyState}>Settings management is not implemented yet.</div>
    </div>
  );
}
