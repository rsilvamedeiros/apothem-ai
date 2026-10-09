import { cookies } from "next/headers";
import { createApothemApiClient } from "@apothem/api-client";
import { auth, googleConfigured } from "@/auth";
import { loadAccessTokenConfig } from "./access-token";
import { accessTokenForSession, assertSigningConfigured } from "./session-token";
import { sessionCookieOptions } from "./sign-in";

const PRINCIPAL_COOKIE = "apothem_principal_id";
const ACCESS_TOKEN_COOKIE = "apothem_access_token";

/**
 * Credential sources, strongest first (all httpOnly, never readable by page scripts):
 * 1. the Auth.js session, exchanged for a short-lived signed bearer token per call (ADR-012);
 * 2. a pasted access token cookie (API in `jwt` mode, e.g. from `npm run auth:dev-token`);
 * 3. a pasted principal id cookie, for the API's local `dev` mode only.
 */
export async function getSessionPrincipalId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(PRINCIPAL_COOKIE)?.value;
}

export async function getSessionAccessToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function setSessionPrincipalId(principalId: string): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.set(PRINCIPAL_COOKIE, principalId, sessionCookieOptions(process.env.NODE_ENV));
}

export async function setSessionAccessToken(accessToken: string): Promise<void> {
  const store = await cookies();
  store.delete(PRINCIPAL_COOKIE);
  store.set(ACCESS_TOKEN_COOKIE, accessToken, sessionCookieOptions(process.env.NODE_ENV));
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(PRINCIPAL_COOKIE);
  store.delete(ACCESS_TOKEN_COOKIE);
}

/** Auth.js is only consulted when a provider is configured; without one, auth() would demand a secret. */
async function currentAuthSession() {
  return googleConfigured ? auth() : null;
}

/** True when any credential is present; used to decide between the landing page and the app. */
export async function hasSession(): Promise<boolean> {
  const session = await currentAuthSession();
  if (session?.user?.email) return true;
  return Boolean((await getSessionAccessToken()) ?? (await getSessionPrincipalId()));
}

export async function getApiClient() {
  const baseUrl = process.env.APOTHEM_API_URL;
  if (!baseUrl) {
    throw new Error("APOTHEM_API_URL is not set — copy apps/web/.env.example to .env.local");
  }

  const session = await currentAuthSession();
  const tokenConfig = loadAccessTokenConfig();
  assertSigningConfigured(session, tokenConfig);
  const fromSession = await accessTokenForSession(session, tokenConfig);
  const accessToken = fromSession ?? (await getSessionAccessToken());
  const principalId = accessToken ? undefined : await getSessionPrincipalId();

  return createApothemApiClient({
    baseUrl,
    ...(accessToken ? { accessToken } : {}),
    ...(principalId ? { principalId } : {}),
  });
}
