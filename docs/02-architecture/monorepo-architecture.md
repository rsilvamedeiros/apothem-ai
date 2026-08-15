# Repository Architecture

**Status:** Foundation / Draft
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

> Superseded the single-monorepo layout below per [ADR-008](../adr/008-two-repository-split.md) (supersedes [ADR-001](../adr/001-monorepo.md)). The platform starts as **two repositories**: `apothem-ai` (frontend) and `apothem-api` (backend). See `architecture.md` at the repository root for the full rationale.

## `apothem-ai` (this repository) — frontend

```text
apothem-ai/
├── apps/
│   ├── site/               public website (apothemai.com.br)
│   └── web/                authenticated product (app.apothemai.com.br)
├── packages/
│   ├── ui/                 APOTHEM design system
│   ├── frontend-config/    shared TS/lint/test config
│   └── api-client/         typed client generated from apothem-api's OpenAPI spec
├── docs/
├── CLAUDE.md
├── AGENTS.md
└── README.md
```

## `apothem-api` (separate repository) — backend

```text
apothem-api/
├── src/
│   ├── modules/             identity, agents, knowledge, connect, flow, approvals, audit, ...
│   ├── common/
│   ├── infrastructure/      database, queue, storage, ai, secrets, telemetry, http
│   └── main/
├── workers/                 long-running run/ingestion/workflow jobs
├── database/
├── migrations/
├── docs/
├── infra/
├── CLAUDE.md
├── AGENTS.md
└── README.md
```

No dedicated `apothem-infrastructure` repository yet — infra/deploy config lives inside `apothem-api/infra`.

## Dependency direction (within each repository)

`domain` imports no framework/provider packages. `application` depends on domain and ports. Infrastructure packages implement ports. Delivery apps compose them.

Avoid a giant `shared` package. Shared code must have an explicit responsibility. Cross-context reuse of business entities is a smell; use contracts/events instead.

## Contract sharing across repositories

Frontend and backend do not hand-duplicate types. `apothem-api` is the source of truth: it publishes an OpenAPI specification, from which `apothem-ai/packages/api-client` is generated. Do not maintain parallel hand-written `frontend/User.ts` / `backend/User.ts` type pairs.

## Build/deploy independence

`apothem-ai` (site + web) deploys to Vercel; `apothem-api` (API + workers) deploys to a managed container runtime (initially Railway). The two repositories release on independent cycles and independent version numbers — API compatibility must tolerate this skew; coordinate explicitly before shipping breaking changes. Database migrations (owned by `apothem-api`) require expand/contract discipline regardless of repository topology.
