import { cookies } from "next/headers";
import { createApothemApiClient } from "@apothem/api-client";
import { sessionCookieOptions } from "./sign-in";

const PRINCIPAL_COOKIE = "apothem_principal_id";
const ACCESS_TOKEN_COOKIE = "apothem_access_token";

/**
 * Session credentials live in httpOnly cookies, so page scripts never see
 * them. Two modes mirror apothem-api's AUTH_MODE:
 * - access token (`jwt`): the production credential, sent as a bearer token;
 * - principal id (`dev`): a pasted id for local development only.
 * Real sign-in (self-hosted OIDC, ADR-012) will set the access token cookie.
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

export async function getApiClient() {
  const baseUrl = process.env.APOTHEM_API_URL;
  if (!baseUrl) {
    throw new Error("APOTHEM_API_URL is not set — copy apps/web/.env.example to .env.local");
  }
  const accessToken = await getSessionAccessToken();
  const principalId = accessToken ? undefined : await getSessionPrincipalId();
  return createApothemApiClient({
    baseUrl,
    ...(accessToken ? { accessToken } : {}),
    ...(principalId ? { principalId } : {}),
  });
}
