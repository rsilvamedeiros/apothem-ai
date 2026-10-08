import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { loadToolPolicies } from "./load-tool-policies";
import { submitToolPolicies } from "./submit-tool-policies";
import { applyRuleChangesCommand } from "./tool-policy-commands";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";

type Call = { method: string; path: string; params?: unknown; body?: unknown };

/** One double for the three verbs: GET answers by path suffix, writes answer from a queue of statuses. */
function client(options: { policies?: unknown; policiesStatus?: number; catalogStatus?: number; writeStatuses?: number[]; calls?: Call[] } = {}) {
  const calls = options.calls ?? [];
  const queue = [...(options.writeStatuses ?? [])];
  const write = (method: string) => async (path: string, init?: { params?: unknown; body?: unknown }) => {
    calls.push({ method, path, params: init?.params, body: init?.body });
    return { data: {}, response: { status: queue.shift() ?? 200 } };
  };
  return {
    GET: async (path: string) => {
      if (path.endsWith("/v1/tools")) {
        return {
          data: {
            tools: [
              { name: "get_current_time", description: "t", risk: "read_only", allowedApprovalModes: ["required", "auto"] },
              { name: "create_note", description: "n", risk: "reversible_write", allowedApprovalModes: ["required", "auto"] },
            ],
          },
          response: { status: options.catalogStatus ?? 200 },
        };
      }
      return { data: { policies: options.policies ?? [] }, response: { status: options.policiesStatus ?? 200 } };
    },
    PUT: write("PUT"),
    DELETE: write("DELETE"),
  } as unknown as ApothemApiClient;
}

const form = (entries: Record<string, unknown>) => ({ get: (key: string) => entries[key] ?? null });

describe("loadToolPolicies", () => {
  it("returns one rule per tool", async () => {
    const result = await loadToolPolicies(client({ policies: [{ toolName: "create_note", rule: "blocked" }] }), ORG, WS);
    expect(result).toEqual({ kind: "ok", rules: { create_note: "blocked" } });
  });

  it("does not call the API for malformed ids", async () => {
    expect(await loadToolPolicies(client(), "../x", WS)).toEqual({ kind: "error", message: "This workspace was not found." });
  });

  it.each([
    [401, "You need to sign in again."],
    [403, "You don't have access to this workspace's tool policy."],
    [404, "This workspace was not found."],
    [500, "The tool policy could not be loaded. Try again shortly."],
  ])("maps HTTP %i to a safe message", async (status, message) => {
    expect(await loadToolPolicies(client({ policiesStatus: status }), ORG, WS)).toEqual({ kind: "error", message });
  });

  it("reports an unreachable API and rethrows anything else", async () => {
    const network = { GET: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await loadToolPolicies(network, ORG, WS)).toEqual({ kind: "unreachable" });
    const broken = { GET: async () => { throw new Error("bug"); } } as unknown as ApothemApiClient;
    await expect(loadToolPolicies(broken, ORG, WS)).rejects.toThrow("bug");
  });
});

describe("applyRuleChangesCommand", () => {
  it("sets and removes rules, one call each, with the tool in the path and only the rule in the body", async () => {
    const calls: Call[] = [];
    const result = await applyRuleChangesCommand(client({ calls }), ORG, WS, [
      { tool: "create_note", rule: "blocked" },
      { tool: "get_current_time", rule: null },
    ]);
    expect(result).toEqual({ kind: "done", applied: 2 });
    expect(calls.map((c) => [c.method, (c.params as { path: { toolName: string } }).path.toolName])).toEqual([
      ["PUT", "create_note"],
      ["DELETE", "get_current_time"],
    ]);
    expect(calls[0]!.body).toEqual({ rule: "blocked" });
  });

  it("stops at the first refusal with a fixed message, and says how many earlier changes were saved", async () => {
    const calls: Call[] = [];
    const result = await applyRuleChangesCommand(client({ calls, writeStatuses: [200, 403] }), ORG, WS, [
      { tool: "create_note", rule: "blocked" },
      { tool: "get_current_time", rule: "blocked" },
      { tool: "search_knowledge", rule: "blocked" },
    ]);
    expect(result).toEqual({ kind: "error", message: "Only owners and admins can change the tool policy. 1 earlier change was saved." });
    expect(calls).toHaveLength(2);
  });

  it.each([
    [400, "That rule was rejected. Review it and try again."],
    [401, "You need to sign in again."],
    [403, "Only owners and admins can change the tool policy."],
    [404, "This workspace or tool was not found."],
    [500, "Something went wrong. Try again shortly."],
  ])("maps HTTP %i on the first change to a fixed message", async (status, message) => {
    expect(await applyRuleChangesCommand(client({ writeStatuses: [status] }), ORG, WS, [{ tool: "create_note", rule: "blocked" }])).toEqual({
      kind: "error",
      message,
    });
  });

  it("pluralises the saved count", async () => {
    const result = await applyRuleChangesCommand(client({ writeStatuses: [200, 200, 500] }), ORG, WS, [
      { tool: "a", rule: "blocked" },
      { tool: "b", rule: "blocked" },
      { tool: "c", rule: "blocked" },
    ]);
    expect(result).toMatchObject({ message: expect.stringContaining("2 earlier changes were saved.") });
  });

  it("does nothing for malformed ids, and reports an unreachable API", async () => {
    const calls: Call[] = [];
    expect(await applyRuleChangesCommand(client({ calls }), "x", WS, [{ tool: "create_note", rule: "blocked" }])).toEqual({
      kind: "error",
      message: "This workspace was not found.",
    });
    expect(calls).toHaveLength(0);
    const network = { PUT: async () => { throw new TypeError("fetch failed"); } } as unknown as ApothemApiClient;
    expect(await applyRuleChangesCommand(network, ORG, WS, [{ tool: "create_note", rule: "blocked" }])).toEqual({
      kind: "error",
      message: "apothem-api is unreachable. Try again shortly.",
    });
  });

  it("rethrows anything that is not a network failure", async () => {
    const broken = { PUT: async () => { throw new Error("bug"); } } as unknown as ApothemApiClient;
    await expect(applyRuleChangesCommand(broken, ORG, WS, [{ tool: "create_note", rule: "blocked" }])).rejects.toThrow("bug");
  });

  it("succeeds with nothing to do", async () => {
    expect(await applyRuleChangesCommand(client(), ORG, WS, [])).toEqual({ kind: "done", applied: 0 });
  });
});

