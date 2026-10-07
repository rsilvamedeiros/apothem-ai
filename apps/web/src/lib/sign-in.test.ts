import { describe, expect, it } from "vitest";
import { parseSignIn, sessionCookieOptions } from "./sign-in";

const ORG = "11111111-1111-4111-8111-111111111111";
const PRINCIPAL = "22222222-2222-4222-8222-222222222222";
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ4In0.c2lnbmF0dXJl";

const form = (entries: Record<string, string>) => new Map(Object.entries(entries));

describe("parseSignIn", () => {
  it("accepts an access token with an organization", () => {
    expect(parseSignIn(form({ organizationId: ORG, accessToken: ` ${TOKEN} ` }))).toEqual({
      ok: true,
      value: { kind: "token", organizationId: ORG, accessToken: TOKEN },
    });
  });

  it("accepts the dev principal id when no token is given", () => {
    expect(parseSignIn(form({ organizationId: ORG, principalId: PRINCIPAL }))).toEqual({
      ok: true,
      value: { kind: "principal", organizationId: ORG, principalId: PRINCIPAL },
    });
  });

  it("prefers the token when both are provided", () => {
    const result = parseSignIn(form({ organizationId: ORG, principalId: PRINCIPAL, accessToken: TOKEN }));
    expect(result).toMatchObject({ ok: true, value: { kind: "token" } });
  });

  it.each([
    ["missing organization", { principalId: PRINCIPAL }],
    ["organization path traversal", { organizationId: "../admin", principalId: PRINCIPAL }],
    ["organization with a suffix", { organizationId: `${ORG}/x`, principalId: PRINCIPAL }],
    ["no credential at all", { organizationId: ORG }],
    ["principal not a uuid", { organizationId: ORG, principalId: "admin" }],
    ["token that is not a jwt", { organizationId: ORG, accessToken: "not-a-token" }],
    ["token with whitespace inside", { organizationId: ORG, accessToken: "aaa.bbb ccc.ddd" }],
    ["token with a header injection", { organizationId: ORG, accessToken: "aaa.bbb.ccc\r\nx-evil: 1" }],
    ["oversized token", { organizationId: ORG, accessToken: `${"a".repeat(5000)}.b.c` }],
  ])("rejects %s", (_label, entries) => {
    expect(parseSignIn(form(entries))).toEqual({ ok: false });
  });

  it("treats non-string values as missing", () => {
    expect(parseSignIn({ get: () => new Blob(["x"]) })).toEqual({ ok: false });
  });
});

describe("sessionCookieOptions", () => {
  it("is httpOnly, lax, scoped to the whole site and expires", () => {
    expect(sessionCookieOptions("development")).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
    expect(sessionCookieOptions("development").maxAge).toBeGreaterThan(0);
  });

  it("is secure in production only", () => {
    expect(sessionCookieOptions("production").secure).toBe(true);
    expect(sessionCookieOptions("development").secure).toBe(false);
    expect(sessionCookieOptions("test").secure).toBe(false);
  });
});
