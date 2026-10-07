import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import { getRun, listRuns, startRun } from "./runs";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";
const RUN = "44444444-4444-4444-8444-444444444444";
const BASE = `http://api.test/v1/organizations/${ORG}/workspaces/${WS}`;

function recording(status = 200) {
  const calls: Request[] = [];
  const client = createApothemApiClient({
    baseUrl: "http://api.test",
    accessToken: "aaa.bbb.ccc",
    fetch: async (request) => {
      calls.push(request.clone());
      return new Response(JSON.stringify({}), { status, headers: { "content-type": "application/json" } });
    },
  });
  return { client, calls };
}

describe("runs api-client wrappers", () => {
  it("starts a run sending only the task text and the idempotency key", async () => {
    const { client, calls } = recording(201);
    await startRun(client, ORG, WS, AGENT, { input: "hello", idempotencyKey: "k-1" });
    expect(calls[0]?.method).toBe("POST");
    expect(calls[0]?.url).toBe(`${BASE}/agents/${AGENT}/runs`);
    expect(await calls[0]?.json()).toEqual({ input: "hello", idempotencyKey: "k-1" });
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
  });

  it("lists runs with filters as query parameters", async () => {
    const { client, calls } = recording();
    await listRuns(client, ORG, WS, { agentId: AGENT, limit: 10, cursor: "abc" });
    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe(`/v1/organizations/${ORG}/workspaces/${WS}/runs`);
    expect(Object.fromEntries(url.searchParams)).toEqual({ agentId: AGENT, limit: "10", cursor: "abc" });
  });

  it("reads one run", async () => {
    const { client, calls } = recording();
    await getRun(client, ORG, WS, RUN);
    expect(calls[0]?.url).toBe(`${BASE}/runs/${RUN}`);
  });

  it("surfaces API errors as data", async () => {
    const { client } = recording(409);
    expect((await startRun(client, ORG, WS, AGENT, { input: "x" })).response.status).toBe(409);
  });
});
