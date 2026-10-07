import { getAccount, type ApothemApiClient } from "@apothem/api-client";
import { isNetworkError } from "@/lib/mock";

export type AccountOrganization = {
  id: string;
  name: string;
  slug: string;
  role: "owner" | "admin" | "builder" | "operator" | "auditor";
};

export type LoadAccountResult =
  | {
      kind: "ok";
      principal: { id: string; email: string; name: string };
      organizations: AccountOrganization[];
    }
  | { kind: "signed_out" }
  | { kind: "error"; message: string }
  | { kind: "unreachable" };

/** A 401 is not an error to show: it means the session is missing or expired. */
export async function loadAccount(client: ApothemApiClient): Promise<LoadAccountResult> {
  try {
    const { data, response } = await getAccount(client);
    if (response.status === 401) return { kind: "signed_out" };
    if (response.status >= 400 || !data) {
      return { kind: "error", message: "Your account could not be loaded. Try again shortly." };
    }
    return {
      kind: "ok",
      principal: data.principal,
      organizations: data.organizations as AccountOrganization[],
    };
  } catch (error) {
    if (isNetworkError(error)) return { kind: "unreachable" };
    throw error;
  }
}
