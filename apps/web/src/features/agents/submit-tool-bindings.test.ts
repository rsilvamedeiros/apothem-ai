import { describe, expect, it } from "vitest";
import type { ApothemApiClient } from "@apothem/api-client";
import { submitToolBindings } from "./submit-tool-bindings";

const ORG = "11111111-1111-4111-8111-111111111111";
const WS = "22222222-2222-4222-8222-222222222222";
const AGENT = "33333333-3333-4333-8333-333333333333";

const catalog = {
  tools: [
    { name: "get_current_time", description: "t", risk: "read_only", allowedApprovalModes: ["required", "auto"] },
    { name: "create_note", description: "n", risk: "reversible_write", allowedApprovalModes: ["required", "auto"] },
    { name: "wire_money", description: "m", risk: "irreversible", allowedApprovalModes: ["required"] },
  ],
};

type Seen = { patched?: unknown };
function client(options: { catalogStatus?: number; patchStatus?: number; seen?: Seen } = {}) {
  const seen = options.seen ?? {};
  return {
    GET: async () => ({ data: catalog, response: { status: options.catalogStatus ?? 200 } }),
    PATCH: async (_path: string, init?: { body?: unknown }) => {
      seen.patched = init?.body;
      return { data: {}, response: { status: options.patchStatus ?? 200 } };
    },
  } as unknown as ApothemApiClient;
}

const form = (entries: Record<string, unknown>) => ({ get: (key: string) => entries[key] ?? null });

describe("submitToolBindings", () => {
  it("saves the chosen bindings, validated against the catalog the server just loaded", async () => {
    const seen: Seen = {};
    const state = await submitToolBindings(client({ seen }), ORG, WS, AGENT, form({ "tool:create_note": "required", "tool:get_current_time": "auto" }));
    expect(state).toEqual({ ok: true, message: "Tools saved. They apply to the next version you publish." });
    expect(seen.patched).toEqual({
      toolBindings: [
        { tool: "get_current_time", approval: "auto" },
        { tool: "create_note", approval: "required" },
      ],
    });
  });

  it("can clear every binding", async () => {
    const seen: Seen = {};
    const state = await submitToolBindings(client({ seen }), ORG, WS, AGENT, form({}));
    expect(state.ok).toBe(true);
    expect(seen.patched).toEqual({ toolBindings: [] });
  });

  it("refuses an automatic irreversible tool without saving", async () => {
    const seen: Seen = {};
    const state = await submitToolBindings(client({ seen }), ORG, WS, AGENT, form({ "tool:wire_money": "auto" }));
    expect(state).toEqual({ ok: false, message: "That tool can only run after a person approves it." });
    expect(seen.patched).toBeUndefined();
  });

  it("ignores tool names the catalog does not have, so the form cannot invent a tool", async () => {
    const seen: Seen = {};
    await submitToolBindings(client({ seen }), ORG, WS, AGENT, form({ "tool:drop_database": "auto" }));
    expect(seen.patched).toEqual({ toolBindings: [] });
  });

  it("does not save when the catalog cannot be loaded", async () => {
    const seen: Seen = {};
    const state = await submitToolBindings(client({ catalogStatus: 500, seen }), ORG, WS, AGENT, form({ "tool:create_note": "required" }));
    expect(state).toEqual({ ok: false, message: "The tool catalog could not be loaded." });
    expect(seen.patched).toBeUndefined();
  });

  it("surfaces API refusals as a fixed message", async () => {
    expect(await submitToolBindings(client({ patchStatus: 403 }), ORG, WS, AGENT, form({ "tool:create_note": "required" }))).toEqual({
      ok: false,
      message: "You don't have permission to edit this agent.",
    });
    expect(await submitToolBindings(client({ patchStatus: 409 }), ORG, WS, AGENT, form({}))).toEqual({
      ok: false,
      message: "This agent is archived and cannot be edited.",
    });
  });
});
