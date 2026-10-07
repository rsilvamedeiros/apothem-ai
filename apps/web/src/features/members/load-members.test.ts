import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadMembers } from "./load-members";

const ORG = "11111111-1111-4111-8111-111111111111";

const member = {
  membershipId: "m1",
  principalId: "p1",
  email: "a@example.com",
  name: "A",
  role: "owner",
  status: "active",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const client = (status: number, data?: unknown) =>
  ({ GET: async () => ({ data, response: { status } }) }) as unknown as ApothemApiClient;

describe("loadMembers", () => {
  it("returns the members", async () => {
    expect(await loadMembers(client(200, [member]), ORG)).toEqual({ kind: "ok", members: [member] });
  });

  it("does not call the API for a malformed organization id", async () => {
    expect(await loadMembers(client(200, []), "../x")).toEqual({ kind: "error", message: "This organization was not found." });
  });

  it.each([
    [401, "You need to sign in again."],
    [403, "You do not have permission to view members."],
    [404, "This organization was not found."],
    [500, "Members could not be loaded. Try again shortly."],
  ])("maps HTTP %i to a safe message", async (status, message) => {
    expect(await loadMembers(client(status), ORG)).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API and rethrows unexpected errors", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadMembers(network, ORG)).toEqual({ kind: "unreachable" });
    const broken = { GET: async () => { throw new RangeError("boom"); } } as unknown as ApothemApiClient;
    await expect(loadMembers(broken, ORG)).rejects.toThrow("boom");
  });
});
