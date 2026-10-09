// @vitest-environment node
import { jwtVerify } from "jose";
import { describe, expect, it } from "vitest";
import { accessTokenForSession, assertSigningConfigured } from "./session-token";

const SECRET = "a-very-long-random-secret-of-at-least-32-chars";
const config = { secret: SECRET, issuer: "https://auth.apothemai.com.br", audience: "apothem-api" };

describe("accessTokenForSession", () => {
  it("issues a verifiable API token for a signed-in verified user", async () => {
    const token = await accessTokenForSession(
      { user: { email: "alice@example.com", name: "Alice" }, emailVerified: true },
      config,
    );
    const { payload } = await jwtVerify(token!, new TextEncoder().encode(SECRET), {
      issuer: config.issuer,
      audience: config.audience,
      algorithms: ["HS256"],
    });
    expect(payload).toMatchObject({ email: "alice@example.com", email_verified: true, name: "Alice" });
  });

  it.each([
    ["no session", null],
    ["no user", {}],
    ["no email", { user: { name: "A" }, emailVerified: true }],
    ["unverified email", { user: { email: "a@example.com" }, emailVerified: false }],
    ["missing verification flag", { user: { email: "a@example.com" } }],
  ])("returns nothing for %s", async (_label, session) => {
    expect(await accessTokenForSession(session as never, config)).toBeUndefined();
  });

  it("returns nothing when the token settings are not configured", async () => {
    expect(
      await accessTokenForSession({ user: { email: "a@example.com" }, emailVerified: true }, undefined),
    ).toBeUndefined();
  });
});

describe("assertSigningConfigured", () => {
  const signedIn = { user: { email: "alice@example.com" }, emailVerified: true };

  it("is quiet when the token settings exist", () => {
    expect(() => assertSigningConfigured(signedIn, config)).not.toThrow();
  });

  it("explains a deployment mistake instead of letting sign-in fail silently: a signed-in person but no token settings", () => {
    expect(() => assertSigningConfigured(signedIn, undefined)).toThrow(
      "Sign-in works but the API token is not configured: set APOTHEM_API_TOKEN_SECRET, APOTHEM_API_TOKEN_ISSUER and APOTHEM_API_TOKEN_AUDIENCE.",
    );
  });

  it.each([
    ["no session", null],
    ["no user", {}],
    ["no email", { user: { name: "A" }, emailVerified: true }],
    ["unverified email", { user: { email: "a@example.com" }, emailVerified: false }],
  ])("stays quiet for %s even without settings, because nothing could have been signed", (_label, session) => {
    expect(() => assertSigningConfigured(session as never, undefined)).not.toThrow();
  });

  it("never echoes the email or any value into the message", () => {
    try {
      assertSigningConfigured(signedIn, undefined);
    } catch (error) {
      expect((error as Error).message).not.toContain("alice");
    }
  });
});
