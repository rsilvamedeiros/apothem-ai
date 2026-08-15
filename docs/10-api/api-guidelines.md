# API Guidelines

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

APOTHEM is API-first even when the initial consumer is its own web application.

Use resource-oriented JSON HTTP APIs for management/control and explicit command endpoints for lifecycle actions where CRUD semantics are misleading (`publish`, `cancel`, `approve`, `retry`).

Example resources:
`/v1/organizations`, `/workspaces`, `/agents`, `/agent-versions`, `/runs`, `/knowledge-bases`, `/sources`, `/connections`, `/approvals`, `/workflows`.

Long-running commands return a durable resource/status rather than keeping HTTP open until completion. Streaming can supplement but not replace status endpoints.

## Resource and command examples

```text
POST   /v1/organizations/:orgId/workspaces
GET    /v1/workspaces/:workspaceId/agents
POST   /v1/workspaces/:workspaceId/agents
PATCH  /v1/agents/:agentId/draft
POST   /v1/agents/:agentId/publish
POST   /v1/agents/:agentId/runs
GET    /v1/runs/:runId
POST   /v1/runs/:runId/cancel
POST   /v1/approvals/:approvalId/approve
POST   /v1/approvals/:approvalId/reject
POST   /v1/knowledge-bases/:id/sources/uploads
POST   /v1/connections/:id/revoke
```

Paths should not require both org and workspace everywhere if the resource ID is globally opaque, but the server still resolves and validates tenant ownership. Avoid accepting `organizationId` in a body as authoritative ownership.

## Response conventions

Create returns `201` for immediate resource creation; asynchronous command can return `202` with run/job resource. Delete/archive semantics are explicit. Commands that are idempotent under a key return the original logical result for duplicate key requests.

## Filtering

Large lists support scoped filters (status, agent, actor, date range) validated against allowed fields. Do not expose arbitrary SQL-like filter expressions in V1.

## Streaming/events

Run streaming may use SSE/WebSocket depending on implementation, but events reference persisted run state. Clients must be able to recover with `GET /runs/:id` if stream is lost.

## Contract generation

Prefer schemas as executable contracts (e.g., OpenAPI/JSON Schema generated/validated from shared definitions) so frontend/SDK/tests agree. Avoid hand-maintaining a second documentation schema that drifts from runtime validation.
