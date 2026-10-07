import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadApprovals } from "./load-approvals";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";

function client(status: number, data?: unknown, seen: unknown[] = []) {
  return {
    GET: async (_path: string, init?: { params?: { query?: unknown } }) => {
      seen.push(init?.params?.query);
      return { data, response: { status } };
    },
  } as unknown as ApothemApiClient;
}

describe("loadApprovals", () => {
  it("returns approvals and the next cursor, asking for pending ones by default", async () => {
    const seen: unknown[] = [];
    const result = await loadApprovals(client(200, { approvals: [{ id: "a1" }], nextCursor: "n" }, seen), ORG, WS, {});
    expect(result).toEqual({ kind: "ok", approvals: [{ id: "a1" }], nextCursor: "n" });
    expect(seen[0]).toMatchObject({ status: "pending" });
  });

  it("passes the cursor and a chosen status through", async () => {
    const seen: unknown[] = [];
    await loadApprovals(client(200, { approvals: [], nextCursor: null }, seen), ORG, WS, { cursor: "abc", status: "approved" });
    expect(seen[0]).toEqual({ status: "approved", cursor: "abc" });
  });

  it("ignores an unknown status instead of forwarding it", async () => {
    const seen: unknown[] = [];
    await loadApprovals(client(200, { approvals: [], nextCursor: null }, seen), ORG, WS, { status: "weird" });
    expect(seen[0]).toMatchObject({ status: "pending" });
  });

  it("does not call the API for malformed ids", async () => {
    const seen: unknown[] = [];
    expect(await loadApprovals(client(200, {}, seen), "../x", WS, {})).toEqual({ kind: "error", message: "This workspace was not found." });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [400, "That page of approvals is no longer valid. Start again from the latest ones."],
    [401, "You need to sign in again."],
    [403, "Only owners and admins can view the approval inbox."],
    [404, "This workspace was not found."],
    [500, "Approvals could not be loaded. Try again shortly."],
  ])("maps HTTP %i to a safe message", async (status, message) => {
    expect(await loadApprovals(client(status), ORG, WS, {})).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadApprovals(network, ORG, WS, {})).toEqual({ kind: "unreachable" });
  });
});
