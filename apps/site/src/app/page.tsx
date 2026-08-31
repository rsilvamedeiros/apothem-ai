import styles from "./page.module.css";

const LOOP_STEPS = ["Understand", "Connect", "Reason", "Act"];

export default function HomePage() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <span className={styles.wordmark}>APOTHEM AI</span>
        <nav className={styles.nav}>
          <span>Product</span>
          <span>Solutions</span>
          <span>Docs</span>
        </nav>
      </header>

      <section className={styles.hero}>
        <span className={styles.eyebrow}>Intelligence at the core</span>
        <h1 className={styles.headline}>
          The intelligence layer between business context and authorized
          action.
        </h1>
        <div className={styles.loop}>
          {LOOP_STEPS.map((step, i) => (
            <span key={step} className={styles.loopStep}>
              {step}
              {i < LOOP_STEPS.length - 1 ? " →" : ""}
            </span>
          ))}
        </div>
        <p className={styles.subhead}>
          APOTHEM connects company knowledge, systems, people, processes and
          policies to AI agents that reason within explicit boundaries and
          execute authorized work — with approvals, audit and traceable
          evidence built in from day one.
        </p>
        <div className={styles.ctaRow}>
          <a className={styles.ctaPrimary} href="mailto:hello@apothemai.com.br">
            Talk to us
          </a>
          <a className={styles.ctaSecondary} href="#">
            How it works
          </a>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} APOTHEM AI</span>
        <span>apothemai.com.br</span>
      </footer>
    </main>
  );
}
