"use server";

import { redirect } from "next/navigation";
import { isUuid } from "@/lib/ids";
import { clearSessionPrincipalId, setSessionPrincipalId } from "@/lib/session";

export async function signIn(formData: FormData): Promise<void> {
  const principalId = String(formData.get("principalId") ?? "").trim();
  const organizationId = String(formData.get("organizationId") ?? "").trim();

  // Both ids end up in a cookie and a URL path; reject anything that is not a UUID.
  if (!isUuid(principalId) || !isUuid(organizationId)) {
    throw new Error("principalId and organizationId must be valid UUIDs");
  }

  await setSessionPrincipalId(principalId);
  redirect(`/org/${organizationId}`);
}

export async function signOut(): Promise<void> {
  await clearSessionPrincipalId();
  redirect("/");
}
