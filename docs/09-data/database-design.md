# Database Design

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

PostgreSQL is the primary transactional system of record. Initial goal is one logical database with schema/module discipline, not one database per bounded context.

Design conventions:
- opaque IDs;
- `organization_id` on tenant-owned rows;
- `workspace_id` on workspace-scoped rows;
- `created_at`, `updated_at` where mutable;
- explicit status enums/check constraints;
- immutable version tables;
- soft archive where history references a resource;
- JSONB only for genuinely variable/config payloads, not as an excuse to avoid modeling searchable invariants;
- unique constraints include tenant scope when names/slugs are tenant-relative.

Execution/audit tables can grow rapidly and may later require partitioning/retention strategies.

## Suggested schema groups

Logical schemas/modules may be used for clarity (exact physical layout can evolve):
- `identity`: principals, sessions/reference data if self-managed;
- `tenancy`: organizations, workspaces, memberships, invitations;
- `agents`: agents, drafts/snapshots, versions, deployments;
- `knowledge`: bases, sources, items, chunks, embedding/index metadata;
- `connect`: connections, tool definitions/bindings/executions;
- `flow`: workflows, versions, executions, node attempts, approvals;
- `control`: audit events, usage events, evaluation runs/results.

## JSONB guidance

Good JSONB candidates: immutable agent version config snapshot, provider capability metadata, structured tool arguments/results (with searchable promoted fields where needed), workflow graph definition, evaluation details.

Poor JSONB candidates: organization membership, approval status, tenant ownership, agent status or other fields used in constraints/authorization/querying. Model these relationally.

## Concurrency

Use optimistic locking/version columns on mutable drafts/settings where simultaneous editing matters. Approval decision uses conditional update from `PENDING` to final state. Worker run transitions use compare-and-set/row locks so two workers do not execute the same step concurrently.

## Outbox

For state that must reliably produce asynchronous work/event, transactionally write an outbox/job dispatch record with the business change. A dispatcher publishes/enqueues and marks delivery. This prevents “run row exists but job was never queued” failure windows.

## Sensitive data

Mark columns/payload areas containing PII/business content/secrets references. Avoid indexing raw sensitive text unnecessarily. Database backups inherit the highest contained data classification.

## Migration discipline

Each migration is forward-reviewed for lock time and rollback compatibility. Large backfills are jobs, not one blocking migration. New required columns use nullable/default/backfill/constraint sequence for large tables.
