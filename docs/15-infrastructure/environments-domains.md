# Environments and Domains

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Production
- `apothemai.com.br` — public site
- `app.apothemai.com.br` — authenticated product
- `api.apothemai.com.br` — API
- `docs.apothemai.com.br` — docs
- `status.apothemai.com.br` — status page

## Non-production
Prefer clearly separated domains/subdomains such as `app.dev.apothemai.com.br`, `api.dev.apothemai.com.br`, and equivalent staging/preview strategy. Exact naming can be finalized with hosting provider.

Production and non-production must use separate credentials/secrets/data stores. Never copy customer production data into development by default.

Cookies/sessions should use the narrowest domain scope possible rather than `.apothemai.com.br` globally unless a documented cross-subdomain requirement exists.

## Authentication settings per environment (ADR-012)

| Where | Variable | Notes |
|---|---|---|
| Render (apothem-api) | `AUTH_MODE=jwt` | Required in production; the API refuses to boot otherwise |
| Render | `AUTH_SECRET` | 32+ random characters; shared only with the web token signer |
| Render | `AUTH_JWT_ISSUER` / `AUTH_JWT_AUDIENCE` | Must equal the web `APOTHEM_API_TOKEN_ISSUER` / `..._AUDIENCE` |
| Render | `AUTH_JIT_PROVISIONING` | `true` to allow sign-up; leave `false` for a closed environment |
| Vercel (apps/web) | `APOTHEM_SESSION_SECRET` | Auth.js cookie encryption; different from the token secret |
| Vercel | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google OAuth client; redirect URI `<app url>/api/auth/callback/google` |
| Vercel | `APOTHEM_API_TOKEN_SECRET` | Same value as the API `AUTH_SECRET` |
| Vercel | `APOTHEM_SIGNUP_ALLOWLIST` | Optional emails or `@domains` for a closed beta |

Use separate secrets and Google clients for production and non-production.