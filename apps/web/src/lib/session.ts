import { cookies } from "next/headers";
import { createApothemApiClient } from "@apothem/api-client";

const PRINCIPAL_COOKIE = "apothem_principal_id";

/**
 * Dev-only session: a pasted principal id stored in a cookie, sent to
 * apothem-api as `x-principal-id` (DevHeaderAuthenticator). Replace with
 * real session/bearer-token handling once self-hosted OIDC lands (ADR-009).
 */
export async function getSessionPrincipalId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(PRINCIPAL_COOKIE)?.value;
}

export async function setSessionPrincipalId(principalId: string): Promise<void> {
  const store = await cookies();
  store.set(PRINCIPAL_COOKIE, principalId, { httpOnly: true, sameSite: "lax" });
}

export async function clearSessionPrincipalId(): Promise<void> {
  const store = await cookies();
  store.delete(PRINCIPAL_COOKIE);
}

export async function getApiClient() {
  const baseUrl = process.env.APOTHEM_API_URL;
  if (!baseUrl) {
    throw new Error("APOTHEM_API_URL is not set — copy apps/web/.env.example to .env.local");
  }
  const principalId = await getSessionPrincipalId();
  return createApothemApiClient({ baseUrl, principalId });
}
