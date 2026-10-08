import { describe, expect, it } from "vitest";
import { describeBaseStatus, describeSource, formatCharacters, formatDay, KNOWLEDGE_LIMITS, shortChecksum } from "./knowledge-model";

describe("knowledge view helpers", () => {
  it("mirrors the API limits", () => {
    expect(KNOWLEDGE_LIMITS).toEqual({ name: 100, description: 500, title: 200, content: 100_000, query: 500, bindings: 5 });
  });

  it("describes a base status, and an unknown one safely", () => {
    expect(describeBaseStatus("active")).toEqual({ label: "Active", tone: "success" });
    expect(describeBaseStatus("archived")).toEqual({ label: "Archived", tone: "neutral" });
    expect(describeBaseStatus("toString")).toEqual({ label: "Unknown", tone: "neutral" });
    expect(describeBaseStatus("whatever")).toEqual({ label: "Unknown", tone: "neutral" });
  });

  it("shortens a checksum to eight characters", () => {
    expect(shortChecksum("abcdef0123456789")).toBe("abcdef01");
  });

  it("formats a day in UTC and tolerates a bad date", () => {
    expect(formatDay("2026-03-04T23:59:59.000Z")).toBe("2026-03-04");
    expect(formatDay("not a date")).toBe("unknown date");
  });

  it("formats sizes with a singular and a plural", () => {
    expect(formatCharacters(1)).toBe("1 character");
    expect(formatCharacters(0)).toBe("0 characters");
    expect(formatCharacters(12345)).toBe("12,345 characters");
  });

  it("describes where a passage came from", () => {
    expect(describeSource({ section: "Refunds", ordinal: 2 })).toBe("Refunds, passage 3");
    expect(describeSource({ section: null, ordinal: 0 })).toBe("passage 1");
  });
});
