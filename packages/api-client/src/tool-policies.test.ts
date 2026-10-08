import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import { listToolPolicies, removeToolPolicy, setToolPolicy } from "./tool-policies";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const ROOT = `http://api.test/v1/organizations/${ORG}/workspaces/${WS}/tool-policies`;

function recording(status = 200) {
  const calls: Request[] = [];
  const client = createApothemApiClient({
    baseUrl: "http://api.test",
    accessToken: "aaa.bbb.ccc",
    fetch: async (request) => {
      calls.push(request.clone());
      return new Response(status === 204 ? null : JSON.stringify({}), { status, headers: { "content-type": "application/json" } });
    },
  });
  return { client, calls };
}

describe("tool policy api-client wrappers", () => {
  it("lists the rules with the bearer token", async () => {
    const { client, calls } = recording();
    await listToolPolicies(client, ORG, WS);
    expect([calls[0]?.method, calls[0]?.url]).toEqual(["GET", ROOT]);
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
  });

  it("sets a rule with only the rule in the body: tool and workspace come from the path", async () => {
    const { client, calls } = recording();
    await setToolPolicy(client, ORG, WS, "create_note", "blocked");
    expect([calls[0]?.method, calls[0]?.url]).toEqual(["PUT", `${ROOT}/create_note`]);
    expect(await calls[0]?.json()).toEqual({ rule: "blocked" });
  });

  it("removes a rule", async () => {
    const { client, calls } = recording(204);
    await removeToolPolicy(client, ORG, WS, "create_note");
    expect([calls[0]?.method, calls[0]?.url]).toEqual(["DELETE", `${ROOT}/create_note`]);
  });

  it("surfaces refusals as data", async () => {
    const { client } = recording(403);
    expect((await setToolPolicy(client, ORG, WS, "create_note", "blocked")).response.status).toBe(403);
  });
});
