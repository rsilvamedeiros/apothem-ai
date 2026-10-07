import type { ApothemApiClient } from "./client";

/** The catalog of tools an agent can be given, with each tool's risk and what a binding may choose. */
export async function listTools(client: ApothemApiClient) {
  return client.GET("/v1/tools");
}
