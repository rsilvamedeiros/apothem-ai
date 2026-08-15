# ADR-008 — Split into Two Repositories (`apothem-ai` / `apothem-api`)

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`
**Supersedes:** [ADR-001 — Use a Monorepo](001-monorepo.md)

## Context

ADR-001 established a single monorepo (site, web, API, workers, packages, infra, docs) on the reasoning that shared contracts and tooling would evolve together and coordination overhead did not yet justify separate repositories.

`architecture.md` (root, Aug 2026) redefines the initial repository strategy as two repositories from the start:

- `apothem-ai` — site (`apothemai.com.br`), authenticated web app (`app.apothemai.com.br`), Design System, and product documentation.
- `apothem-api` — API, Agent Runtime, AI Gateway, Knowledge Engine, connectors, tools, workflows, approvals, workers, database access.

The backend has materially different operational requirements than the frontend (long-running AI tasks, background workers, queues, ingestion, secrets, audit trails) and independent deploy cadence (Vercel for frontend, managed container runtime for backend, initially Railway) is judged to outweigh the contract-sharing convenience a single repo gave under ADR-001.

## Decision

Adopt two repositories as the initial repository topology:

1. `apothem-ai` — frontend applications (`apps/site`, `apps/web`), shared frontend packages (`ui`, `frontend-config`, `api-client`), and product documentation.
2. `apothem-api` — backend modular monolith (`src/modules`, `src/common`, `src/infrastructure`, `src/main`), workers, database/migrations, and backend-specific docs/infra.

Frontend and backend must not duplicate types manually. The backend is the source of truth for the API contract via an OpenAPI specification; `apothem-ai/packages/api-client` is generated from it.

Frontend and backend have independent deploy cycles and independent versioning; API compatibility must tolerate skew between frontend and backend releases.

A separate infrastructure repository (`apothem-infrastructure`) is **not** created at this stage — infra/deploy config lives inside `apothem-api/infra`.

## Consequences

- Loses ADR-001's atomic cross-cutting commits (a single PR can no longer change frontend and backend together); coordination across the two repos must rely on the generated API client and versioned contracts instead of same-commit atomicity.
- CI/tooling must be duplicated or shared via published packages rather than a single affected-project build graph.
- `docs/02-architecture/monorepo-architecture.md`, `docs/02-architecture/architecture-overview.md`, `docs/19-handoff/claude-start-here.md`, and `docs/17-roadmap/first-implementation-sequence.md` describe a single-monorepo layout and must be read as superseded by this ADR and `architecture.md` where they conflict, until they are rewritten.
- This repository (`apothem-ai`) keeps `docs/` as the canonical documentation source for both repos until/unless a dedicated `apothem-docs` repository is created.

## Alternatives

- **Keep single monorepo (ADR-001 as-is):** rejected — the operational divergence between frontend and backend (long-lived AI/worker processes vs. a Vercel-deployed web app) is judged significant enough now to outweigh shared-tooling convenience, and independent deploy cycles are wanted from the start.
- **Full microservices split beyond frontend/backend:** rejected — out of scope for this decision and against the "no microservices without operational justification" baseline principle; `apothem-api` itself remains a modular monolith (ADR-002).
