import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadAgents } from "./load-agents";

const agent = {
  id: "a1",
  organizationId: "o1",
  workspaceId: "w1",
  name: "Support",
  slug: "support",
  description: null,
  status: "active" as const,
  activeVersionId: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function clientReturning(result: { data?: unknown; response: { status: number } }) {
  return {
    GET: async () => result,
  } as unknown as ApothemApiClient;
}

function clientThrowing(error: unknown) {
  return {
    GET: async () => {
      throw error;
    },
  } as unknown as ApothemApiClient;
}

describe("loadAgents", () => {
  it("returns the agents on success", async () => {
    const result = await loadAgents(clientReturning({ data: [agent], response: { status: 200 } }), "o1", "w1");
    expect(result).toEqual({ kind: "ok", agents: [agent] });
  });

  it("treats a missing body as an empty list", async () => {
    const result = await loadAgents(clientReturning({ response: { status: 200 } }), "o1", "w1");
    expect(result).toEqual({ kind: "ok", agents: [] });
  });

  it.each([
    [401, "You need to sign in again."],
    [403, "You don't have access to agents in this workspace."],
    [404, "This workspace was not found."],
  ])("maps HTTP %i to a safe message", async (status, message) => {
    const result = await loadAgents(clientReturning({ response: { status } }), "o1", "w1");
    expect(result).toEqual({ kind: "error", message });
  });

  it("uses a generic message for other failures and never leaks details", async () => {
    const result = await loadAgents(clientReturning({ response: { status: 500 } }), "o1", "w1");
    expect(result).toEqual({ kind: "error", message: "Agents could not be loaded. Try again shortly." });
  });

  it("reports the API as unreachable on a network failure", async () => {
    const result = await loadAgents(clientThrowing(new TypeError("fetch failed")), "o1", "w1");
    expect(result).toEqual({ kind: "unreachable" });
  });

  it("rethrows unexpected errors instead of hiding them", async () => {
    await expect(loadAgents(clientThrowing(new RangeError("boom")), "o1", "w1")).rejects.toThrow("boom");
  });
});
