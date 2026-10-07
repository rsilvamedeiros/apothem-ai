import { describe, expect, it } from "vitest";
import { createApothemApiClient } from "./client";
import { getAccount } from "./account";

describe("getAccount", () => {
  it("requests /v1/me with the credential", async () => {
    const calls: Request[] = [];
    const client = createApothemApiClient({
      baseUrl: "http://api.test",
      accessToken: "aaa.bbb.ccc",
      fetch: async (request) => {
        calls.push(request.clone());
        return new Response(JSON.stringify({ principal: {}, organizations: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    });
    await getAccount(client);
    expect(calls[0]?.method).toBe("GET");
    expect(calls[0]?.url).toBe("http://api.test/v1/me");
    expect(calls[0]?.headers.get("authorization")).toBe("Bearer aaa.bbb.ccc");
  });
});
