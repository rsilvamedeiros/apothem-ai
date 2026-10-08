import { describe, expect, it } from "vitest";
import type { KnowledgeBaseView } from "@/features/knowledge/knowledge-model";
import { bindingsToSelection, countUnavailable, hasSearchTool, parseKnowledgeBindingsForm } from "./knowledge-bindings";

const ID = (n: number) => `00000000-0000-4000-8000-00000000000${n}`;
const base = (n: number, status: "active" | "archived" = "active"): KnowledgeBaseView => ({
  id: ID(n),
  name: `Base ${n}`,
  description: null,
  status,
  createdAt: "2026-03-04T12:00:00.000Z",
  archivedAt: null,
});
const form = (values: Record<string, string>) => ({ get: (key: string) => values[key] ?? null });

describe("bindingsToSelection", () => {
  it("reads the ids of well-formed bindings, once each", () => {
    expect(bindingsToSelection([{ knowledgeBaseId: ID(1) }, { knowledgeBaseId: ID(2) }, { knowledgeBaseId: ID(1) }])).toEqual([ID(1), ID(2)]);
  });

  it("ignores anything stale or malformed", () => {
    expect(bindingsToSelection(undefined)).toEqual([]);
    expect(bindingsToSelection({ knowledgeBaseId: ID(1) })).toEqual([]);
    expect(bindingsToSelection([null, 5, "x", {}, { knowledgeBaseId: 5 }, { knowledgeBaseId: "../x" }])).toEqual([]);
  });
});

describe("hasSearchTool", () => {
  it("is true only when the search tool is bound", () => {
    expect(hasSearchTool([{ tool: "get_current_time", approval: "auto" }, { tool: "search_knowledge", approval: "auto" }])).toBe(true);
    expect(hasSearchTool([{ tool: "get_current_time", approval: "auto" }])).toBe(false);
    expect(hasSearchTool([])).toBe(false);
  });

  it("tolerates malformed bindings", () => {
    expect(hasSearchTool(undefined)).toBe(false);
    expect(hasSearchTool("search_knowledge")).toBe(false);
    expect(hasSearchTool([null, 5, { tool: 5 }])).toBe(false);
  });
});

describe("countUnavailable", () => {
  it("counts saved ids whose base is archived or missing", () => {
    const bases = [base(1), base(2, "archived")];
    expect(countUnavailable([ID(1), ID(2), ID(3)], bases)).toBe(2);
    expect(countUnavailable([ID(1)], bases)).toBe(0);
    expect(countUnavailable([], bases)).toBe(0);
  });
});

describe("parseKnowledgeBindingsForm", () => {
  const bases = [base(1), base(2), base(3, "archived")];

  it("keeps the checked active bases, in listing order", () => {
    expect(parseKnowledgeBindingsForm(form({ [`base:${ID(2)}`]: "on", [`base:${ID(1)}`]: "on" }), bases)).toEqual({
      ok: true,
      value: [{ knowledgeBaseId: ID(1) }, { knowledgeBaseId: ID(2) }],
    });
  });

  it("allows an empty selection", () => {
    expect(parseKnowledgeBindingsForm(form({}), bases)).toEqual({ ok: true, value: [] });
  });

  it("cannot invent an id or choose an archived base", () => {
    const result = parseKnowledgeBindingsForm(form({ [`base:${ID(3)}`]: "on", [`base:${ID(9)}`]: "on", "base:../x": "on" }), bases);
    expect(result).toEqual({ ok: true, value: [] });
  });

  it("only accepts a plain checked value", () => {
    expect(parseKnowledgeBindingsForm(form({ [`base:${ID(1)}`]: "yes" }), bases)).toEqual({ ok: true, value: [] });
  });

  it("allows the maximum number of bases and refuses one more", () => {
    const many = Array.from({ length: 6 }, (_, n) => base(n));
    const checked = (count: number) => Object.fromEntries(many.slice(0, count).map((b) => [`base:${b.id}`, "on"]));
    expect(parseKnowledgeBindingsForm(form(checked(5)), many).ok).toBe(true);
    expect(parseKnowledgeBindingsForm(form(checked(6)), many)).toEqual({ ok: false, message: "An agent can use at most 5 knowledge bases." });
  });
});
