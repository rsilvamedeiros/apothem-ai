import {
  addMember,
  changeMemberRole,
  revokeMember,
  type ApothemApiClient,
  type MemberRole,
} from "@apothem/api-client";
import { isUuid } from "@/lib/ids";
import { isNetworkError } from "@/lib/mock";
import { MEMBER_ROLES } from "./member-roles";

export type CommandResult = { kind: "done"; message: string } | { kind: "error"; message: string };

const UNREACHABLE = "apothem-api is unreachable. Try again shortly.";
const SIGN_IN_AGAIN = "You need to sign in again.";
const GENERIC = "Something went wrong. Try again shortly.";
const ORG_NOT_FOUND = "This organization was not found.";
const MEMBER_NOT_FOUND = "This member was not found.";
const CONFLICT =
  "This change is not allowed. An organization must keep at least one active owner, and revoked members cannot be edited.";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRole(value: string): value is MemberRole {
  return (MEMBER_ROLES as readonly string[]).includes(value);
}

async function guarded(call: () => Promise<CommandResult>): Promise<CommandResult> {
  try {
    return await call();
  } catch (error) {
    if (isNetworkError(error)) return { kind: "error", message: UNREACHABLE };
    throw error;
  }
}

function failure(status: number, messages: Record<number, string>): CommandResult {
  if (status === 401) return { kind: "error", message: SIGN_IN_AGAIN };
  return { kind: "error", message: messages[status] ?? GENERIC };
}

export async function addMemberCommand(
  client: ApothemApiClient,
  organizationId: string,
  input: { email: string; role: string },
): Promise<CommandResult> {
  if (!isUuid(organizationId)) return { kind: "error", message: ORG_NOT_FOUND };
  const email = input.email.trim().toLowerCase();
  if (!EMAIL.test(email)) return { kind: "error", message: "Enter a valid email address." };
  if (!isRole(input.role)) return { kind: "error", message: "Choose a valid role." };
  const role = input.role;

  return guarded(async () => {
    const { response } = await addMember(client, organizationId, { email, role });
    if (response.status < 300) return { kind: "done", message: "Member added." };
    return failure(response.status, {
      403: "Your role cannot add members with that role.",
      404: "No active account found for that email.",
      409: "This account is already a member.",
    });
  });
}

export async function changeMemberRoleCommand(
  client: ApothemApiClient,
  organizationId: string,
  membershipId: string,
  role: string,
): Promise<CommandResult> {
  if (!isUuid(organizationId)) return { kind: "error", message: ORG_NOT_FOUND };
  if (!isUuid(membershipId)) return { kind: "error", message: MEMBER_NOT_FOUND };
  if (!isRole(role)) return { kind: "error", message: "Choose a valid role." };

  return guarded(async () => {
    const { response } = await changeMemberRole(client, organizationId, membershipId, role);
    if (response.status < 300) return { kind: "done", message: "Role updated." };
    return failure(response.status, {
      403: "Your role cannot make this change.",
      404: MEMBER_NOT_FOUND,
      409: CONFLICT,
    });
  });
}

export async function revokeMemberCommand(
  client: ApothemApiClient,
  organizationId: string,
  membershipId: string,
): Promise<CommandResult> {
  if (!isUuid(organizationId)) return { kind: "error", message: ORG_NOT_FOUND };
  if (!isUuid(membershipId)) return { kind: "error", message: MEMBER_NOT_FOUND };

  return guarded(async () => {
    const { response } = await revokeMember(client, organizationId, membershipId);
    if (response.status < 300) return { kind: "done", message: "Access revoked." };
    return failure(response.status, {
      403: "Your role cannot make this change.",
      404: MEMBER_NOT_FOUND,
      409: CONFLICT,
    });
  });
}
