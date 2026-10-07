import { isUuid } from "./ids";

export type SignInInput =
  | { kind: "token"; organizationId: string; accessToken: string }
  | { kind: "principal"; organizationId: string; principalId: string };

export type ParsedSignIn = { ok: true; value: SignInInput } | { ok: false };

const MAX_TOKEN_LENGTH = 4096;
/** Three base64url segments; the signature may be empty only for the (rejected by the API) unsigned form. */
const JWT_SHAPE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]*$/;

function text(form: { get(key: string): unknown }, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates what ends up in a cookie and in a URL path. The shape check is
 * only hygiene (no whitespace or header injection); apothem-api verifies the
 * token signature, issuer, audience and expiry.
 */
export function parseSignIn(form: { get(key: string): unknown }): ParsedSignIn {
  const organizationId = text(form, "organizationId");
  if (!isUuid(organizationId)) return { ok: false };

  const accessToken = text(form, "accessToken");
  if (accessToken) {
    if (accessToken.length > MAX_TOKEN_LENGTH || !JWT_SHAPE.test(accessToken)) return { ok: false };
    return { ok: true, value: { kind: "token", organizationId, accessToken } };
  }

  const principalId = text(form, "principalId");
  if (!isUuid(principalId)) return { ok: false };
  return { ok: true, value: { kind: "principal", organizationId, principalId } };
}

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export function sessionCookieOptions(nodeEnv: string | undefined) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: nodeEnv === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
