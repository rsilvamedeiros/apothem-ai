import { issueAccessToken, type AccessTokenConfig } from "./access-token";

export type SessionLike = {
  user?: { email?: string | null; name?: string | null } | null;
  /** Set by the Auth.js jwt callback from the provider's `email_verified`. */
  emailVerified?: boolean;
} | null;

/**
 * Turns an Auth.js session into the short-lived bearer token apothem-api
 * verifies. Returns `undefined` (never throws) when there is no verified
 * signed-in user or token signing is not configured, so callers fall back
 * explicitly instead of sending a half-formed credential.
 */
export async function accessTokenForSession(
  session: SessionLike,
  config: AccessTokenConfig | undefined,
): Promise<string | undefined> {
  const email = session?.user?.email;
  if (!config || !email || session?.emailVerified !== true) return undefined;
  return issueAccessToken({ email, name: session.user?.name ?? undefined, emailVerified: true }, config);
}

/**
 * A verified signed-in person with no token settings is a deployment mistake,
 * and without this it would surface only as the API answering 401 and the app
 * asking to sign in again, forever. Say what is wrong instead. The message
 * names settings, never values or the person.
 */
export function assertSigningConfigured(session: SessionLike, config: AccessTokenConfig | undefined): void {
  if (config || !session?.user?.email || session.emailVerified !== true) return;
  throw new Error(
    "Sign-in works but the API token is not configured: set APOTHEM_API_TOKEN_SECRET, APOTHEM_API_TOKEN_ISSUER and APOTHEM_API_TOKEN_AUDIENCE.",
  );
}