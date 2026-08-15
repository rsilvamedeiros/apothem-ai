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

## Preferred, to validate during scaffold

- TypeScript-first application stack.
- Next.js for web surfaces.
- Node.js API/application layer.
- pgvector before a specialized vector database.
- Redis-compatible cache/queue where needed.
- S3-compatible object storage.
- Monorepo with deployable web/API/worker units.

## Open

- final authentication vendor vs in-house OIDC integration;
- exact queue/workflow engine technology;
- cloud provider;
- infrastructure-as-code tool;
- billing provider;
- specialized observability vendor;
- embedding/reranking provider strategy;
- whether Python is needed in the first runtime or only later;
- public SDK timing.

Open decisions should be resolved by evidence and recorded as ADRs.
