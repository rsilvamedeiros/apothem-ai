import { afterEach, describe, expect, it, vi } from "vitest";
import { canUseDemoFallback, isNetworkError } from "./mock";

afterEach(() => vi.unstubAllEnvs());

describe("isNetworkError", () => {
  it("is true only for fetch-level TypeErrors", () => {
    expect(isNetworkError(new TypeError("fetch failed"))).toBe(true);
    expect(isNetworkError(new Error("other"))).toBe(false);
    expect(isNetworkError("fetch failed")).toBe(false);
  });
});

describe("canUseDemoFallback", () => {
  it("allows demo data for a network error outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(canUseDemoFallback(new TypeError("fetch failed"))).toBe(true);
  });

  it("never allows demo data in production, even for a network error", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(canUseDemoFallback(new TypeError("fetch failed"))).toBe(false);
  });

  it("never allows demo data for non-network errors", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(canUseDemoFallback(new Error("403"))).toBe(false);
  });
});
