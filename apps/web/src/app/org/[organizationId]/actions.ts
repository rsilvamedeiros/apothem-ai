"use server";

import { revalidatePath } from "next/cache";
import { createWorkspace } from "@apothem/api-client";
import { getApiClient } from "@/lib/session";

export async function createWorkspaceAction(organizationId: string, formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!name || !slug) {
    throw new Error("name and slug are required");
  }

  const client = await getApiClient();
  const { error } = await createWorkspace(client, organizationId, { name, slug });
  if (error) {
    throw new Error("Failed to create workspace");
  }

  revalidatePath(`/org/${organizationId}`);
}
