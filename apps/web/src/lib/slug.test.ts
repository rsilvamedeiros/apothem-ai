import { describe, expect, it } from "vitest";
import { isValidSlug, slugify, SLUG_MAX_LENGTH } from "./slug";

describe("slugify", () => {
  it.each([
    ["Support Bot", "support-bot"],
    ["  Research   Analyst  ", "research-analyst"],
    ["Atendimento ao Cliente", "atendimento-ao-cliente"],
    ["Agente de Cobrança", "agente-de-cobranca"],
    ["São Paulo & Rio", "sao-paulo-rio"],
    ["!!!", ""],
    ["a--b", "a-b"],
  ])("turns %j into %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it("never exceeds the limit nor ends with a hyphen after truncation", () => {
    const slug = slugify(`${"a".repeat(62)} b`);
    expect(slug.length).toBeLessThanOrEqual(SLUG_MAX_LENGTH);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("isValidSlug", () => {
  it.each(["a", "my-agent", "a1-b2"])("accepts %j", (slug) => expect(isValidSlug(slug)).toBe(true));
  it.each(["", "Upper", "a b", "-a", "a-", "a--b", "../x", "a".repeat(64)])("rejects %j", (slug) =>
    expect(isValidSlug(slug)).toBe(false),
  );
});
