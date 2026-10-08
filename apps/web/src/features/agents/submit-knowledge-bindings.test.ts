import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { submitKnowledgeBindings } from "./submit-knowledge-bindings";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";
const A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const GONE = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

const bases = {
  knowledgeBases: [
    { id: A, name: "A", description: null, status: "active", createdAt: "2026-03-04T12:00:00.000Z", archivedAt: null },
    { id: B, name: "B", description: null, status: "archived", createdAt: "2026-03-04T12:00:00.000Z", archivedAt: "2026-03-05T12:00:00.000Z" },
  ],
};

type Seen = { patched?: unknown };
function client(options: { listStatus?: number; patchStatus?: number; seen?: Seen } = {}) {
  const seen = options.seen ?? {};
  return {
    GET: async () => ({ data: bases, response: { status: options.listStatus ?? 200 } }),
    PATCH: async (_path: string, init?: { body?: unknown }) => {
      seen.patched = init?.body;
      return { data: {}, response: { status: options.patchStatus ?? 200 } };
    },
  } as unknown as ApothemApiClient;
}

const form = (entries: Record<string, unknown>) => ({ get: (key: string) => entries[key] ?? null });

describe("submitKnowledgeBindings", () => {
  it("saves the checked bases, validated against the list the server just loaded", async () => {
    const seen: Seen = {};
    const state = await submitKnowledgeBindings(client({ seen }), ORG, WS, AGENT, form({ [`base:${A}`]: "on" }));
    expect(state).toEqual({ ok: true, message: "Knowledge saved. It applies to the next version you publish." });
    expect(seen.patched).toEqual({ knowledgeBindings: [{ knowledgeBaseId: A }] });
  });

  it("can clear every binding", async () => {
    const seen: Seen = {};
    expect((await submitKnowledgeBindings(client({ seen }), ORG, WS, AGENT, form({}))).ok).toBe(true);
    expect(seen.patched).toEqual({ knowledgeBindings: [] });
  });

  it("cannot attach an archived base or an id the workspace does not have", async () => {
    const seen: Seen = {};
    await submitKnowledgeBindings(client({ seen }), ORG, WS, AGENT, form({ [`base:${B}`]: "on", [`base:${GONE}`]: "on" }));
    expect(seen.patched).toEqual({ knowledgeBindings: [] });
  });

  it("does not save when the bases cannot be loaded", async () => {
    const seen: Seen = {};
    const state = await submitKnowledgeBindings(client({ listStatus: 500, seen }), ORG, WS, AGENT, form({ [`base:${A}`]: "on" }));
    expect(state).toEqual({ ok: false, message: "Knowledge bases could not be loaded. Try again shortly." });
    expect(seen.patched).toBeUndefined();
  });

  it("reports an unreachable API without saving", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await submitKnowledgeBindings(network, ORG, WS, AGENT, form({}))).toEqual({ ok: false, message: "apothem-api is unreachable. Try again shortly." });
  });

  it("surfaces API refusals as a fixed message", async () => {
    expect(await submitKnowledgeBindings(client({ patchStatus: 403 }), ORG, WS, AGENT, form({}))).toEqual({
      ok: false,
      message: "You don't have permission to edit this agent.",
    });
    expect(await submitKnowledgeBindings(client({ patchStatus: 409 }), ORG, WS, AGENT, form({}))).toEqual({
      ok: false,
      message: "This agent is archived and cannot be edited.",
    });
  });
});
