import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadAuditEvents } from "./load-audit-events";

const ORG = "11111111-1111-4111-8111-111111111111";

const event = {
  id: "e1",
  organizationId: ORG,
  workspaceId: null,
  actorPrincipalId: "p1",
  action: "agent.created",
  targetType: "agent",
  targetId: "t1",
  metadata: null,
  createdAt: "2026-01-01T00:00:00.000Z",
};

function client(reply: { data?: unknown; status: number }, seen: unknown[] = []) {
  return {
    GET: async (_path: string, init?: { params?: { query?: unknown } }) => {
      seen.push(init?.params?.query);
      return { data: reply.data, response: { status: reply.status } };
    },
  } as unknown as ApothemApiClient;
}

describe("loadAuditEvents", () => {
  it("returns events and the next cursor", async () => {
    const result = await loadAuditEvents(client({ status: 200, data: { events: [event], nextCursor: "next" } }), ORG, {});
    expect(result).toEqual({ kind: "ok", events: [event], nextCursor: "next" });
  });

  it("passes the cursor through as a query parameter", async () => {
    const seen: unknown[] = [];
    await loadAuditEvents(client({ status: 200, data: { events: [], nextCursor: null } }, seen), ORG, { cursor: "abc" });
    expect(seen[0]).toMatchObject({ cursor: "abc" });
  });

  it("does not call the API for a malformed organization id", async () => {
    const seen: unknown[] = [];
    const result = await loadAuditEvents(client({ status: 200 }, seen), "../x", {});
    expect(result).toEqual({ kind: "error", message: "This organization was not found." });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [400, "That page of events is no longer valid. Start again from the latest events."],
    [401, "You need to sign in again."],
    [403, "You do not have permission to view the audit log."],
    [500, "The audit log could not be loaded. Try again shortly."],
  ])("maps HTTP %i to a safe message", async (status, message) => {
    expect(await loadAuditEvents(client({ status }), ORG, {})).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API", async () => {
    const throwing = {
      GET: async () => {
        throw new TypeError("fetch failed");
      },
    } as unknown as ApothemApiClient;
    expect(await loadAuditEvents(throwing, ORG, {})).toEqual({ kind: "unreachable" });
  });
});
