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
