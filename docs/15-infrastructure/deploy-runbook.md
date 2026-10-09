# Deploy Runbook: Supabase, Render, Vercel

**Status:** Ready to follow; nothing has been deployed yet
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

Decision record: [ADR-010](../adr/010-hosting-render-supabase-vercel.md). Authentication: [ADR-012](../adr/012-authentication-signed-bearer-tokens.md). The files this runbook uses live in `apothem-api/infra/render/` (`render.yaml`, `env.production.example`), `apothem-api/Dockerfile` and `apothem-ai/apps/web/.env.example`.

The order matters: each step produces a value the next one needs. Do not skip the checks; each one tells you which step to repeat.

## 0. What you need

- A Supabase account (free), a Render account (free web service), a Vercel account (hobby), a Google Cloud project for the OAuth client.
- A password manager. Every secret below is generated once, stored there, and typed into the dashboards. None of them goes into either repository.
- Before anything: `npm run build && npm run smoke:prod` in `apothem-api`, and once `docker build -t apothem-api .` (the image has not been built anywhere yet).

## 1. Decide the three shared values

The API and the web app must agree on these. Write them down first.

| Value | Example | API setting (Render) | Web setting (Vercel) |
|---|---|---|---|
| Token secret, 32+ random characters (`openssl rand -base64 48`) | (generated) | `AUTH_SECRET` | `APOTHEM_API_TOKEN_SECRET` |
| Token issuer | `https://app.apothemai.com.br` | `AUTH_JWT_ISSUER` | `APOTHEM_API_TOKEN_ISSUER` |
| Token audience | `apothem-api` | `AUTH_JWT_AUDIENCE` | `APOTHEM_API_TOKEN_AUDIENCE` |

A second, different secret encrypts the web session cookie: `APOTHEM_SESSION_SECRET` (`openssl rand -base64 32`). It must not equal the token secret.

## 2. Supabase (database only)

1. Create a project. Copy the database password once.
2. Project settings, Database, **Connection string**, **Transaction pooler** (port 6543). Append `?sslmode=require`. This is `DATABASE_URL`.
3. Keep Supabase Auth, the Data API and Storage unused (ADR-010). In the SQL editor, enable row level security on the tenant tables once the first migration has run, with no public policies, as defense in depth. The API enforces tenancy; this only closes the door behind it.
4. `pgvector` is not needed yet (retrieval is full-text).

Check: the connection string works from your machine with `psql "<DATABASE_URL>" -c "select 1"`.

## 3. Render (the API)

1. New, **Blueprint**, pick the `apothem-api` repository. Render reads `infra/render/render.yaml`.
2. Fill the values marked `sync: false`: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_JWT_ISSUER`.
3. Deploy. The container applies pending migrations, then starts the server (`npm run start:prod`).

Checks, with the service URL as `$API`:

```text
GET  $API/health                           -> 200
GET  $API/ready                            -> 200   (503 means the database is not reachable: repeat step 2)
GET  $API/v1/organizations/<any uuid>      -> 401
GET  $API/v1/organizations/<any uuid>  with header  x-principal-id: <any uuid>   -> 401  (the dev header is ignored)
```

The first request after a quiet period can take a minute: a free Render service sleeps. That is expected, not a failure.

## 4. Google OAuth client

1. Google Cloud Console, APIs and Services, Credentials, **OAuth client ID**, type Web application.
2. Authorized redirect URI: `<web app URL>/api/auth/callback/google` (for example `https://app.apothemai.com.br/api/auth/callback/google`).
3. Keep the client id and secret for Vercel. Configure the consent screen; while it is in testing mode only listed test users can sign in.

## 5. Vercel (the web app)

1. Import the `apothem-ai` repository. Set **Root Directory** to `apps/web` and keep "Include source files outside of the Root Directory" enabled, because `apps/web` uses the workspace packages `@apothem/api-client` and `@apothem/ui`.
2. Environment variables (Production):

| Variable | Value |
|---|---|
| `APOTHEM_API_URL` | the Render service URL |
| `APOTHEM_SESSION_SECRET` | the session secret from step 1 |
| `AUTH_URL` | the public URL of the web app |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | from step 4 |
| `APOTHEM_API_TOKEN_SECRET`, `APOTHEM_API_TOKEN_ISSUER`, `APOTHEM_API_TOKEN_AUDIENCE` | the three shared values from step 1 |
| `APOTHEM_SIGNUP_ALLOWLIST` | optional closed beta: `@yourcompany.com,partner@example.com`. Empty means open sign-up |

3. Deploy. Add the custom domain afterwards and update `AUTH_URL`, the Google redirect URI and the token issuer together if the URL changes.

## 6. End-to-end check

1. Open the web app, sign in with Google.
2. You land on the organization picker. Create an organization, then a workspace.
3. Create an agent, write instructions, publish, run it with a short task. With no model key the mock model answers: the run completes.
4. Open the audit log: `organization.created`, `workspace.created`, `agent.created` and `run.started` are there.
5. Sign in with a second Google account that is not a member: it must not see the first organization.

If the app fails with "Sign-in works but the API token is not configured", the three `APOTHEM_API_TOKEN_*` variables are missing on Vercel (see the function logs). If sign-in loops or shows "unauthorized", compare the three shared values on both sides character by character; a mismatch in the secret, issuer or audience is the usual cause.

## 7. Roll back

- API: Render, the service, **Deploys**, redeploy the previous successful deploy. Migrations are additive in this project, so the previous code runs against the newer schema.
- Web: Vercel, Deployments, **Promote to Production** on the previous one.
- A bad migration: restore the Supabase backup taken before the deploy (take one before each deploy while on the free tier; point-in-time recovery is not included).

## 8. Known limits (stated, not hidden)

- A free Render service sleeps and a free Supabase project pauses after inactivity; the first request after a pause is slow.
- One API instance only: the container migrates on boot. Do not scale to two before moving the migration to a deploy step.
- The session token lasts 8 hours and there is no refresh or revocation yet.
- No rate limiting on the API yet.
- No Redis, object storage or e-mail: none is read by the code yet, and none is required.
- The Docker image and the Vercel project configuration have not been exercised in this repository's CI. `npm run smoke:prod` covers the compiled API output.
