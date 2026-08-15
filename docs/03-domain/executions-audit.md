# Runs, Tool Executions and Audit

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Run states
Suggested agent-run state machine:

`QUEUED → RUNNING → WAITING_APPROVAL ↔ RUNNING → COMPLETED | FAILED | CANCELLED`

Additional internal sub-states may exist but API semantics should remain stable.

## Tool execution
Record request, validated arguments (with sensitive-field redaction strategy), policy outcome, approval reference, attempt count, idempotency key, external correlation ID, result classification and timing.

## Audit
Audit event records security/business fact independent from trace logs. Example: `agent.version_published`, `connection.created`, `tool.execution_approved`, `membership.role_changed`.

Historical run/audit records should survive resource archival.
