import { googleConfigured } from "@/auth";
import { createOrganizationAction } from "@/features/account/actions";
import { HomeView } from "@/features/account/home-view";
import { loadAccount, type LoadAccountResult } from "@/features/account/load-account";
import { getApiClient, hasSession } from "@/lib/session";
import { SignInPanel } from "./sign-in-panel";

export default async function HomePage() {
  const devSignInEnabled = process.env.NODE_ENV !== "production";

  const result: LoadAccountResult = (await hasSession())
    ? await loadAccount(await getApiClient())
    : { kind: "signed_out" };

  // No session, or the API says it is missing or expired: show sign-in.
  if (result.kind === "signed_out") {
    return <SignInPanel googleEnabled={googleConfigured} devSignInEnabled={devSignInEnabled} />;
  }

  return <HomeView result={result} createOrganization={createOrganizationAction} />;
}
