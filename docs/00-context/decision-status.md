# Decision Status Registry

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

This document distinguishes **decided**, **preferred** and **open** items so coding agents do not treat hypotheses as architecture law.

## Decided

- Brand: APOTHEM AI.
- Canonical project domain: `apothemai.com.br`.
- Product thesis: Intelligence Layer for Business.
- Core loop: Understand → Connect → Reason → Act.
- Initial market: Brazil / B2B.
- Multi-tenant domain model.
- API-first boundaries.
- Multi-model provider abstraction.
- Human-in-the-loop / approvals as first-class concepts.
- PostgreSQL as primary system of record.
- Documentation-first repository foundation.

- Two repositories (`apothem-ai` frontend / `apothem-api` backend) per [ADR-008](../adr/008-two-repository-split.md).
- Zero fixed-cost initial stack (self-hosted/free-tier only, LLM usage excepted) per [ADR-009](../adr/009-zero-cost-initial-stack.md):
  - Self-hosted OIDC auth (Auth.js/Lucia), not a managed auth vendor.
  - Drizzle ORM.
  - Redis + BullMQ for queues (Docker Compose locally, Upstash free tier remotely).
  - MinIO locally / Cloudflare R2 free tier remotely for object storage.
  - Fly.io free allowance for backend hosting; Vercel free tier for frontend.
  - No paid observability vendor initially (structured logs + OpenTelemetry only).

## Preferred, to validate during scaffold

- TypeScript-first application stack.
- Next.js for web surfaces.
- Node.js API/application layer.
- pgvector before a specialized vector database (PostgreSQL+pgvector via Docker Compose for dev; Neon/Supabase free tier when remote is needed).

## Open

- billing provider;
- embedding/reranking provider strategy;
- whether Python is needed in the first runtime or only later;
- public SDK timing;
- when to move off the zero-cost stack (ADR-009) as the company starts commercializing.

Open decisions should be resolved by evidence and recorded as ADRs.
