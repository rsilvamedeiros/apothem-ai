import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { createAgentCommand, publishAgentCommand } from "./agent-commands";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT_ID = "33333333-3333-4333-8333-333333333333";

type Reply = { data?: unknown; error?: unknown; response: { status: number } };

function clientReplying(reply: Reply, seen: { body?: unknown; path?: string }[] = []) {
  const handler = async (path: string, init?: { body?: unknown }) => {
    seen.push({ path, body: init?.body });
    return reply;
  };
  return { GET: handler, POST: handler, PATCH: handler } as unknown as ApothemApiClient;
}

const throwing = (error: unknown) =>
  ({ POST: async () => { throw error; }, PATCH: async () => { throw error; } }) as unknown as ApothemApiClient;

describe("createAgentCommand", () => {
  it("returns the new agent id and sends only the validated input", async () => {
    const seen: { body?: unknown }[] = [];
    const client = clientReplying({ data: { agent: { id: AGENT_ID } }, response: { status: 201 } }, seen);
    const result = await createAgentCommand(client, ORG, WS, { name: "A", slug: "a" });
    expect(result).toEqual({ kind: "created", agentId: AGENT_ID });
    expect(seen[0]?.body).toEqual({ name: "A", slug: "a" });
  });

  it("maps a 409 to a slug field error", async () => {
    const result = await createAgentCommand(clientReplying({ response: { status: 409 } }), ORG, WS, { name: "A", slug: "a" });
    expect(result).toEqual({ kind: "invalid", errors: { slug: "This slug is already used in this workspace." } });
  });

  it.each([
    [400, "Some fields are invalid. Review the form and try again."],
    [401, "You need to sign in again."],
    [403, "You don't have permission to create agents in this workspace."],
    [404, "This workspace was not found."],
  ])("maps HTTP %i to a safe form message", async (status, message) => {
    const result = await createAgentCommand(clientReplying({ response: { status } }), ORG, WS, { name: "A", slug: "a" });
    expect(result).toEqual({ kind: "error", message });
  });

  it("does not echo API error bodies", async () => {
    const result = await createAgentCommand(
      clientReplying({ error: { error: { message: "SELECT * FROM secrets" }, }, response: { status: 500 } }),
      ORG,
      WS,
      { name: "A", slug: "a" },
    );
    expect(JSON.stringify(result)).not.toContain("SELECT");
    expect(result.kind).toBe("error");
  });

  it("reports an unreachable API without throwing", async () => {
    const result = await createAgentCommand(throwing(new TypeError("fetch failed")), ORG, WS, { name: "A", slug: "a" });
    expect(result).toEqual({ kind: "error", message: "apothem-api is unreachable. Try again shortly." });
  });

  it("refuses non-UUID ids before calling the API", async () => {
    const seen: { body?: unknown; path?: string }[] = [];
    const result = await createAgentCommand(clientReplying({ response: { status: 201 } }, seen), "../x", WS, { name: "A", slug: "a" });
    expect(result).toEqual({ kind: "error", message: "This workspace was not found." });
    expect(seen).toHaveLength(0);
  });
});

describe("publishAgentCommand", () => {
  it("returns published with the version number", async () => {
    const client = clientReplying({ data: { versionNumber: 3 }, response: { status: 201 } });
    expect(await publishAgentCommand(client, ORG, WS, AGENT_ID)).toEqual({ kind: "published", versionNumber: 3 });
  });

  it("explains missing instructions on 400", async () => {
    const result = await publishAgentCommand(clientReplying({ response: { status: 400 } }), ORG, WS, AGENT_ID);
    expect(result).toEqual({ kind: "error", message: "Add instructions to the draft before publishing." });
  });

  it("explains archived agents on 409", async () => {
    const result = await publishAgentCommand(clientReplying({ response: { status: 409 } }), ORG, WS, AGENT_ID);
    expect(result).toEqual({ kind: "error", message: "This agent is archived and cannot be published." });
  });

  it("explains missing permission on 403", async () => {
    const result = await publishAgentCommand(clientReplying({ response: { status: 403 } }), ORG, WS, AGENT_ID);
    expect(result).toEqual({ kind: "error", message: "You don't have permission to publish agents." });
  });
});
