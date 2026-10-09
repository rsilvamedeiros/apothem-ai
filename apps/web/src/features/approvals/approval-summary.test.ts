import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { describePending, formatPendingCount } from "./approval-summary";
import { loadApprovalSummary } from "./load-approval-summary";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";

function client(status: number, data?: unknown, seen: string[] = []) {
  return {
    GET: async (path: string) => {
      seen.push(path);
      return { data, response: { status } };
    },
  } as unknown as ApothemApiClient;
}

describe("formatPendingCount", () => {
  it.each([
    [1, "1"],
    [7, "7"],
    [99, "99"],
    [100, "99+"],
    [5000, "99+"],
  ])("shows %i as %s", (pending, text) => {
    expect(formatPendingCount(pending)).toBe(text);
  });
});

describe("describePending", () => {
  it("speaks the singular and the plural", () => {
    expect(describePending(1)).toBe("1 approval waiting for a person");
    expect(describePending(3)).toBe("3 approvals waiting for a person");
  });
});

describe("loadApprovalSummary", () => {
  it("returns the pending count", async () => {
    expect(await loadApprovalSummary(client(200, { pending: 4 }), ORG, WS)).toEqual({ kind: "ok", pending: 4 });
    expect(await loadApprovalSummary(client(200, { pending: 0 }), ORG, WS)).toEqual({ kind: "ok", pending: 0 });
  });

  it("does not call the API for malformed ids", async () => {
    const seen: string[] = [];
    expect(await loadApprovalSummary(client(200, { pending: 1 }, seen), "../x", WS)).toEqual({ kind: "hidden" });
    expect(await loadApprovalSummary(client(200, { pending: 1 }, seen), ORG, "nope")).toEqual({ kind: "hidden" });
    expect(seen).toHaveLength(0);
  });

  it.each([401, 403, 404, 500])("hides the count on HTTP %i instead of failing the page", async (status) => {
    expect(await loadApprovalSummary(client(status), ORG, WS)).toEqual({ kind: "hidden" });
  });

  it.each([[undefined], [{}], [{ pending: -1 }], [{ pending: 1.5 }], [{ pending: "3" }], [{ pending: null }]])(
    "hides a malformed answer (%j) rather than showing a guess",
    async (data) => {
      expect(await loadApprovalSummary(client(200, data), ORG, WS)).toEqual({ kind: "hidden" });
    },
  );

  it("hides the count when the API is unreachable, and rethrows anything else", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadApprovalSummary(network, ORG, WS)).toEqual({ kind: "hidden" });
    const broken = { GET: async () => { throw new Error("bug"); } } as unknown as ApothemApiClient;
    await expect(loadApprovalSummary(broken, ORG, WS)).rejects.toThrow("bug");
  });
});
