import type { ApothemApiClient } from "./client";

/** The caller's identity and the active organizations they can enter. */
export async function getAccount(client: ApothemApiClient) {
  return client.GET("/v1/me");
}
