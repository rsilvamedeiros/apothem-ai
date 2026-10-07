# ADR-012 — Authentication: Signed Bearer Tokens Verified by the API

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

## Context

[ADR-009](009-zero-cost-initial-stack.md) chose self-hosted OIDC and left the mechanism open. Until now `apothem-api` trusted an `x-principal-id` header verbatim, which is acceptable on a laptop but lets anyone who knows a user id impersonate that user. That must be impossible in any deployed environment.

## Decision

1. **The API only trusts verified, signed bearer tokens in deployed environments.** `AUTH_MODE=jwt` verifies `Authorization: Bearer <token>`; `AUTH_MODE=dev` keeps the header shortcut for local development and tests. The API **refuses to boot in production unless `AUTH_MODE=jwt`**.
2. **Mutually exclusive credential sources.** In `jwt` mode the `x-principal-id` header is never read, even when sent alongside a valid token.
3. **Strict verification, fail closed.** Signature, `exp` (required), issuer, audience, `sub` (required) and an explicit algorithm allow list are checked. The allow list is configured, never taken from the token header, which blocks `alg: none` and algorithm confusion. Clock tolerance is 5 seconds. Any failure yields a generic 401 with no hint about the reason.
4. **Keys.** Either a shared secret of at least 32 characters (HS256, `AUTH_SECRET`) or a published key set (`AUTH_JWKS_URL`, RS256/ES256) from the OIDC provider. Asymmetric keys are preferred once a provider exists.
5. **Identity mapping.** A token maps to an existing, active principal by **provider-verified email** (`email_verified === true`), case-insensitively. Suspended accounts stop working immediately because the principal is looked up on every request. Just-in-time provisioning of unknown accounts is **not** enabled; members are added by an administrator for accounts that exist.
6. **Authorization is unchanged.** Tokens carry identity only. Tenant scope and permissions still come from server-side membership (ADR-006). No role or tenant claim in a token is trusted.
7. **Frontend.** `apps/web` keeps the credential in an `httpOnly`, `sameSite=lax` cookie (`secure` in production) with a bounded lifetime and sends it as a bearer token from the server only. The browser never reads it.
8. **Token issuance** (who signs the tokens: Auth.js in `apps/web`, a standalone provider, or another OIDC server) is intentionally not fixed here. The API contract above works with any issuer. A local helper (`npm run auth:dev-token`) signs short-lived HS256 tokens for development and refuses to run in production.

## Consequences

- Revocation relies on short token lifetimes plus the per-request account status check; there is no token deny list yet. Issue short-lived tokens (about 15 minutes) when a provider is added.
- Matching by email makes the identity provider the trust anchor for email ownership. Providers must verify emails before setting `email_verified`.
- Adding a provider means configuring `AUTH_JWT_ISSUER`, `AUTH_JWT_AUDIENCE` and `AUTH_JWKS_URL`; no API code change.
- Password reset, MFA, social login and session management belong to the provider, not to this API.

## Alternatives

- **API-issued sessions and passwords:** rejected; it would make the API own credential storage and recovery flows.
- **Opaque tokens with introspection:** rejected for now; adds a network hop per request and an introspection endpoint to operate.
- **Keep the header and rely on network isolation:** rejected; a single misconfiguration would allow full impersonation.
