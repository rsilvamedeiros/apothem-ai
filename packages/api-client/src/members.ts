import type { ApothemApiClient } from "./client";
import type { paths } from "./generated/schema";

type AddMemberBody = NonNullable<
  paths["/v1/organizations/{organizationId}/members"]["post"]["requestBody"]
>["content"]["application/json"];

export type MemberRole = AddMemberBody["role"];

export async function listMembers(client: ApothemApiClient, organizationId: string) {
  return client.GET("/v1/organizations/{organizationId}/members", {
    params: { path: { organizationId } },
  });
}

export async function addMember(
  client: ApothemApiClient,
  organizationId: string,
  input: AddMemberBody,
) {
  return client.POST("/v1/organizations/{organizationId}/members", {
    params: { path: { organizationId } },
    body: input,
  });
}

export async function changeMemberRole(
  client: ApothemApiClient,
  organizationId: string,
  membershipId: string,
  role: MemberRole,
) {
  return client.PATCH("/v1/organizations/{organizationId}/members/{membershipId}", {
    params: { path: { organizationId, membershipId } },
    body: { role },
  });
}

export async function revokeMember(
  client: ApothemApiClient,
  organizationId: string,
  membershipId: string,
) {
  return client.POST("/v1/organizations/{organizationId}/members/{membershipId}/revoke", {
    params: { path: { organizationId, membershipId } },
  });
}
