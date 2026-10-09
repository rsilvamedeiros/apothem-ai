import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import { decideApproval, getApprovalSummary, listApprovals } from "./approvals";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const APPROVAL = "55555555-5555-4555-8555-555555555555";
const BASE = `http://api.test/v1/organizations/${ORG}/workspaces/${WS}/approvals`;

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

describe("approvals api-client wrappers", () => {
  it("lists approvals with filters as query parameters", async () => {
    const { client, calls } = recording();
    await listApprovals(client, ORG, WS, { status: "pending", limit: 10, cursor: "abc" });
    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe(new URL(BASE).pathname);
    expect(Object.fromEntries(url.searchParams)).toEqual({ status: "pending", limit: "10", cursor: "abc" });
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
  });

  it("decides with only the decision and an optional reason", async () => {
    const { client, calls } = recording();
    await decideApproval(client, ORG, WS, APPROVAL, { decision: "reject", reason: "wrong customer" });
    expect(calls[0]?.method).toBe("POST");
    expect(calls[0]?.url).toBe(`${BASE}/${APPROVAL}/decision`);
    expect(await calls[0]?.json()).toEqual({ decision: "reject", reason: "wrong customer" });
  });

  it("surfaces refusals as data", async () => {
    const { client } = recording(409);
    expect((await decideApproval(client, ORG, WS, APPROVAL, { decision: "approve" })).response.status).toBe(409);
  });

  it("reads the summary of what needs a person", async () => {
    const { client, calls } = recording();
    await getApprovalSummary(client, ORG, WS);
    expect([calls[0]?.method, calls[0]?.url]).toEqual(["GET", `${BASE}/summary`]);
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
  });
});
