# Non-Functional Requirements

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Security
- Cross-tenant access is unacceptable regardless of user-facing severity.
- Secrets are encrypted and isolated from ordinary application payloads.
- Privileged operations produce audit events.
- External integrations follow least privilege and credential rotation principles.

## Reliability
- Long-running document/agent/workflow tasks survive process restarts.
- Side-effect execution is idempotent where the external system permits it.
- Provider failures use bounded retry/fallback policies rather than infinite retries.

## Performance targets for MVP
Targets are initial engineering objectives, not contractual SLAs:
- common authenticated CRUD API p95 under ~500 ms excluding external dependencies;
- UI should show immediate run acceptance and stream/progress without waiting for full completion;
- knowledge retrieval target p95 under ~2 s for typical tenant datasets after indexing;
- document ingestion may be asynchronous and should expose progress.

## Observability
Every run, external provider request, retrieval operation and tool invocation should have correlation identifiers. Sensitive content must not be indiscriminately copied into logs.

## Maintainability
Bounded contexts should communicate through explicit contracts. Provider SDK types should not leak across the application boundary.

## Accessibility
Core product surfaces target WCAG 2.2 AA behavior as a design/implementation baseline.
