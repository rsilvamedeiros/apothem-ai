# First Implementation Sequence

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Batch 1 — Repository skeleton
1. Choose package manager and monorepo task runner; record ADR if needed.
2. Create `apps/site`, `apps/web`, `apps/api`, `workers/ai` and packages only when each has a clear initial responsibility.
3. Shared TypeScript, lint, formatter and test config.
4. Environment variable schema with `.env.example` containing no secrets.
5. Docker Compose for PostgreSQL/pgvector and any selected required local dependency.
6. Root scripts: dev, build, lint, typecheck, test, db:migrate.

## Batch 2 — Persistence
7. Select ORM/query layer and record ADR.
8. Create first migrations for organizations, workspaces, principals/memberships.
9. Repository layer that requires tenant scope.
10. Seed/demo fixtures.

## Batch 3 — Identity/authorization
11. Principal abstraction and authentication adapter boundary.
12. Organization/workspace resolution middleware/application context.
13. Capability-based authorization service.
14. Test role/capability fixtures.
15. Cross-tenant/IDOR integration tests.

## Batch 4 — Delivery surfaces
16. API health/readiness.
17. Organization/workspace management API.
18. Minimal authenticated web shell with organization/workspace switcher.
19. Error/request correlation standard.
20. Audit port + first membership/configuration audit events.

## Batch 5 — CI/operations
21. CI lint/type/unit/integration/build.
22. Migration test on clean DB.
23. Dependency/security scan baseline.
24. Structured logging/correlation IDs.
25. Documentation link/check script where useful.

Only after these pass begin Agent draft/version/model gateway.
