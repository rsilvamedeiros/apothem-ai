import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { addDocumentCommand, archiveBaseCommand, createBaseCommand, removeDocumentCommand, searchCommand } from "./knowledge-commands";
import { KNOWLEDGE_LIMITS } from "./knowledge-model";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const KB = "66666666-6666-4666-8666-666666666666";
const DOC = "77777777-7777-4777-8777-777777777777";

type Call = { method: string; path: string; body?: unknown };

function client(status: number, data?: unknown, calls: Call[] = []) {
  const reply = (method: string) => async (path: string, init?: { body?: unknown }) => {
    calls.push({ method, path, body: init?.body });
    return { data, response: { status } };
  };
  return { GET: reply("GET"), POST: reply("POST"), DELETE: reply("DELETE") } as unknown as ApothemApiClient;
}

const network = {
  POST: async () => { throw new TypeError("fetch failed"); },
  DELETE: async () => { throw new TypeError("fetch failed"); },
} as unknown as ApothemApiClient;

const UNREACHABLE = { kind: "error", message: "apothem-api is unreachable. Try again shortly." };

describe("createBaseCommand", () => {
  const input = { name: "  Handbook ", description: "  Policies  " };

  it("creates a base with trimmed fields and returns its id", async () => {
    const calls: Call[] = [];
    expect(await createBaseCommand(client(201, { id: KB }, calls), ORG, WS, input)).toEqual({ kind: "created", knowledgeBaseId: KB });
    expect(calls[0]!.body).toEqual({ name: "Handbook", description: "Policies" });
  });

  it("leaves the description out when blank", async () => {
    const calls: Call[] = [];
    await createBaseCommand(client(201, { id: KB }, calls), ORG, WS, { name: "Handbook", description: "   " });
    expect(calls[0]!.body).toEqual({ name: "Handbook" });
  });

  it("validates locally and does not call the API", async () => {
    const calls: Call[] = [];
    const c = client(201, { id: KB }, calls);
    expect(await createBaseCommand(c, ORG, WS, { name: "  ", description: "" })).toEqual({ kind: "error", message: "Give the knowledge base a name." });
    expect((await createBaseCommand(c, ORG, WS, { name: "n".repeat(KNOWLEDGE_LIMITS.name + 1), description: "" })).kind).toBe("error");
    expect((await createBaseCommand(c, ORG, WS, { name: "ok", description: "d".repeat(KNOWLEDGE_LIMITS.description + 1) })).kind).toBe("error");
    expect(await createBaseCommand(c, "../x", WS, { name: "ok", description: "" })).toEqual({ kind: "error", message: "This workspace was not found." });
    expect(calls).toHaveLength(0);
    expect((await createBaseCommand(c, ORG, WS, { name: "n".repeat(KNOWLEDGE_LIMITS.name), description: "" })).kind).toBe("created");
  });

  it.each([
    [400, "Some fields are invalid. Review the form and try again."],
    [401, "You need to sign in again."],
    [403, "You don't have permission to manage knowledge in this workspace."],
    [404, "This workspace was not found."],
    [409, "A knowledge base with this name already exists, or this workspace reached its limit of 20."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i to a fixed message", async (status, message) => {
    expect(await createBaseCommand(client(status, { error: { message: "internal detail" } }), ORG, WS, input)).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API, and rethrows anything else", async () => {
    expect(await createBaseCommand(network, ORG, WS, input)).toEqual(UNREACHABLE);
    const broken = { POST: async () => { throw new Error("bug"); } } as unknown as ApothemApiClient;
    await expect(createBaseCommand(broken, ORG, WS, input)).rejects.toThrow("bug");
  });
});

describe("archiveBaseCommand", () => {
  it("archives and says what changes for agents", async () => {
    const calls: Call[] = [];
    expect(await archiveBaseCommand(client(200, {}, calls), ORG, WS, KB)).toEqual({
      kind: "done",
      message: "Archived. Agents no longer retrieve from this knowledge base.",
    });
    expect(calls[0]!.path).toContain("archive");
  });

  it.each([
    [403, "You don't have permission to manage knowledge in this workspace."],
    [404, "This knowledge base was not found."],
    [409, "This knowledge base is already archived."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i to a fixed message", async (status, message) => {
    expect(await archiveBaseCommand(client(status), ORG, WS, KB)).toEqual({ kind: "error", message });
  });

  it("rejects malformed ids without calling the API, and reports an unreachable API", async () => {
    const calls: Call[] = [];
    expect(await archiveBaseCommand(client(200, {}, calls), ORG, WS, "../x")).toEqual({ kind: "error", message: "This knowledge base was not found." });
    expect(calls).toHaveLength(0);
    expect(await archiveBaseCommand(network, ORG, WS, KB)).toEqual(UNREACHABLE);
  });
});

describe("addDocumentCommand", () => {
  const input = { title: "  Refund policy ", content: "  Refunds take five days.  " };

  it("adds a document with trimmed fields", async () => {
    const calls: Call[] = [];
    expect(await addDocumentCommand(client(201, { document: {}, replayed: false }, calls), ORG, WS, KB, input)).toEqual({
      kind: "done",
      message: "Document added. Agents can retrieve from it now.",
    });
    expect(calls[0]!.body).toEqual({ title: "Refund policy", content: "Refunds take five days." });
  });

  it("tells the person when the same text was already there", async () => {
    expect(await addDocumentCommand(client(200, { document: {}, replayed: true }), ORG, WS, KB, input)).toEqual({
      kind: "done",
      message: "This text is already in the knowledge base, so nothing was added.",
    });
  });

  it("validates locally and does not call the API", async () => {
    const calls: Call[] = [];
    const c = client(201, { document: {}, replayed: false }, calls);
    expect(await addDocumentCommand(c, ORG, WS, KB, { title: " ", content: "text" })).toEqual({ kind: "error", message: "Give the document a title." });
    expect(await addDocumentCommand(c, ORG, WS, KB, { title: "T", content: "  " })).toEqual({ kind: "error", message: "Paste the text of the document." });
    expect((await addDocumentCommand(c, ORG, WS, KB, { title: "t".repeat(KNOWLEDGE_LIMITS.title + 1), content: "x" })).kind).toBe("error");
    expect(await addDocumentCommand(c, ORG, WS, KB, { title: "T", content: "x".repeat(KNOWLEDGE_LIMITS.content + 1) })).toEqual({
      kind: "error",
      message: "Keep the text under 100,000 characters.",
    });
    expect(await addDocumentCommand(c, ORG, "x", KB, input)).toEqual({ kind: "error", message: "This knowledge base was not found." });
    expect(calls).toHaveLength(0);
    expect((await addDocumentCommand(c, ORG, WS, KB, { title: "t".repeat(KNOWLEDGE_LIMITS.title), content: "x".repeat(KNOWLEDGE_LIMITS.content) })).kind).toBe("done");
  });

  it.each([
    [400, "The document was rejected. Check the title and the text."],
    [403, "You don't have permission to manage knowledge in this workspace."],
    [404, "This knowledge base was not found."],
    [409, "This knowledge base is archived or has reached its limit of 100 documents."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i to a fixed message", async (status, message) => {
    expect(await addDocumentCommand(client(status), ORG, WS, KB, input)).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API", async () => {
    expect(await addDocumentCommand(network, ORG, WS, KB, input)).toEqual(UNREACHABLE);
  });
});

describe("removeDocumentCommand", () => {
  it("removes the document", async () => {
    const calls: Call[] = [];
    expect(await removeDocumentCommand(client(204, undefined, calls), ORG, WS, KB, DOC)).toEqual({
      kind: "done",
      message: "Document removed. Agents can no longer retrieve from it.",
    });
    expect(calls[0]!.method).toBe("DELETE");
  });

  it.each([
    [403, "You don't have permission to manage knowledge in this workspace."],
    [404, "This document was not found."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i to a fixed message", async (status, message) => {
    expect(await removeDocumentCommand(client(status), ORG, WS, KB, DOC)).toEqual({ kind: "error", message });
  });

  it("rejects malformed ids and reports an unreachable API", async () => {
    const calls: Call[] = [];
    expect(await removeDocumentCommand(client(204, undefined, calls), ORG, WS, KB, "../x")).toEqual({ kind: "error", message: "This document was not found." });
    expect(calls).toHaveLength(0);
    expect(await removeDocumentCommand(network, ORG, WS, KB, DOC)).toEqual(UNREACHABLE);
  });
});

describe("searchCommand", () => {
  const evidence = { evidenceId: "e1", knowledgeBaseId: KB, documentId: DOC, title: "Policy", section: null, ordinal: 0, text: "Five days.", score: 0.4 };

  it("returns the passages for a trimmed query", async () => {
    const calls: Call[] = [];
    expect(await searchCommand(client(200, { results: [evidence] }, calls), ORG, WS, KB, "  refund  ")).toEqual({ kind: "results", results: [evidence] });
    expect(calls[0]!.body).toEqual({ query: "refund" });
  });

  it("returns an empty list when nothing matches", async () => {
    expect(await searchCommand(client(200, { results: [] }), ORG, WS, KB, "zebra")).toEqual({ kind: "results", results: [] });
  });

  it("validates locally and does not call the API", async () => {
    const calls: Call[] = [];
    const c = client(200, { results: [] }, calls);
    expect(await searchCommand(c, ORG, WS, KB, "   ")).toEqual({ kind: "error", message: "Type a question or a few words to search for." });
    expect((await searchCommand(c, ORG, WS, KB, "q".repeat(KNOWLEDGE_LIMITS.query + 1))).kind).toBe("error");
    expect(await searchCommand(c, "x", WS, KB, "refund")).toEqual({ kind: "error", message: "This knowledge base was not found." });
    expect(calls).toHaveLength(0);
    expect((await searchCommand(c, ORG, WS, KB, "q".repeat(KNOWLEDGE_LIMITS.query))).kind).toBe("results");
  });

  it.each([
    [400, "Use at least one word made of letters or numbers."],
    [403, "You don't have permission to search this knowledge base."],
    [404, "This knowledge base was not found."],
    [409, "This knowledge base is archived, so it cannot be searched."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i to a fixed message", async (status, message) => {
    expect(await searchCommand(client(status), ORG, WS, KB, "refund")).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API", async () => {
    expect(await searchCommand(network, ORG, WS, KB, "refund")).toEqual(UNREACHABLE);
  });
});
