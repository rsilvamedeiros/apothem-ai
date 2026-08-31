import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span>© {new Date().getFullYear()} APOTHEM AI</span>
      <span>apothemai.com.br</span>
    </footer>
  );
}
