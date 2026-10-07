import { listMembers, type ApothemApiClient } from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";

export type MemberRow = {
  membershipId: string;
  principalId: string;
  email: string;
  name: string;
  role: "owner" | "admin" | "builder" | "operator" | "auditor";
  status: "active" | "invited" | "revoked";
  createdAt: string;
};

export type LoadMembersResult =
  | { kind: "ok"; members: MemberRow[] }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

const MESSAGES: Record<number, string> = {
  401: "You need to sign in again.",
  403: "You do not have permission to view members.",
  404: "This organization was not found.",
};

/** Never forwards API error bodies; messages are fixed per status. */
export async function loadMembers(client: ApothemApiClient, organizationId: string): Promise<LoadMembersResult> {
  if (!isUuid(organizationId)) {
    return { kind: "error", message: "This organization was not found." };
  }
  try {
    const { data, response } = await listMembers(client, organizationId);
    if (response.status >= 400 || !data) {
      return { kind: "error", message: MESSAGES[response.status] ?? "Members could not be loaded. Try again shortly." };
    }
    return { kind: "ok", members: data as MemberRow[] };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