describe("submitToolPolicies", () => {
  it("sends only the differences from the rules the server just returned", async () => {
    const calls: Call[] = [];
    const state = await submitToolPolicies(
      client({ calls, policies: [{ toolName: "create_note", rule: "blocked" }] }),
      ORG,
      WS,
      form({ "rule:create_note": "blocked", "rule:get_current_time": "approval_required" }),
    );
    expect(state).toEqual({ ok: true, message: "Tool policy saved. It applies to the next run." });
    expect(calls.map((c) => c.method)).toEqual(["PUT"]);
    expect(calls[0]!.body).toEqual({ rule: "approval_required" });
  });

  it("removes a rule when the choice goes back to none", async () => {
    const calls: Call[] = [];
    await submitToolPolicies(client({ calls, policies: [{ toolName: "create_note", rule: "blocked" }] }), ORG, WS, form({ "rule:create_note": "none" }));
    expect(calls.map((c) => c.method)).toEqual(["DELETE"]);
  });

  it("says nothing changed, and calls nothing, when the form matches", async () => {
    const calls: Call[] = [];
    expect(await submitToolPolicies(client({ calls }), ORG, WS, form({ "rule:create_note": "none" }))).toEqual({ ok: true, message: "Nothing changed." });
    expect(calls).toHaveLength(0);
  });

  it("ignores tools that are not in the catalog, so the form cannot invent one", async () => {
    const calls: Call[] = [];
    await submitToolPolicies(client({ calls }), ORG, WS, form({ "rule:drop_database": "blocked" }));
    expect(calls).toHaveLength(0);
  });

  it("refuses a bad choice without saving anything", async () => {
    const calls: Call[] = [];
    expect(await submitToolPolicies(client({ calls }), ORG, WS, form({ "rule:create_note": "allow_everything" }))).toEqual({
      ok: false,
      message: "Choose no rule, always ask first, or blocked for each tool.",
    });
    expect(calls).toHaveLength(0);
  });

  it("does not save when the catalog or the current rules cannot be loaded", async () => {
    const calls: Call[] = [];
    expect(await submitToolPolicies(client({ calls, catalogStatus: 500 }), ORG, WS, form({ "rule:create_note": "blocked" }))).toEqual({
      ok: false,
      message: "The tool catalog could not be loaded.",
    });
    expect(await submitToolPolicies(client({ calls, policiesStatus: 403 }), ORG, WS, form({ "rule:create_note": "blocked" }))).toEqual({
      ok: false,
      message: "You don't have access to this workspace's tool policy.",
    });
    const network = {
      GET: async (path: string) => {
        if (path.endsWith("/v1/tools")) return { data: { tools: [{ name: "create_note", description: "n", risk: "reversible_write", allowedApprovalModes: ["required"] }] }, response: { status: 200 } };
        throw new TypeError("fetch failed");
      },
    } as unknown as ApothemApiClient;
    expect(await submitToolPolicies(network, ORG, WS, form({ "rule:create_note": "blocked" }))).toEqual({
      ok: false,
      message: "apothem-api is unreachable. Try again shortly.",
    });
    expect(calls).toHaveLength(0);
  });

  it("surfaces a refusal as a fixed message", async () => {
    expect(await submitToolPolicies(client({ writeStatuses: [403] }), ORG, WS, form({ "rule:create_note": "blocked" }))).toEqual({
      ok: false,
      message: "Only owners and admins can change the tool policy.",
    });
  });
});
