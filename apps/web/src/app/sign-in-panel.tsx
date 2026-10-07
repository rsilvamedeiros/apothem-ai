import { Button, Card, Logomark } from "@apothem/ui";
import { signIn, signInWithGoogle } from "./actions";
import styles from "./page.module.css";

type SignInPanelProps = {
  /** Google credentials are configured (AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET). */
  googleEnabled: boolean;
  /** Manual token or principal sign-in, for local development only. */
  devSignInEnabled: boolean;
};

export function SignInPanel({ googleEnabled, devSignInEnabled }: SignInPanelProps) {
  return (
    <main className={styles.main}>
      <div className={styles.brand}>
        <Logomark size={28} className={styles.mark} />
        <span className={styles.wordmark}>APOTHEM</span>
      </div>

      <Card className={styles.card}>
        <div className={styles.cardHeader}>
          <h1 className={styles.headline}>Enter your workspace</h1>
          {googleEnabled ? (
            <p className={styles.hint}>Sign in with the account you use at work.</p>
          ) : devSignInEnabled ? (
            <p className={styles.hint}>
              Dev-only bootstrap. Configure Google sign-in (see apps/web/.env.example) for real
              authentication.
            </p>
          ) : (
            <p role="alert" className={styles.hint}>
              Sign-in is not configured for this environment.
            </p>
          )}
        </div>

        {googleEnabled ? (
          <form action={signInWithGoogle}>
            <Button type="submit">Continue with Google</Button>
          </form>
        ) : null}

        {devSignInEnabled ? (
          <form className={styles.form} action={signIn}>
            <label>
              Access token (optional, API in jwt mode)
              <input
                name="accessToken"
                type="password"
                autoComplete="off"
                spellCheck={false}
                placeholder="npm run auth:dev-token -- you@example.com"
              />
            </label>
            <label>
              Principal ID
              <input
                name="principalId"
                defaultValue="00000000-0000-0000-0000-000000000000"
                placeholder="00000000-0000-0000-0000-000000000000"
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
            <Button type="submit" variant={googleEnabled ? "secondary" : "primary"}>
              Continue
            </Button>
          </form>
        ) : null}

        {devSignInEnabled ? (
          <p className={styles.footnote}>
            Using seeded demo fixtures — see <code>apothem-api/database/seed.ts</code>.
          </p>
        ) : null}
      </Card>
    </main>
  );
}
