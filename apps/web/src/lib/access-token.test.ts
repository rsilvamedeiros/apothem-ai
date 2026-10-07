// @vitest-environment node
// jose needs the real Node typed arrays, which jsdom replaces.
import { jwtVerify } from "jose";
import { describe, expect, it } from "vitest";
import { ACCESS_TOKEN_TTL_SECONDS, issueAccessToken, loadAccessTokenConfig } from "./access-token";

const SECRET = "a-very-long-random-secret-of-at-least-32-chars";
const config = { secret: SECRET, issuer: "https://auth.apothemai.com.br", audience: "apothem-api" };
const NOW = new Date("2026-03-04T05:06:07.000Z");

const verify = (token: string, key = SECRET) =>
  jwtVerify(token, new TextEncoder().encode(key), {
    issuer: config.issuer,
    audience: config.audience,
    algorithms: ["HS256"],
    requiredClaims: ["exp", "sub"],
    currentDate: NOW,
  });

describe("issueAccessToken", () => {
  it("signs a token that satisfies the API verification rules", async () => {
    const token = await issueAccessToken({ email: "Alice@Example.com", name: "Alice", emailVerified: true }, config, NOW);
    const { payload } = await verify(token);
    expect(payload).toMatchObject({
      iss: config.issuer,
      aud: config.audience,
      email: "alice@example.com",
      email_verified: true,
      name: "Alice",
    });
    expect(payload.sub).toBe("alice@example.com");
  });

  it("is short lived", async () => {
    const token = await issueAccessToken({ email: "a@example.com", emailVerified: true }, config, NOW);
    const { payload } = await verify(token);
    expect(payload.exp! - payload.iat!).toBe(ACCESS_TOKEN_TTL_SECONDS);
    expect(ACCESS_TOKEN_TTL_SECONDS).toBeLessThanOrEqual(15 * 60);
  });

  it("uses HS256 and is rejected under a different secret", async () => {
    const token = await issueAccessToken({ email: "a@example.com", emailVerified: true }, config, NOW);
    expect(JSON.parse(Buffer.from(token.split(".")[0]!, "base64url").toString()).alg).toBe("HS256");
    await expect(verify(token, "another-secret-another-secret-another-secret")).rejects.toThrow();
  });

  it("refuses to issue for an unverified or missing email", async () => {
    await expect(issueAccessToken({ email: "a@example.com", emailVerified: false }, config, NOW)).rejects.toThrow(
      /verified email/,
    );
    await expect(issueAccessToken({ email: "", emailVerified: true }, config, NOW)).rejects.toThrow(/verified email/);
    await expect(issueAccessToken({ email: "not-an-email", emailVerified: true }, config, NOW)).rejects.toThrow(
      /verified email/,
    );
  });

  it("omits the name claim when there is none and truncates a huge one", async () => {
    const without = await issueAccessToken({ email: "a@example.com", emailVerified: true }, config, NOW);
    expect((await verify(without)).payload).not.toHaveProperty("name");
    const huge = await issueAccessToken({ email: "a@example.com", name: "n".repeat(1000), emailVerified: true }, config, NOW);
    expect(((await verify(huge)).payload.name as string).length).toBeLessThanOrEqual(200);
  });

  it("refuses a weak secret", async () => {
    await expect(
      issueAccessToken({ email: "a@example.com", emailVerified: true }, { ...config, secret: "short" }, NOW),
    ).rejects.toThrow(/at least 32/);
  });
});

describe("loadAccessTokenConfig", () => {
  const env = {
    APOTHEM_API_TOKEN_SECRET: SECRET,
    APOTHEM_API_TOKEN_ISSUER: config.issuer,
    APOTHEM_API_TOKEN_AUDIENCE: config.audience,
  };

  it("reads the three settings", () => {
    expect(loadAccessTokenConfig(env)).toEqual(config);
  });

  it("returns undefined unless everything is configured, so the dev fallback stays explicit", () => {
    expect(loadAccessTokenConfig({})).toBeUndefined();
    expect(loadAccessTokenConfig({ ...env, APOTHEM_API_TOKEN_SECRET: undefined })).toBeUndefined();
    expect(loadAccessTokenConfig({ ...env, APOTHEM_API_TOKEN_ISSUER: "" })).toBeUndefined();
  });
});
