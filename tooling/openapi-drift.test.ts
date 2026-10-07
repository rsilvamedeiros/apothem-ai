import { describe, expect, it } from "vitest";
import { specsMatch } from "./openapi-drift.mjs";

describe("specsMatch", () => {
  it("matches identical specs", () => {
    expect(specsMatch('{"a":1}', '{"a":1}')).toBe(true);
  });

  it("ignores formatting and key order differences", () => {
    expect(specsMatch('{"a":1,"b":{"c":2,"d":3}}', '{\n  "b": {"d":3,"c":2},\n  "a": 1\n}\n')).toBe(true);
  });

  it("detects a changed value", () => {
    expect(specsMatch('{"paths":{"/a":{}}}', '{"paths":{"/a":{},"/b":{}}}')).toBe(false);
  });

  it("treats invalid JSON as drift instead of throwing", () => {
    expect(specsMatch("not json", '{"a":1}')).toBe(false);
  });
});
