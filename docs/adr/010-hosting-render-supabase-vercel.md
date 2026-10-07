# ADR-010 — Hosting: Render (API), Supabase (Postgres), Vercel (Web)

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

## Context

[ADR-009](009-zero-cost-initial-stack.md) chose Fly.io for backend hosting and left "Neon or Supabase" open for the remote database. The team now targets Render for `apothem-api`, Supabase for PostgreSQL and Vercel for `apothem-ai`. The rest of ADR-009 (zero fixed cost pre-revenue, self-hosted OIDC, Drizzle, BullMQ, R2/MinIO) is unchanged.

## Decision

| Layer | Choice | Notes |
|---|---|---|
| Backend hosting | Render (web service, Docker or Node runtime) | Supersedes the Fly.io row of ADR-009 |
| Database (remote) | Supabase Postgres + pgvector | Used as a managed Postgres only |
| Frontend hosting | Vercel | `apps/web` and `apps/site` |

Supabase usage rules:

- Supabase Auth is **not** used; authentication stays self-hosted OIDC (ADR-009).
- Tenant isolation remains enforced by the API (ADR-006). The Supabase Data API (PostgREST) must stay disabled or unreachable for tenant tables, and RLS must be enabled with no public policies as defense in depth.
- The API connects through the Supabase pooler; the driver must disable prepared statements when using transaction pooling.
- Local development and CI keep using Docker Compose Postgres (no remote database in CI).
- `service_role` keys and connection strings live only in Render environment secrets, never in the repository.

## Consequences

- Render free web services sleep after inactivity (cold starts) and have no free background workers. Until commercialization, workers run in-process or on demand; reaching this limit is a signal to revisit this ADR, not to silently upgrade.
- Supabase free projects pause after inactivity and have connection/storage limits; same rule applies.
- Deploy config for the API lives in `apothem-api/infra/render/`; `infra/fly/` is removed.
- Environment separation (production vs non-production credentials and data stores) from `docs/15-infrastructure/environments-domains.md` still applies.

## Alternatives

- **Fly.io + Neon (ADR-009):** superseded by team preference.
- **Supabase as full BaaS (Auth, Data API, Storage):** rejected; it would move authorization out of the API and break ADR-006/ADR-007 guarantees.
