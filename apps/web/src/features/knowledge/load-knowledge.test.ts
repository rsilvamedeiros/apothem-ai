import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadKnowledgeBase, loadKnowledgeBases } from "./load-knowledge";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const KB = "66666666-6666-4666-8666-666666666666";

type Reply = { status: number; data?: unknown };

/** Answers by path suffix so the detail loader can be given a different reply per call. */
function client(replies: Record<string, Reply>, seen: string[] = []) {
  return {
    GET: async (path: string) => {
      seen.push(path);
      const key = Object.keys(replies).find((suffix) => path.endsWith(suffix)) ?? "";
      const reply = replies[key] ?? { status: 500 };
      return { data: reply.data, response: { status: reply.status } };
    },
  } as unknown as ApothemApiClient;
}

describe("loadKnowledgeBases", () => {
  it("returns the bases of the workspace", async () => {
    const result = await loadKnowledgeBases(client({ "knowledge-bases": { status: 200, data: { knowledgeBases: [{ id: "k1" }] } } }), ORG, WS);
    expect(result).toEqual({ kind: "ok", bases: [{ id: "k1" }] });
  });

  it("does not call the API for malformed ids", async () => {
    const seen: string[] = [];
    expect(await loadKnowledgeBases(client({}, seen), "../x", WS)).toEqual({ kind: "error", message: "This workspace was not found." });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [401, "You need to sign in again."],
    [403, "You don't have access to knowledge in this workspace."],
    [404, "This workspace was not found."],
    [500, "Knowledge bases could not be loaded. Try again shortly."],
  ])("maps HTTP %i to a safe message", async (status, message) => {
    expect(await loadKnowledgeBases(client({ "knowledge-bases": { status } }), ORG, WS)).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadKnowledgeBases(network, ORG, WS)).toEqual({ kind: "unreachable" });
  });

  it("does not swallow unexpected errors", async () => {
    const broken = { GET: async () => { throw new Error("bug"); } } as unknown as ApothemApiClient;
    await expect(loadKnowledgeBases(broken, ORG, WS)).rejects.toThrow("bug");
  });
});

describe("loadKnowledgeBase", () => {
  const ok = {
    "{knowledgeBaseId}": { status: 200, data: { id: KB, name: "Handbook" } },
    documents: { status: 200, data: { documents: [{ id: "d1" }] } },
  };

  it("returns the base with its documents", async () => {
    expect(await loadKnowledgeBase(client(ok), ORG, WS, KB)).toEqual({
      kind: "ok",
      base: { id: KB, name: "Handbook" },
      documents: [{ id: "d1" }],
    });
  });

  it("treats malformed ids as not found without calling the API", async () => {
    const seen: string[] = [];
    expect(await loadKnowledgeBase(client(ok, seen), ORG, WS, "../x")).toEqual({ kind: "not_found" });
    expect(await loadKnowledgeBase(client(ok, seen), "nope", WS, KB)).toEqual({ kind: "not_found" });
    expect(seen).toHaveLength(0);
  });

  it("reports a missing base as not found", async () => {
    expect(await loadKnowledgeBase(client({ ...ok, "{knowledgeBaseId}": { status: 404 } }), ORG, WS, KB)).toEqual({ kind: "not_found" });
  });

  it.each([
    [401, "You need to sign in again."],
    [403, "You don't have access to knowledge in this workspace."],
    [500, "The knowledge base could not be loaded. Try again shortly."],
  ])("maps HTTP %i on the base to a safe message", async (status, message) => {
    expect(await loadKnowledgeBase(client({ ...ok, "{knowledgeBaseId}": { status } }), ORG, WS, KB)).toEqual({ kind: "error", message });
  });

  it("does not show a base whose documents could not be loaded", async () => {
    expect(await loadKnowledgeBase(client({ ...ok, documents: { status: 500 } }), ORG, WS, KB)).toEqual({
      kind: "error",
      message: "The documents could not be loaded. Try again shortly.",
    });
  });

  it("reports an unreachable API", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadKnowledgeBase(network, ORG, WS, KB)).toEqual({ kind: "unreachable" });
  });
});
