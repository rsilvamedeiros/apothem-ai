import { describe, expect, it } from "vitest";
import { MAX_TOOL_BINDINGS, bindingsToModes, describeRisk, parseToolBindingsForm, type ToolOption } from "./tool-bindings";

const TOOLS: ToolOption[] = [
  { name: "get_current_time", description: "time", risk: "read_only", allowedApprovalModes: ["required", "auto"] },
  { name: "create_note", description: "note", risk: "reversible_write", allowedApprovalModes: ["required", "auto"] },
  { name: "wire_money", description: "money", risk: "irreversible", allowedApprovalModes: ["required"] },
];

const form = (entries: Record<string, unknown>) => ({ get: (key: string) => entries[key] ?? null });

describe("bindingsToModes", () => {
  it("maps stored bindings to a mode per catalog tool, defaulting to off", () => {
    expect(bindingsToModes([{ tool: "create_note", approval: "required" }], TOOLS)).toEqual({
      get_current_time: "off",
      create_note: "required",
      wire_money: "off",
    });
  });

  it("ignores bindings for tools that are no longer in the catalog and malformed entries", () => {
    expect(bindingsToModes([{ tool: "gone", approval: "auto" }, null, "x", { tool: "create_note" }], TOOLS)).toEqual({
      get_current_time: "off",
      create_note: "off",
      wire_money: "off",
    });
    expect(bindingsToModes("not an array" as never, TOOLS).create_note).toBe("off");
  });
});

describe("parseToolBindingsForm", () => {
  it("builds bindings for every tool that is not off, in catalog order", () => {
    const result = parseToolBindingsForm(
      form({ "tool:create_note": "required", "tool:get_current_time": "auto", "tool:wire_money": "off" }),
      TOOLS,
    );
    expect(result).toEqual({
      ok: true,
      value: [
        { tool: "get_current_time", approval: "auto" },
        { tool: "create_note", approval: "required" },
      ],
    });
  });

  it("treats a missing field as off", () => {
    expect(parseToolBindingsForm(form({}), TOOLS)).toEqual({ ok: true, value: [] });
  });

  it("refuses to run an irreversible tool automatically", () => {
    expect(parseToolBindingsForm(form({ "tool:wire_money": "auto" }), TOOLS)).toEqual({
      ok: false,
      message: "That tool can only run after a person approves it.",
    });
  });

  it.each(["sometimes", "", "AUTO", 5, null])("rejects the unknown mode %j", (mode) => {
    const entries = mode === null || mode === "" ? {} : { "tool:create_note": mode };
    const result = parseToolBindingsForm(form(entries), TOOLS);
    if (mode === null || mode === "") expect(result).toEqual({ ok: true, value: [] });
    else expect(result).toEqual({ ok: false, message: "Choose off, ask first, or automatic for each tool." });
  });

  it("never invents tools: fields for names outside the catalog are ignored", () => {
    const result = parseToolBindingsForm(form({ "tool:drop_database": "auto", "tool:create_note": "required" }), TOOLS);
    expect(result).toEqual({ ok: true, value: [{ tool: "create_note", approval: "required" }] });
  });

  it("respects the limit on bindings", () => {
    const many: ToolOption[] = Array.from({ length: MAX_TOOL_BINDINGS + 1 }, (_, i) => ({
      name: `tool_${i}`,
      description: "x",
      risk: "read_only" as const,
      allowedApprovalModes: ["required", "auto"] as ("required" | "auto")[],
    }));
    const entries = Object.fromEntries(many.map((tool) => [`tool:${tool.name}`, "auto"]));
    expect(parseToolBindingsForm(form(entries), many)).toEqual({
      ok: false,
      message: `An agent can use at most ${MAX_TOOL_BINDINGS} tools.`,
    });
  });
});

describe("describeRisk", () => {
  it.each([
    ["read_only", "Read only"],
    ["reversible_write", "Changes data (can be undone)"],
    ["irreversible", "Irreversible"],
  ] as const)("labels %s", (risk, label) => {
    expect(describeRisk(risk).label).toBe(label);
  });

  it("falls back safely", () => {
    expect(describeRisk("weird" as never).label).toBe("Unknown risk");
  });
});
