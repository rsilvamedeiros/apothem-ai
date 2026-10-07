import { describe, expect, it } from "vitest";
import { USE_CASE_TEMPLATES } from "./use-case-templates";

describe("USE_CASE_TEMPLATES", () => {
  it("has unique ids", () => {
    const ids = USE_CASE_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has a non-empty title and description for every template", () => {
    for (const template of USE_CASE_TEMPLATES) {
      expect(template.title.trim()).not.toBe("");
      expect(template.description.trim()).not.toBe("");
    }
  });
});
