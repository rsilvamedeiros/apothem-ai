import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import { addMember, changeMemberRole, listMembers, revokeMember } from "./members";

const ORG = "11111111-1111-4111-8111-111111111111";
const MEMBERSHIP = "44444444-4444-4444-8444-444444444444";
const BASE = `http://api.test/v1/organizations/${ORG}/members`;

function recordingClient(body: unknown = [], status = 200) {
  const calls: Request[] = [];
  const client = createApothemApiClient({
    baseUrl: "http://api.test",
    principalId: "principal-1",
    fetch: async (request) => {
      calls.push(request.clone());
      return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
    },
  });
  return { client, calls };
}

describe("members api-client wrappers", () => {
  it("lists members with the principal header", async () => {
    const { client, calls } = recordingClient();
    await listMembers(client, ORG);
    expect(calls[0]?.method).toBe("GET");
    expect(calls[0]?.url).toBe(BASE);
    expect(calls[0]?.headers.get("x-principal-id")).toBe("principal-1");
  });

  it("adds a member by email and role only", async () => {
    const { client, calls } = recordingClient({}, 201);
    await addMember(client, ORG, { email: "a@example.com", role: "builder" });
    expect(calls[0]?.method).toBe("POST");
    expect(await calls[0]?.json()).toEqual({ email: "a@example.com", role: "builder" });
  });

  it("changes a role through PATCH", async () => {
    const { client, calls } = recordingClient({});
    await changeMemberRole(client, ORG, MEMBERSHIP, "auditor");
    expect(calls[0]?.method).toBe("PATCH");
    expect(calls[0]?.url).toBe(`${BASE}/${MEMBERSHIP}`);
    expect(await calls[0]?.json()).toEqual({ role: "auditor" });
  });

  it("revokes through POST /revoke", async () => {
    const { client, calls } = recordingClient({});
    await revokeMember(client, ORG, MEMBERSHIP);
    expect(calls[0]?.method).toBe("POST");
    expect(calls[0]?.url).toBe(`${BASE}/${MEMBERSHIP}/revoke`);
  });

  it("surfaces API errors as data", async () => {
    const { client } = recordingClient({ error: {} }, 403);
    expect((await listMembers(client, ORG)).response.status).toBe(403);
  });
});
