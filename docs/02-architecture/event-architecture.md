# Event Architecture

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Use events for meaningful domain facts and asynchronous integration, not to turn every function call into messaging.

Candidate events:
- `organization.created`
- `workspace.member_added`
- `agent.version_published`
- `knowledge.source_uploaded`
- `knowledge.source_ready`
- `run.started/completed/failed`
- `tool.execution_requested/completed/failed`
- `approval.requested/decided/expired`
- `connection.revoked`
- `usage.recorded`

Events need stable IDs, occurred-at timestamp, tenant context, aggregate/resource identifiers, schema version and correlation/causation identifiers.

For reliable event publication from database changes, prefer an outbox pattern rather than committing business state and then hoping a broker publish succeeds.
