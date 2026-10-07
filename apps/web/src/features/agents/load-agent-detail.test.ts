import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadAgentDetail } from "./load-agent-detail";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";

const agent = { id: AGENT, name: "Support", slug: "support", description: null, status: "active", activeVersionId: "v1" };
const draft = { id: "d1", agentId: AGENT, instructions: "Be kind.", updatedAt: "2026-01-01T00:00:00.000Z" };
const versions = [{ id: "v1", versionNumber: 1, checksum: "abc", createdAt: "2026-01-01T00:00:00.000Z" }];

function client(routes: Record<string, { status: number; data?: unknown }>) {
  return {
    GET: async (path: string) => {
      const route = Object.entries(routes).find(([suffix]) => path.endsWith(suffix))?.[1];
      return { data: route?.data, response: { status: route?.status ?? 500 } };
    },
  } as unknown as ApothemApiClient;
}

describe("loadAgentDetail", () => {
  it("returns the agent, its draft and versions", async () => {
    const result = await loadAgentDetail(
      client({ "/versions": { status: 200, data: versions }, "/{agentId}": { status: 200, data: { agent, draft } } }),
      ORG, WS, AGENT,
    );
    expect(result).toMatchObject({ kind: "ok", agent: { id: AGENT }, draft: { instructions: "Be kind." }, versions });
  });

  it("is not found when the agent does not exist", async () => {
    const result = await loadAgentDetail(client({ "/{agentId}": { status: 404 }, "/versions": { status: 404 } }), ORG, WS, AGENT);
    expect(result).toEqual({ kind: "not_found" });
  });

  it("does not call the API for a malformed agent id", async () => {
    const result = await loadAgentDetail(client({}), ORG, WS, "../x");
    expect(result).toEqual({ kind: "not_found" });
  });

  it("maps forbidden and server errors to safe messages", async () => {
    const forbidden = await loadAgentDetail(client({ "/{agentId}": { status: 403 }, "/versions": { status: 403 } }), ORG, WS, AGENT);
    expect(forbidden).toEqual({ kind: "error", message: "You don't have access to this agent." });
    const broken = await loadAgentDetail(client({ "/{agentId}": { status: 500 }, "/versions": { status: 500 } }), ORG, WS, AGENT);
    expect(broken).toEqual({ kind: "error", message: "The agent could not be loaded. Try again shortly." });
  });
});
