# Initial Engineering Backlog

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## EPIC FND — Repository foundation
- FND-001 Scaffold package manager/workspace/task runner.
- FND-002 Shared TypeScript/lint/format/test configuration.
- FND-003 Docker local dependencies.
- FND-004 CI pipeline.
- FND-005 Environment validation and secret conventions.
- FND-006 Initial DB migration framework.

## EPIC TEN — Identity and tenancy
- TEN-001 Principal/session integration.
- TEN-002 Organization CRUD + membership.
- TEN-003 Workspace CRUD + scope.
- TEN-004 Capability authorization service.
- TEN-005 Cross-tenant security test harness.

## EPIC AGT — Agents
- AGT-001 Agent draft model.
- AGT-002 Agent version publish/immutability.
- AGT-003 Model gateway port + mock adapter.
- AGT-004 First production provider adapter.
- AGT-005 Durable run creation/state worker.
- AGT-006 Streaming/progress API.

## EPIC KNW — Knowledge
- KNW-001 Knowledge base/source model.
- KNW-002 Object upload.
- KNW-003 Async parse/chunk pipeline.
- KNW-004 Embedding/index.
- KNW-005 Hybrid retrieval + permission filter.
- KNW-006 Citation/evidence rendering.

## EPIC CON — Connect/tools
- CON-001 Connection/secrets abstraction.
- CON-002 Tool definition/binding schema.
- CON-003 First read tool.
- CON-004 First side-effect tool.
- CON-005 Policy allow/approval/deny.
- CON-006 Idempotent executor.

## EPIC APR — Approval/control
- APR-001 Approval durable model.
- APR-002 Approver policy.
- APR-003 Inbox UI.
- APR-004 Resume run after decision.
- APR-005 Audit timeline.
- APR-006 Usage/cost events.
