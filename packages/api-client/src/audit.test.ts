import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import { listAuditEvents } from "./audit";

const ORG = "11111111-1111-4111-8111-111111111111";

function recordingClient(status = 200) {
  const calls: Request[] = [];
  const client = createApothemApiClient({
    baseUrl: "http://api.test",
    principalId: "principal-1",
    fetch: async (request) => {
      calls.push(request.clone());
      return new Response(JSON.stringify({ events: [], nextCursor: null }), {
        status,
        headers: { "content-type": "application/json" },
      });
    },
  });
  return { client, calls };
}

describe("listAuditEvents", () => {
  it("requests the organization audit events with the principal header", async () => {
    const { client, calls } = recordingClient();
    await listAuditEvents(client, ORG);
    expect(calls[0]?.method).toBe("GET");
    expect(calls[0]?.url).toBe(`http://api.test/v1/organizations/${ORG}/audit-events`);
    expect(calls[0]?.headers.get("x-principal-id")).toBe("principal-1");
  });

  it("sends only the provided filters as query parameters", async () => {
    const { client, calls } = recordingClient();
    await listAuditEvents(client, ORG, { limit: 25, cursor: "abc", action: "agent.created" });
    const url = new URL(calls[0]!.url);
    expect(Object.fromEntries(url.searchParams)).toEqual({ limit: "25", cursor: "abc", action: "agent.created" });
  });

  it("surfaces API errors as data", async () => {
    const { client } = recordingClient(403);
    const result = await listAuditEvents(client, ORG);
    expect(result.response.status).toBe(403);
  });
});
