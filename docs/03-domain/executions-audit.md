# Runs, Tool Executions and Audit

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Run states
Suggested agent-run state machine:

`QUEUED â†’ RUNNING â†’ WAITING_APPROVAL â†” RUNNING â†’ COMPLETED | FAILED | CANCELLED`

Additional internal sub-states may exist but API semantics should remain stable.

## Tool execution
Record request, validated arguments (with sensitive-field redaction strategy), policy outcome, approval reference, attempt count, idempotency key, external correlation ID, result classification and timing.

## Audit
Audit event records security/business fact independent from trace logs. Example: `agent.version_published`, `connection.created`, `tool.execution_approved`, `membership.role_changed`.

Historical run/audit records should survive resource archival.

## Audit read API (implemented in apothem-api)

`GET /v1/organizations/{organizationId}/audit-events` returns events newest first with keyset pagination (`limit` default 50, max 200; opaque `nextCursor`). It requires `audit.read` (owner, admin, auditor), always scopes by the caller's organization, and supports `workspaceId`, `action` and `actorPrincipalId` filters that can only narrow results. The store is append-only. Audit metadata carries opaque ids only, never secrets or personal data.