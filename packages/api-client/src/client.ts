import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export type ApothemApiClient = ReturnType<typeof createClient<paths>>;

export type CreateApothemApiClientOptions = {
  baseUrl: string;
  /**
   * Signed access token for the API's `AUTH_MODE=jwt` (ADR-012). This is the
   * production credential and takes precedence over `principalId`.
   */
  accessToken?: string;
  /**
   * Dev-only bootstrap credential (`x-principal-id`) consumed by the API's
   * DevHeaderAuthenticator when `AUTH_MODE=dev`. The API refuses to run in
   * production with it.
   */
  principalId?: string;
  /** Injectable for tests; defaults to the global fetch. */
  fetch?: (request: Request) => Promise<Response>;
};

function credentialHeaders(options: CreateApothemApiClientOptions): Record<string, string> | undefined {
  if (options.accessToken) return { authorization: `Bearer ${options.accessToken}` };
  if (options.principalId) return { "x-principal-id": options.principalId };
  return undefined;
}

export function createApothemApiClient(options: CreateApothemApiClientOptions): ApothemApiClient {
  return createClient<paths>({
    baseUrl: options.baseUrl,
    headers: credentialHeaders(options),
    ...(options.fetch ? { fetch: options.fetch } : {}),
  });
}
