import type { ApothemApiClient } from "./client";
import type { paths } from "./generated/schema";

type AuditQuery = NonNullable<
  paths["/v1/organizations/{organizationId}/audit-events"]["get"]["parameters"]["query"]
>;

/** Newest first; pass the previous response's `nextCursor` to fetch the next page. */
export async function listAuditEvents(
  client: ApothemApiClient,
  organizationId: string,
  query: AuditQuery = {},
) {
  return client.GET("/v1/organizations/{organizationId}/audit-events", {
    params: { path: { organizationId }, query },
  });
}
