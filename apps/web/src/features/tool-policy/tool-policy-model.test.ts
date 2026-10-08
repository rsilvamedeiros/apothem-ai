import { describe, expect, it } from "vitest";
import { describeRule, parseRulesForm, RULE_OPTIONS, rulesFromList } from "./tool-policy-model";

const form = (entries: Record<string, unknown>) => ({ get: (key: string) => entries[key] ?? null });
const tools = [{ name: "get_current_time" }, { name: "create_note" }, { name: "search_knowledge" }];

describe("describeRule", () => {
  it("names each rule with a tone, and nothing for no rule or an unknown one", () => {
    expect(describeRule("blocked")).toEqual({ label: "Blocked in this workspace", tone: "danger" });
    expect(describeRule("approval_required")).toEqual({ label: "Always asks first in this workspace", tone: "warning" });
    expect(describeRule(undefined)).toBeUndefined();
    expect(describeRule("allow_everything")).toBeUndefined();
    expect(describeRule("toString")).toBeUndefined();
  });

  it("offers no rule, ask first and blocked, in that order of strictness", () => {
    expect(RULE_OPTIONS.map((option) => option.value)).toEqual(["none", "approval_required", "blocked"]);
  });
});

describe("rulesFromList", () => {
  it("keeps one rule per tool", () => {
    expect(rulesFromList([{ toolName: "create_note", rule: "blocked" }, { toolName: "get_current_time", rule: "approval_required" }])).toEqual({
      create_note: "blocked",
      get_current_time: "approval_required",
    });
  });

  it("ignores anything malformed or unknown", () => {
    expect(rulesFromList(undefined)).toEqual({});
    expect(rulesFromList({ toolName: "create_note", rule: "blocked" })).toEqual({});
    expect(rulesFromList([null, 5, "x", {}, { toolName: 5, rule: "blocked" }, { toolName: "create_note", rule: "allow_everything" }])).toEqual({});
  });
});

describe("parseRulesForm", () => {
  it("reports only what changed against the current rules", () => {
    const result = parseRulesForm(
      form({ "rule:get_current_time": "none", "rule:create_note": "blocked", "rule:search_knowledge": "approval_required" }),
      tools,
      { create_note: "blocked", search_knowledge: "blocked" },
    );
    expect(result).toEqual({ ok: true, changes: [{ tool: "search_knowledge", rule: "approval_required" }] });
  });

  it("turns none into a removal, and a new rule into a set", () => {
    expect(parseRulesForm(form({ "rule:create_note": "none", "rule:get_current_time": "blocked" }), tools, { create_note: "blocked" })).toEqual({
      ok: true,
      changes: [
        { tool: "get_current_time", rule: "blocked" },
        { tool: "create_note", rule: null },
      ],
    });
  });

  it("changes nothing when the form matches", () => {
    expect(parseRulesForm(form({ "rule:create_note": "blocked" }), tools, { create_note: "blocked" })).toEqual({ ok: true, changes: [] });
  });

  it("leaves a tool that is missing from the form as it is", () => {
    expect(parseRulesForm(form({}), tools, { create_note: "blocked" })).toEqual({ ok: true, changes: [] });
  });

  it("cannot invent a tool: names outside the catalog are ignored", () => {
    expect(parseRulesForm(form({ "rule:drop_database": "blocked", "rule:toString": "blocked" }), tools, {})).toEqual({ ok: true, changes: [] });
  });

  it("refuses a value that is not one of the three choices", () => {
    expect(parseRulesForm(form({ "rule:create_note": "allow_everything" }), tools, {})).toEqual({
      ok: false,
      message: "Choose no rule, always ask first, or blocked for each tool.",
    });
    expect(parseRulesForm(form({ "rule:create_note": "" }), tools, {}).ok).toBe(false);
  });

  it("is not fooled by inherited property names in the current rules", () => {
    expect(parseRulesForm(form({ "rule:constructor": "blocked" }), [{ name: "constructor" }], {})).toEqual({
      ok: true,
      changes: [{ tool: "constructor", rule: "blocked" }],
    });
  });
});
