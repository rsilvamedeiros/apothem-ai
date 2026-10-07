import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { submitCreateAgent } from "./submit-create-agent";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";

function client(status: number, data?: unknown) {
  const calls: unknown[] = [];
  const handler = async (_path: string, init?: { body?: unknown }) => {
    calls.push(init?.body);
    return { data, response: { status } };
  };
  return { api: { POST: handler } as unknown as ApothemApiClient, calls };
}

const form = (entries: Record<string, string>) => new Map(Object.entries(entries));

describe("submitCreateAgent", () => {
  it("returns field errors without calling the API when the form is invalid", async () => {
    const { api, calls } = client(201);
    const result = await submitCreateAgent(api, ORG, WS, form({ name: "" }));
    expect(result).toMatchObject({ kind: "form", state: { errors: { name: expect.any(String) } } });
    expect(calls).toHaveLength(0);
  });

  it("asks the caller to redirect to the new agent on success", async () => {
    const { api, calls } = client(201, { agent: { id: AGENT } });
    const result = await submitCreateAgent(api, ORG, WS, form({ name: "Support Bot" }));
    expect(result).toEqual({ kind: "redirect", path: `/org/${ORG}/workspace/${WS}/agents/${AGENT}` });
    expect(calls[0]).toEqual({ name: "Support Bot", slug: "support-bot" });
  });

  it("maps an API conflict to a slug field error", async () => {
    const { api } = client(409);
    const result = await submitCreateAgent(api, ORG, WS, form({ name: "A", slug: "a" }));
    expect(result).toEqual({
      kind: "form",
      state: { errors: { slug: "This slug is already used in this workspace." } },
    });
  });

  it("maps other failures to a general message", async () => {
    const { api } = client(403);
    const result = await submitCreateAgent(api, ORG, WS, form({ name: "A", slug: "a" }));
    expect(result).toEqual({
      kind: "form",
      state: { message: "You don't have permission to create agents in this workspace." },
    });
  });
});
