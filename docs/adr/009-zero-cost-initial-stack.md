# ADR-009 — Zero-Cost Initial Stack

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

## Context

Pre-revenue, the platform must not carry fixed monthly infrastructure cost while `apothem-api` is being built out. `docs/00-context/decision-status.md` and `docs/19-handoff/open-questions.md` left authentication, ORM, queue technology, cloud/hosting, object storage and observability vendor open. These are resolved here under an explicit **zero fixed cost** constraint: self-hosted/local-first for development, free tiers only where a remote/managed instance is actually needed, and no paid vendor commitment before the company starts commercializing.

The one exception is unavoidable: LLM provider calls are billed per token/usage, not a fixed license, and cannot be zeroed — only minimized (mock adapter in dev/CI, real provider only when needed).

This decision is explicitly **provisional to the pre-revenue phase**. Once commercialization begins, cost/reliability trade-offs should be re-evaluated (e.g., moving off free-tier hosting to guarantee uptime/SLA) via a new ADR — this one does not bind the platform long-term.

## Decision

| Layer | Choice | Notes |
|---|---|---|
| Authentication | Self-hosted OIDC (Auth.js/NextAuth or Lucia) | No per-user/per-org vendor cost; revisit managed auth (Clerk/WorkOS/Auth0) when enterprise SSO or reduced maintenance overhead justifies the spend |
| ORM / query layer | Drizzle | TypeScript-first, SQL-like, good migration story, no license cost |
| Database | PostgreSQL + pgvector via Docker Compose (dev); Neon or Supabase free tier when a remote instance is needed | Confirms ADR-003; adds explicit free-tier remote target |
| Queue | Redis + BullMQ via Docker Compose (dev); Upstash free tier when a remote instance is needed | Durable workflow engines (e.g. Temporal) remain a future option if approval/timer continuation semantics outgrow BullMQ |
| Object storage | MinIO via Docker Compose (dev); Cloudflare R2 free tier (10GB) when a remote instance is needed | S3-compatible, keeps future migration to AWS S3 open |
| Backend hosting | Fly.io free allowance | Chosen over Railway (no real free tier) and Render (free-tier services sleep on inactivity, unsuitable for long-running workers); supports region selection relevant to BR/LGPD |
| Frontend hosting | Vercel free (hobby) tier | Already the documented baseline |
| Observability | Structured application logs + OpenTelemetry instrumentation, no paid vendor initially | Vendor selection (tracing/APM) deferred until cost is justified by real operational load |
| AI / LLM providers | Multi-provider via Model Gateway; mock adapter for dev/CI, real provider only for actual runs | The only layer with unavoidable, usage-based cost |

## Consequences

- Local development requires Docker Compose (Postgres+pgvector, Redis, MinIO) as already documented in `docs/02-architecture/architecture-overview.md` / `docs/15-infrastructure/docker-local-dev.md`; this is now the default even for early "remote" testing until a design partner needs a persistent shared environment.
- Free tiers have real limits (compute, storage, connection counts, cold starts on some providers). The team accepts this trade-off pre-revenue; hitting a limit is a signal to revisit this ADR, not to silently upgrade to a paid tier.
- Self-hosted auth means the team owns session/security correctness that a managed vendor would otherwise provide; this must not compromise the tenant-isolation and auditability baselines in `docs/08-security`.
- `docs/00-context/decision-status.md` and `docs/19-handoff/open-questions.md` should be updated to move these items from "Open"/"Preferred" to "Decided", referencing this ADR.

## Alternatives

- **Railway + Neon + Upstash (previously documented baseline):** rejected for now — all carry cost beyond a trivial trial period; revisit once commercializing.
- **AWS from day one:** rejected — requires Terraform/IaC setup and account management overhead disproportionate to a pre-revenue, pre-scaffold project; remains the documented long-term path (see `architecture.md` §38) once infrastructure needs justify it.
- **Managed auth (Clerk/WorkOS/Auth0) from day one:** rejected under the zero-cost constraint; revisit when enterprise SSO requirements or maintenance cost outweigh the free-tier/self-hosted cost of ownership.
