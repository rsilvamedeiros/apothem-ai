# First Implementation Sequence

**Status:** Foundation / Draft
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

> Per [ADR-008](../adr/008-two-repository-split.md), backend work below happens in the separate `apothem-api` repository; frontend work happens in this repository (`apothem-ai`). Batches 1–3 and most of 5 are `apothem-api` scope; batch 4's web shell and part of 5 are `apothem-ai` scope.

## `apothem-api` — Batch 1 — Repository skeleton
1. Choose package manager and task runner; record ADR if needed.
2. Create `src/modules`, `src/infrastructure`, `workers/ai` and packages only when each has a clear initial responsibility.
3. Shared TypeScript, lint, formatter and test config.
4. Environment variable schema with `.env.example` containing no secrets.
5. Docker Compose for PostgreSQL/pgvector and any selected required local dependency.
6. Root scripts: dev, build, lint, typecheck, test, db:migrate.

## `apothem-api` — Batch 2 — Persistence
7. Select ORM/query layer and record ADR.
8. Create first migrations for organizations, workspaces, principals/memberships.
9. Repository layer that requires tenant scope.
10. Seed/demo fixtures.

## `apothem-api` — Batch 3 — Identity/authorization
11. Principal abstraction and authentication adapter boundary.
12. Organization/workspace resolution middleware/application context.
13. Capability-based authorization service.
14. Test role/capability fixtures.
15. Cross-tenant/IDOR integration tests.

## Batch 4 — Delivery surfaces
16. (`apothem-api`) API health/readiness.
17. (`apothem-api`) Organization/workspace management API + OpenAPI spec published.
18. (`apothem-ai`) Generate `packages/api-client` from the OpenAPI spec; minimal authenticated web shell (`apps/web`) with organization/workspace switcher consuming it.
19. (`apothem-api`) Error/request correlation standard.
20. (`apothem-api`) Audit port + first membership/configuration audit events.

## Batch 5 — CI/operations
21. (both repos) CI lint/type/unit/integration/build.
22. (`apothem-api`) Migration test on clean DB.
23. (both repos) Dependency/security scan baseline.
24. (`apothem-api`) Structured logging/correlation IDs.
25. (both repos) Documentation link/check script where useful.

Only after these pass begin Agent draft/version/model gateway (`apothem-api`).
