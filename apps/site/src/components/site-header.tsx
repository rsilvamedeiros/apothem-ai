import Link from "next/link";
import styles from "./site-header.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.wordmark} href="/">
        APOTHEM AI
      </Link>
      <nav className={styles.nav}>
        <Link href="/product">Product</Link>
        <Link href="/solutions">Solutions</Link>
        <span className={styles.disabled}>Docs</span>
      </nav>
    </header>
  );
}
