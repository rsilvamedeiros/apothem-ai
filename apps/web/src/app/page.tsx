import { Button, Card } from "@apothem/ui";
import { signIn } from "./actions";
import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <main className={styles.main}>
      <Card className={styles.card}>
        <span className={styles.wordmark}>APOTHEM</span>
        <h1 className={styles.headline}>Enter your workspace</h1>
        <p className={styles.hint}>
          Dev-only bootstrap: paste a principal id and organization id from
          apothem-api (e.g. the seeded demo fixtures — see{" "}
          <code>apothem-api/database/seed.ts</code>). Real session
          authentication (ADR-009) replaces this before launch.
        </p>
        <form className={styles.form} action={signIn}>
          <label>
            Principal ID
            <input name="principalId" placeholder="00000000-0000-0000-0000-000000000000" required />
          </label>
          <label>
            Organization ID
            <input name="organizationId" placeholder="00000000-0000-0000-0000-000000000000" required />
          </label>
          <Button type="submit">Continue</Button>
        </form>
      </Card>
    </main>
  );
}
