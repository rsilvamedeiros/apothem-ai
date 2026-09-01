"use server";

import { redirect } from "next/navigation";
import { clearSessionPrincipalId, setSessionPrincipalId } from "@/lib/session";

export async function signIn(formData: FormData): Promise<void> {
  const principalId = String(formData.get("principalId") ?? "").trim();
  const organizationId = String(formData.get("organizationId") ?? "").trim();

  if (!principalId || !organizationId) {
    throw new Error("principalId and organizationId are required");
  }

  await setSessionPrincipalId(principalId);
  redirect(`/org/${organizationId}`);
}

export async function signOut(): Promise<void> {
  await clearSessionPrincipalId();
  redirect("/");
}
