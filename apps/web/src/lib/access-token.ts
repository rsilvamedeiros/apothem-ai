import { SignJWT } from "jose";

/** Matches apothem-api's verification (ADR-012): HS256, required exp and sub, issuer and audience. */
export type AccessTokenConfig = { secret: string; issuer: string; audience: string };

export type AccessTokenProfile = { email: string; name?: string | undefined; emailVerified: boolean };

/** Short on purpose: revocation relies on expiry plus the API's per-request account status check. */
export const ACCESS_TOKEN_TTL_SECONDS = 10 * 60;

const MIN_SECRET_LENGTH = 32;
const MAX_NAME_LENGTH = 200;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function loadAccessTokenConfig(
  env: Record<string, string | undefined> = process.env,
): AccessTokenConfig | undefined {
  const secret = env.APOTHEM_API_TOKEN_SECRET;
  const issuer = env.APOTHEM_API_TOKEN_ISSUER;
  const audience = env.APOTHEM_API_TOKEN_AUDIENCE;
  return secret && issuer && audience ? { secret, issuer, audience } : undefined;
}

/**
 * Signs the bearer token apothem-api verifies. The identity provider is the
 * trust anchor for the email, so an unverified address is never signed.
 */
export async function issueAccessToken(
  profile: AccessTokenProfile,
  config: AccessTokenConfig,
  now: Date = new Date(),
): Promise<string> {
  const email = profile.email.trim().toLowerCase();
  if (!profile.emailVerified || !EMAIL.test(email)) {
    throw new Error("Cannot issue an access token without a verified email");
  }
  if (config.secret.length < MIN_SECRET_LENGTH) {
    throw new Error(`APOTHEM_API_TOKEN_SECRET must be at least ${MIN_SECRET_LENGTH} characters`);
  }

  const name = profile.name?.trim().slice(0, MAX_NAME_LENGTH);
  const issuedAt = Math.floor(now.getTime() / 1000);

  return new SignJWT({ email, email_verified: true, ...(name ? { name } : {}) })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(email)
    .setIssuer(config.issuer)
    .setAudience(config.audience)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + ACCESS_TOKEN_TTL_SECONDS)
    .sign(new TextEncoder().encode(config.secret));
}
