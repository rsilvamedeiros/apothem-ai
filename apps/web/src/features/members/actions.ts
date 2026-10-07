"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { getApiClient } from "@/lib/session";
import {
  addMemberCommand,
  changeMemberRoleCommand,
  revokeMemberCommand,
  type CommandResult,
} from "./member-commands";

function toState(organizationId: string, result: CommandResult): ActionState {
  if (result.kind === "done") revalidatePath(`/org/${organizationId}/members`);
  return { ok: result.kind === "done", message: result.message };
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** The organization id comes from the route (bound by the page), never from a form field. */
export async function addMemberAction(
  organizationId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const client = await getApiClient();
  const result = await addMemberCommand(client, organizationId, {
    email: text(formData, "email"),
    role: text(formData, "role"),
  });
  return toState(organizationId, result);
}

export async function changeMemberRoleAction(
  organizationId: string,
  membershipId: string,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const client = await getApiClient();
  const result = await changeMemberRoleCommand(client, organizationId, membershipId, text(formData, "role"));
  return toState(organizationId, result);
}

export async function revokeMemberAction(
  organizationId: string,
  membershipId: string,
): Promise<ActionState> {
  const client = await getApiClient();
  const result = await revokeMemberCommand(client, organizationId, membershipId);
  return toState(organizationId, result);
}
