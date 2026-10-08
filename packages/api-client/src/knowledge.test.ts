import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import {
  addKnowledgeDocument,
  archiveKnowledgeBase,
  createKnowledgeBase,
  getKnowledgeBase,
  listKnowledgeBases,
  listKnowledgeDocuments,
  removeKnowledgeDocument,
  searchKnowledgeBase,
} from "./knowledge";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const KB = "66666666-6666-4666-8666-666666666666";
const DOC = "77777777-7777-4777-8777-777777777777";
const ROOT = `http://api.test/v1/organizations/${ORG}/workspaces/${WS}/knowledge-bases`;

function recording(status = 200, body: unknown = {}) {
  const calls: Request[] = [];
  const client = createApothemApiClient({
    baseUrl: "http://api.test",
    accessToken: "aaa.bbb.ccc",
    fetch: async (request) => {
      calls.push(request.clone());
      return new Response(status === 204 ? null : JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
    },
  });
  return { client, calls };
}

describe("knowledge api-client wrappers", () => {
  it("lists and reads bases with the bearer token", async () => {
    const { client, calls } = recording();
    await listKnowledgeBases(client, ORG, WS);
    await getKnowledgeBase(client, ORG, WS, KB);
    expect(calls.map((c) => [c.method, c.url])).toEqual([
      ["GET", ROOT],
      ["GET", `${ROOT}/${KB}`],
    ]);
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
  });

  it("creates a base with a name and an optional description only", async () => {
    const { client, calls } = recording(201);
    await createKnowledgeBase(client, ORG, WS, { name: "Handbook", description: "Policies" });
    expect(calls[0]?.method).toBe("POST");
    expect(calls[0]?.url).toBe(ROOT);
    expect(await calls[0]?.json()).toEqual({ name: "Handbook", description: "Policies" });
  });

  it("archives a base without a body", async () => {
    const { client, calls } = recording();
    await archiveKnowledgeBase(client, ORG, WS, KB);
    expect(calls[0]?.method).toBe("POST");
    expect(calls[0]?.url).toBe(`${ROOT}/${KB}/archive`);
  });

  it("adds a document, lists documents and removes one", async () => {
    const { client, calls } = recording();
    await addKnowledgeDocument(client, ORG, WS, KB, { title: "Policy", content: "Refunds take five days." });
    await listKnowledgeDocuments(client, ORG, WS, KB);
    await removeKnowledgeDocument(client, ORG, WS, KB, DOC);
    expect(calls.map((c) => [c.method, c.url])).toEqual([
      ["POST", `${ROOT}/${KB}/documents`],
      ["GET", `${ROOT}/${KB}/documents`],
      ["DELETE", `${ROOT}/${KB}/documents/${DOC}`],
    ]);
    expect(await calls[0]?.json()).toEqual({ title: "Policy", content: "Refunds take five days." });
  });

  it("searches with only the query: the base comes from the path", async () => {
    const { client, calls } = recording();
    await searchKnowledgeBase(client, ORG, WS, KB, { query: "refund" });
    expect(calls[0]?.url).toBe(`${ROOT}/${KB}/search`);
    expect(await calls[0]?.json()).toEqual({ query: "refund" });
  });

  it("surfaces refusals as data", async () => {
    const { client } = recording(409);
    expect((await createKnowledgeBase(client, ORG, WS, { name: "Handbook" })).response.status).toBe(409);
  });
});
