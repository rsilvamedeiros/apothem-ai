import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { submitRun } from "./submit-run";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";
const form = (entries: Record<string, unknown>) => ({ get: (key: string) => entries[key] ?? null });

type Seen = { body?: { input: string; idempotencyKey?: string } };
function client(status: number, data?: unknown, seen: Seen[] = []) {
  return {
    POST: async (_path: string, init?: Seen) => {
      seen.push({ body: init?.body });
      return { data, response: { status } };
    },
  } as unknown as ApothemApiClient;
}

const run = { id: "r1", status: "completed", input: { text: "hi" }, output: { text: "yo" } };

describe("submitRun", () => {
  it("returns the run and forwards a valid idempotency key", async () => {
    const seen: Seen[] = [];
    const state = await submitRun(client(201, { run }, seen), ORG, WS, AGENT, form({ task: "hi", idempotencyKey: "key-123_abc" }));
    expect(state).toEqual({ run });
    expect(seen[0]?.body).toEqual({ input: "hi", idempotencyKey: "key-123_abc" });
  });

  it.each([null, "", "has space", "x".repeat(101), "bad/char", 42])("replaces an invalid idempotency key (%j) with a generated one", async (key) => {
    const seen: Seen[] = [];
    await submitRun(client(201, { run }, seen), ORG, WS, AGENT, form({ task: "hi", idempotencyKey: key }));
    expect(seen[0]?.body?.idempotencyKey).toMatch(/^[A-Za-z0-9_.:-]{1,100}$/);
    expect(seen[0]?.body?.idempotencyKey).not.toBe(key);
  });

  it("surfaces command errors as a message", async () => {
    expect(await submitRun(client(409), ORG, WS, AGENT, form({ task: "hi" }))).toEqual({
      message: "This agent cannot run right now. Publish it first; disabled and archived agents cannot run.",
    });
  });

  it("treats a missing or non-text task as empty", async () => {
    const seen: Seen[] = [];
    expect(await submitRun(client(201, { run }, seen), ORG, WS, AGENT, form({}))).toMatchObject({ message: expect.stringContaining("Enter a task") });
    expect(await submitRun(client(201, { run }, seen), ORG, WS, AGENT, form({ task: new Blob(["x"]) }))).toMatchObject({
      message: expect.stringContaining("Enter a task"),
    });
    expect(seen).toHaveLength(0);
  });

  it("never reads tenant or agent ids from the form", async () => {
    const seen: Seen[] = [];
    await submitRun(client(201, { run }, seen), ORG, WS, AGENT, form({ task: "hi", organizationId: "evil", agentId: "evil" }));
    expect(JSON.stringify(seen[0])).not.toContain("evil");
  });
});
