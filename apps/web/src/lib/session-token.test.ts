// @vitest-environment node
import { jwtVerify } from "jose";
import { describe, expect, it } from "vitest";
import { accessTokenForSession } from "./session-token";

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
