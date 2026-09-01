import { Button, Card, Logomark } from "@apothem/ui";
import { signIn } from "./actions";
import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <main className={styles.main}>
      <div className={styles.brand}>
        <Logomark size={28} className={styles.mark} />
        <span className={styles.wordmark}>APOTHEM</span>
      </div>

      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.headline}>Enter your workspace</h1>
          <p className={styles.hint}>
            Dev-only bootstrap — real session authentication (ADR-009) replaces this
            before launch.
          </p>
        </div>

        <form className={styles.form} action={signIn}>
          <label>
            Principal ID
            <input
              name="principalId"
              defaultValue="00000000-0000-0000-0000-000000000000"
              placeholder="00000000-0000-0000-0000-000000000000"
              required
            />
          </label>
          <label>
            Organization ID
            <input
              name="organizationId"
              defaultValue="00000000-0000-0000-0000-000000000000"
              placeholder="00000000-0000-0000-0000-000000000000"
              required
            />
          </label>
          <Button type="submit">Continue</Button>
        </form>

        <p className={styles.footnote}>
          Using seeded demo fixtures — see <code>apothem-api/database/seed.ts</code>.
        </p>
      </Card>
    </main>
  );
}
