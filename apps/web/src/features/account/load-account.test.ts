import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadAccount } from "./load-account";

const overview = {
  principal: { id: "p1", email: "a@example.com", name: "A" },
  organizations: [{ id: "o1", name: "Acme", slug: "acme", role: "owner" }],
};

const client = (status: number, data?: unknown) =>
  ({ GET: async () => ({ data, response: { status } }) }) as unknown as ApothemApiClient;

describe("loadAccount", () => {
  it("returns the account overview", async () => {
    expect(await loadAccount(client(200, overview))).toEqual({ kind: "ok", ...overview });
  });

  it("treats 401 as signed out so the UI can show the sign-in page", async () => {
    expect(await loadAccount(client(401))).toEqual({ kind: "signed_out" });
  });

  it("maps other failures to a fixed message", async () => {
    expect(await loadAccount(client(500))).toEqual({
      kind: "error",
      message: "Your account could not be loaded. Try again shortly.",
    });
  });

  it("reports an unreachable API and rethrows unexpected errors", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadAccount(network)).toEqual({ kind: "unreachable" });
    const broken = { GET: async () => { throw new RangeError("boom"); } } as unknown as ApothemApiClient;
    await expect(loadAccount(broken)).rejects.toThrow("boom");
  });
});
