import createClient from "openapi-fetch";
import type { paths } from "./generated/schema";

export type ApothemApiClient = ReturnType<typeof createClient<paths>>;

export type CreateApothemApiClientOptions = {
  baseUrl: string;
  /**
   * Dev-only bootstrap credential (`x-principal-id`) consumed by the API's
   * DevHeaderAuthenticator ahead of self-hosted OIDC (ADR-009). Callers must
   * stop passing this once real session/bearer-token auth lands.
   */
  principalId?: string;
};

export function createApothemApiClient(options: CreateApothemApiClientOptions): ApothemApiClient {
  return createClient<paths>({
    baseUrl: options.baseUrl,
    headers: options.principalId ? { "x-principal-id": options.principalId } : undefined,
  });
}
