import { describe, expect, it } from "vitest";
import { isUuid } from "./ids";

describe("isUuid", () => {
  it("accepts a canonical UUID in either case", () => {
    expect(isUuid("00000000-0000-4000-8000-000000000000")).toBe(true);
    expect(isUuid("ABCDEF00-0000-4000-8000-000000000000")).toBe(true);
  });

  it.each(["", "abc", "../admin", "00000000-0000-4000-8000-00000000000", "00000000-0000-4000-8000-0000000000000/x", " 00000000-0000-4000-8000-000000000000"])(
    "rejects %j",
    (value) => {
      expect(isUuid(value)).toBe(false);
    },
  );
});
