# MVP Build Specification

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

The MVP should demonstrate the full APOTHEM thesis on one narrow vertical slice rather than many disconnected screens.

### Slice
An organization creates an agent, uploads company documents, gives it one read tool and one approval-gated action tool, publishes it, runs a task, reviews evidence, approves the action and audits the whole execution.

### Must build
- authentication + organization/workspace membership;
- agent draft/version lifecycle;
- multi-provider gateway interface with at least one production adapter + mock/test adapter;
- durable run state;
- knowledge base/source upload + async ingestion + retrieval/citations;
- connection + typed tools;
- tool policy allow/approval/deny;
- approval inbox/decision;
- execution timeline/audit/usage basics;
- tenant isolation tests;
- local Docker/dev + CI.

### Should not block MVP
Visual workflow editor, marketplace, advanced billing, dozens of connectors, multi-agent orchestration, white-label UI, fine-grained enterprise SSO.

### MVP exit
Meet `docs/01-product/acceptance-criteria.md` in an end-to-end design partner environment.

## Recommended first design-partner demo scenario

Use a process that proves all core concepts without financial/destructive risk. Example pattern:

1. Upload policy/process/customer-support documents.
2. Connect a sandbox CRM/ticket system.
3. Agent receives a customer/task.
4. Agent retrieves internal policy evidence and reads customer record.
5. Agent produces structured recommendation.
6. Agent proposes updating a non-destructive CRM/ticket field or creating a follow-up item.
7. Approval is required.
8. Human approves.
9. Tool executes in sandbox.
10. Run detail shows sources, proposal, approval, external action and cost.

This validates Understand, Connect, Reason and Act in one story.

## Build order inside MVP

### Milestone A — Foundation
Monorepo/tooling, environments, DB, authentication, tenancy, authorization test harness.

### Milestone B — Agent without knowledge/tools
Agent draft/version/publish, model gateway, durable run, UI status/streaming and run history. Use mock provider in CI.

### Milestone C — Knowledge
Upload → process → retrieve → evidence → answer. Establish first retrieval eval dataset.

### Milestone D — Read tool
Connection/secrets/tool binding and one safe read call. Validate model cannot call unbound capability.

### Milestone E — Action + approval
Persist proposal, policy gate, approval inbox, resume and idempotent side effect.

### Milestone F — Control/pilot hardening
Audit timeline, usage/cost, failure/retry UX, tenant penetration-style tests, backups, monitoring and design-partner seed workflow.

## Things Claude Code must not build in the first scaffold

- visual workflow canvas;
- public marketplace;
- arbitrary MCP server execution without policy wrapper;
- custom billing engine;
- multi-region infrastructure;
- generic SQL/shell tools;
- multiple production model providers before gateway contract is proven with one + mock;
- microservices for each branded module.

The scaffold should create extension points, not empty services pretending these features already exist.
