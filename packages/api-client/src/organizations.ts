import type { ApothemApiClient } from "./client";

export async function createOrganization(
  client: ApothemApiClient,
  input: { name: string; slug: string },
) {
  return client.POST("/v1/organizations", { body: input });
}

export async function getOrganization(client: ApothemApiClient, organizationId: string) {
  return client.GET("/v1/organizations/{organizationId}", {
    params: { path: { organizationId } },
  });
}
