import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { MAX_RUN_INPUT_LENGTH, startRunCommand } from "./run-commands";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";

const run = {
  id: "run-1",
  agentId: AGENT,
  agentVersionId: "v1",
  requestedByPrincipalId: "p1",
  status: "completed",
  input: { text: "hi" },
  output: { text: "hello" },
  errorCode: null,
  errorMessage: null,
  modelProvider: "mock",
  model: "mock-1",
  inputTokens: 1,
  outputTokens: 2,
  createdAt: "2026-01-01T00:00:00.000Z",
  startedAt: "2026-01-01T00:00:00.000Z",
  finishedAt: "2026-01-01T00:00:01.000Z",
};

type Seen = { body?: unknown };
const client = (status: number, data?: unknown, seen: Seen[] = []) =>
  ({
    POST: async (_path: string, init?: { body?: unknown }) => {
      seen.push({ body: init?.body });
      return { data, response: { status } };
    },
  }) as unknown as ApothemApiClient;

describe("startRunCommand", () => {
  it("returns the run and sends only the trimmed task and a generated idempotency key", async () => {
    const seen: Seen[] = [];
    const result = await startRunCommand(client(201, { run, replayed: false }, seen), ORG, WS, AGENT, "  hi  ", "key-1");
    expect(result).toEqual({ kind: "done", run });
    expect(seen[0]?.body).toEqual({ input: "hi", idempotencyKey: "key-1" });
  });

  it("treats a failed run as a result to show, not as a transport error", async () => {
    const failed = { ...run, status: "failed", output: null, errorCode: "MODEL_POLICY_NO_ROUTE" };
    const result = await startRunCommand(client(201, { run: failed, replayed: false }), ORG, WS, AGENT, "hi", "k");
    expect(result).toEqual({ kind: "done", run: failed });
  });

  it.each([
    ["empty", ""],
    ["blank", "  \n "],
    ["too long", "x".repeat(MAX_RUN_INPUT_LENGTH + 1)],
  ])("rejects %s input without calling the API", async (_label, input) => {
    const seen: Seen[] = [];
    const result = await startRunCommand(client(201, { run }, seen), ORG, WS, AGENT, input, "k");
    expect(result).toEqual({ kind: "error", message: `Enter a task between 1 and ${MAX_RUN_INPUT_LENGTH} characters.` });
    expect(seen).toHaveLength(0);
  });

  it("refuses malformed ids before calling the API", async () => {
    const seen: Seen[] = [];
    const result = await startRunCommand(client(201, { run }, seen), ORG, WS, "../x", "hi", "k");
    expect(result).toEqual({ kind: "error", message: "This agent was not found." });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [400, "The task was rejected. Review it and try again."],
    [401, "You need to sign in again."],
    [403, "You don't have permission to run this agent."],
    [404, "This agent was not found."],
    [409, "This agent cannot run right now. Publish it first; disabled and archived agents cannot run."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i", async (status, message) => {
    expect(await startRunCommand(client(status), ORG, WS, AGENT, "hi", "k")).toEqual({ kind: "error", message });
  });

  it("does not accept a success response without a run", async () => {
    expect(await startRunCommand(client(201, {}), ORG, WS, AGENT, "hi", "k")).toMatchObject({ kind: "error" });
  });

  it("reports an unreachable API", async () => {
    const network = { POST: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await startRunCommand(network, ORG, WS, AGENT, "hi", "k")).toEqual({
      kind: "error",
      message: "apothem-api is unreachable. Try again shortly.",
    });
  });
});
