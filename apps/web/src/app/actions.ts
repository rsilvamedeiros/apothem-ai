"use server";

import { redirect } from "next/navigation";
import { parseSignIn } from "@/lib/sign-in";
import { clearSession, setSessionAccessToken, setSessionPrincipalId } from "@/lib/session";

export async function signIn(formData: FormData): Promise<void> {
  // Both the credential and the organization id end up in a cookie or a URL path.
  const parsed = parseSignIn(formData);
  if (!parsed.ok) {
    throw new Error("Provide an organization UUID and either an access token or a principal UUID");
  }

  const { value } = parsed;
  if (value.kind === "token") {
    await setSessionAccessToken(value.accessToken);
  } else {
    await setSessionPrincipalId(value.principalId);
  }
  redirect(`/org/${value.organizationId}`);
}

export async function signOut(): Promise<void> {
  await clearSession();
  redirect("/");
}
