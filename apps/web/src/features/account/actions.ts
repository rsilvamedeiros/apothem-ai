"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { getApiClient } from "@/lib/session";
import { createOrganizationCommand, parseOrganizationForm } from "./organization-commands";

export async function createOrganizationAction(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = parseOrganizationForm(formData);
  if (!parsed.ok) return { ok: false, message: parsed.message };

  const result = await createOrganizationCommand(await getApiClient(), parsed.value);
  if (result.kind === "error") return { ok: false, message: result.message };

  redirect(`/org/${result.organizationId}`);
}
