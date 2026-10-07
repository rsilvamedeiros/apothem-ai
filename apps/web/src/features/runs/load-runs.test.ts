import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadRun, loadRuns } from "./load-runs";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const RUN = "44444444-4444-4444-8444-444444444444";

const run = { id: RUN, status: "completed" };
const step = { id: "s1", sequence: 1, type: "model_call", status: "completed" };

function client(status: number, data?: unknown, seen: unknown[] = []) {
  return {
    GET: async (_path: string, init?: { params?: { query?: unknown } }) => {
      seen.push(init?.params?.query);
      return { data, response: { status } };
    },
  } as unknown as ApothemApiClient;
}

describe("loadRuns", () => {
  it("returns runs and the next cursor, passing the cursor through", async () => {
    const seen: unknown[] = [];
    const result = await loadRuns(client(200, { runs: [run], nextCursor: "next" }, seen), ORG, WS, { cursor: "abc" });
    expect(result).toEqual({ kind: "ok", runs: [run], nextCursor: "next" });
    expect(seen[0]).toMatchObject({ cursor: "abc" });
  });

  it("does not call the API for malformed ids", async () => {
    const seen: unknown[] = [];
    expect(await loadRuns(client(200, {}, seen), "../x", WS, {})).toEqual({ kind: "error", message: "This workspace was not found." });
    expect(seen).toHaveLength(0);
  });

  it.each([
    [400, "That page of runs is no longer valid. Start again from the latest runs."],
    [401, "You need to sign in again."],
    [403, "You do not have permission to view runs."],
    [404, "This workspace was not found."],
    [500, "Runs could not be loaded. Try again shortly."],
  ])("maps HTTP %i to a safe message", async (status, message) => {
    expect(await loadRuns(client(status), ORG, WS, {})).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadRuns(network, ORG, WS, {})).toEqual({ kind: "unreachable" });
  });
});

describe("loadRun", () => {
  it("returns the run with its steps", async () => {
    expect(await loadRun(client(200, { run, steps: [step] }), ORG, WS, RUN)).toEqual({ kind: "ok", run, steps: [step] });
  });

  it("is not found for a malformed run id without calling the API", async () => {
    const seen: unknown[] = [];
    expect(await loadRun(client(200, {}, seen), ORG, WS, "nope")).toEqual({ kind: "not_found" });
    expect(seen).toHaveLength(0);
  });

  it("maps 404 to not_found and others to safe messages", async () => {
    expect(await loadRun(client(404), ORG, WS, RUN)).toEqual({ kind: "not_found" });
    expect(await loadRun(client(403), ORG, WS, RUN)).toEqual({ kind: "error", message: "You do not have permission to view runs." });
    expect(await loadRun(client(500), ORG, WS, RUN)).toEqual({ kind: "error", message: "The run could not be loaded. Try again shortly." });
  });
});
