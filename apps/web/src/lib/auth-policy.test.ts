import { describe, expect, it } from "vitest";
import { isEmailAllowed, parseAllowlist, shouldAllowSignIn } from "./auth-policy";

describe("parseAllowlist", () => {
  it("splits, trims and lowercases entries and drops blanks", () => {
    expect(parseAllowlist(" Alice@Example.com , @Acme.com ,, ")).toEqual(["alice@example.com", "@acme.com"]);
  });

  it("is empty for undefined or blank input", () => {
    expect(parseAllowlist(undefined)).toEqual([]);
    expect(parseAllowlist("   ")).toEqual([]);
  });
});

describe("isEmailAllowed", () => {
  it("allows everyone when the allowlist is empty (open registration)", () => {
    expect(isEmailAllowed("anyone@example.com", [])).toBe(true);
  });

  it("allows an exact email, case-insensitively", () => {
    expect(isEmailAllowed("Alice@Example.com", ["alice@example.com"])).toBe(true);
    expect(isEmailAllowed("bob@example.com", ["alice@example.com"])).toBe(false);
  });

  it("allows a whole domain only with the @ form and never a lookalike", () => {
    const list = ["@acme.com"];
    expect(isEmailAllowed("dev@acme.com", list)).toBe(true);
    expect(isEmailAllowed("dev@evil-acme.com", list)).toBe(false);
    expect(isEmailAllowed("dev@acme.com.evil.io", list)).toBe(false);
    expect(isEmailAllowed("dev@sub.acme.com", list)).toBe(false);
    expect(isEmailAllowed("acme.com@evil.io", list)).toBe(false);
  });

  it("rejects malformed emails when a list is set", () => {
    expect(isEmailAllowed("not-an-email", ["@acme.com"])).toBe(false);
    expect(isEmailAllowed("", ["@acme.com"])).toBe(false);
  });
});

describe("shouldAllowSignIn", () => {
  const google = { provider: "google" };

  it("allows a verified Google email", () => {
    expect(shouldAllowSignIn({ account: google, profile: { email: "a@example.com", email_verified: true } }, [])).toBe(true);
  });

  it.each([
    ["unverified email", { account: google, profile: { email: "a@example.com", email_verified: false } }],
    ["missing verification flag", { account: google, profile: { email: "a@example.com" } }],
    ["string verification flag", { account: google, profile: { email: "a@example.com", email_verified: "true" } }],
    ["missing email", { account: google, profile: { email_verified: true } }],
    ["missing profile", { account: google }],
    ["unknown provider", { account: { provider: "github" }, profile: { email: "a@example.com", email_verified: true } }],
    ["no account", { profile: { email: "a@example.com", email_verified: true } }],
  ])("denies %s", (_label, input) => {
    expect(shouldAllowSignIn(input as never, [])).toBe(false);
  });

  it("applies the allowlist on top of verification", () => {
    const input = { account: google, profile: { email: "dev@acme.com", email_verified: true } };
    expect(shouldAllowSignIn(input, ["@acme.com"])).toBe(true);
    expect(shouldAllowSignIn(input, ["@other.com"])).toBe(false);
  });
});
