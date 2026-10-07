import { describe, expect, it } from "vitest";
import { parseCreateAgentForm, slugify } from "./agent-form";

const form = (entries: Record<string, string>) => new Map(Object.entries(entries));

describe("slugify", () => {
  it.each([
    ["Support Bot", "support-bot"],
    ["  Research   Analyst  ", "research-analyst"],
    ["Atendimento ao Cliente", "atendimento-ao-cliente"],
    ["Agente de Cobrança", "agente-de-cobranca"],
    ["!!!", ""],
    ["a--b", "a-b"],
  ])("turns %j into %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("never exceeds the API slug limit", () => {
    expect(slugify("a".repeat(200)).length).toBeLessThanOrEqual(63);
  });
});

describe("parseCreateAgentForm", () => {
  it("accepts a valid form and trims text", () => {
    expect(parseCreateAgentForm(form({ name: " Support ", slug: "support", description: " Helps " }))).toEqual({
      ok: true,
      value: { name: "Support", slug: "support", description: "Helps" },
    });
  });

  it("omits an empty description", () => {
    const result = parseCreateAgentForm(form({ name: "A", slug: "a", description: "  " }));
    expect(result).toEqual({ ok: true, value: { name: "A", slug: "a" } });
  });

  it("derives the slug from the name when the slug is blank", () => {
    const result = parseCreateAgentForm(form({ name: "Support Bot", slug: "" }));
    expect(result).toEqual({ ok: true, value: { name: "Support Bot", slug: "support-bot" } });
  });

  it("reports each invalid field", () => {
    const result = parseCreateAgentForm(
      form({ name: "", slug: "Bad Slug", description: "x".repeat(2001) }),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(["description", "name", "slug"]);
    }
  });

  it("rejects a name that is too long", () => {
    const result = parseCreateAgentForm(form({ name: "n".repeat(201), slug: "ok" }));
    expect(result).toMatchObject({ ok: false, errors: { name: expect.any(String) } });
  });

  it("rejects a name that yields no usable slug", () => {
    const result = parseCreateAgentForm(form({ name: "!!!", slug: "" }));
    expect(result).toMatchObject({ ok: false, errors: { slug: expect.any(String) } });
  });

  it("ignores unexpected fields such as tenant ids", () => {
    const result = parseCreateAgentForm(
      form({ name: "A", slug: "a", organizationId: "evil", workspaceId: "evil" }),
    );
    expect(result).toEqual({ ok: true, value: { name: "A", slug: "a" } });
  });

  it("treats non-string form values (files) as empty", () => {
    const entries = { get: (key: string) => (key === "name" ? new Blob(["x"]) : null) };
    expect(parseCreateAgentForm(entries)).toMatchObject({ ok: false });
  });
});
