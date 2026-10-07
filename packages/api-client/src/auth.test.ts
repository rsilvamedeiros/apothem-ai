import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import { listMembers } from "./members";

const ORG = "11111111-1111-4111-8111-111111111111";

function recording(options: { principalId?: string; accessToken?: string }) {
  const calls: Request[] = [];
  const client = createApothemApiClient({
    baseUrl: "http://api.test",
    ...options,
    fetch: async (request) => {
      calls.push(request.clone());
      return new Response("[]", { status: 200, headers: { "content-type": "application/json" } });
    },
  });
  return { client, calls };
}

describe("api client credentials", () => {
  it("sends a bearer token as the Authorization header and no dev header", async () => {
    const { client, calls } = recording({ accessToken: "aaa.bbb.ccc" });
    await listMembers(client, ORG);
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
    expect(calls[0]?.headers.get("x-principal-id")).toBeNull();
  });

  it("prefers the access token over the dev principal id when both are set", async () => {
    const { client, calls } = recording({ accessToken: "aaa.bbb.ccc", principalId: "p1" });
    await listMembers(client, ORG);
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
    expect(calls[0]?.headers.get("x-principal-id")).toBeNull();
  });

  it("falls back to the dev principal header when no token is given", async () => {
    const { client, calls } = recording({ principalId: "p1" });
    await listMembers(client, ORG);
    expect(calls[0]?.headers.get("x-principal-id")).toBe("p1");
    expect(calls[0]?.headers.get("authorization")).toBeNull();
  });

  it("sends no credential when none is configured", async () => {
    const { client, calls } = recording({});
    await listMembers(client, ORG);
    expect(calls[0]?.headers.get("authorization")).toBeNull();
    expect(calls[0]?.headers.get("x-principal-id")).toBeNull();
  });
});
