"use server";

import { redirect } from "next/navigation";
import { googleConfigured, signIn as authSignIn, signOut as authSignOut } from "@/auth";
import { parseSignIn } from "@/lib/sign-in";
import { clearSession, setSessionAccessToken, setSessionPrincipalId } from "@/lib/session";

/** Starts the Google flow; Auth.js redirects back to the home page (the organization picker). */
export async function signInWithGoogle(): Promise<void> {
  if (!googleConfigured) throw new Error("Google sign-in is not configured");
  await authSignIn("google", { redirectTo: "/" });
}

/** Local/dev bootstrap: paste an access token or a principal id. Never shown in production. */
export async function signIn(formData: FormData): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Manual sign-in is disabled in production");
  }
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
  if (googleConfigured) await authSignOut({ redirectTo: "/" });
  redirect("/");
}
