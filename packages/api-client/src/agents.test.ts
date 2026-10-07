import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import {
  archiveAgent,
  createAgent,
  disableAgent,
  getAgent,
  listAgents,
  listAgentVersions,
  publishAgent,
  updateAgentDraft,
} from "./agents";

const ORG = "11111111-1111-4111-8111-111111111111";
const WORKSPACE = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";
const BASE = `http://api.test/v1/organizations/${ORG}/workspaces/${WORKSPACE}/agents`;

function recordingClient(body: unknown = {}, status = 200) {
  const calls: Request[] = [];
  const client = createApothemApiClient({
    baseUrl: "http://api.test",
    principalId: "principal-1",
    fetch: async (request) => {
      calls.push(request.clone());
      return new Response(JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      });
    },
  });
  return { client, calls };
}

describe("agents api-client wrappers", () => {
  it("lists agents of a workspace with the principal header", async () => {
    const { client, calls } = recordingClient([]);
    await listAgents(client, ORG, WORKSPACE);
    expect(calls[0]?.method).toBe("GET");
    expect(calls[0]?.url).toBe(BASE);
    expect(calls[0]?.headers.get("x-principal-id")).toBe("principal-1");
  });

  it("gets one agent", async () => {
    const { client, calls } = recordingClient({});
    await getAgent(client, ORG, WORKSPACE, AGENT);
    expect(calls[0]?.url).toBe(`${BASE}/${AGENT}`);
  });

  it("creates an agent sending only name, slug and description", async () => {
    const { client, calls } = recordingClient({}, 201);
    await createAgent(client, ORG, WORKSPACE, { name: "Support", slug: "support" });
    expect(calls[0]?.method).toBe("POST");
    expect(await calls[0]?.json()).toEqual({ name: "Support", slug: "support" });
  });

  it("patches the draft", async () => {
    const { client, calls } = recordingClient({});
    await updateAgentDraft(client, ORG, WORKSPACE, AGENT, { instructions: "Be brief." });
    expect(calls[0]?.method).toBe("PATCH");
    expect(calls[0]?.url).toBe(`${BASE}/${AGENT}/draft`);
    expect(await calls[0]?.json()).toEqual({ instructions: "Be brief." });
  });

  it.each([
    ["publish", publishAgent],
    ["disable", disableAgent],
    ["archive", archiveAgent],
  ] as const)("posts to /%s", async (action, call) => {
    const { client, calls } = recordingClient({});
    await call(client, ORG, WORKSPACE, AGENT);
    expect(calls[0]?.method).toBe("POST");
    expect(calls[0]?.url).toBe(`${BASE}/${AGENT}/${action}`);
  });

  it("lists versions", async () => {
    const { client, calls } = recordingClient([]);
    await listAgentVersions(client, ORG, WORKSPACE, AGENT);
    expect(calls[0]?.url).toBe(`${BASE}/${AGENT}/versions`);
  });

  it("surfaces API errors as data, not exceptions", async () => {
    const { client } = recordingClient({ error: { code: "FORBIDDEN" } }, 403);
    const result = await listAgents(client, ORG, WORKSPACE);
    expect(result.response.status).toBe(403);
    expect(result.error).toBeDefined();
  });
});
