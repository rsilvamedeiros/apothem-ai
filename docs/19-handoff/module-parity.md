# Module Parity: Backend and Frontend

**Status:** Living document
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

Backend (`apothem-api`) and frontend (`apothem-ai`) advance module by module. The backend contract comes first; the frontend consumes the generated `packages/api-client` (never hand-written types). Update this table in the same change that moves a module.

Legend: Done, Partial, Planned, n/a.

| Module | Backend | Frontend | Notes |
|---|---|---|---|
| identity | Done for verification (strict JWT bearer auth, production refuses the dev header, mutation tested) | Done (Google sign-in with Auth.js, token exchange, organization picker, first organization creation; dev bootstrap hidden in production) | Needs a Google OAuth client and matching secrets in Vercel and Render; token refresh relies on the 8 hour session; no deny list |
| organizations | Done (duplicate slug 409, member management with escalation and last-owner guards) | Done (organization page, members page) | Known limitation: organization and first membership are not created atomically |
| workspaces | Done (service tests, cross-organization isolation) | Done | |
| authorization | Done (golden matrix, properties, mutation about 98%) | n/a | Frontend never decides access |
| audit | Done (append-only record, tenant-scoped read API with cursor pagination, mutation about 90%) | Done (audit log page with cursor pagination) | DB integration test for the Drizzle query and the retention job are pending |
| agents | Done (draft/version lifecycle, canonical checksum) | Done for the core flow (list, create, edit instructions, publish, disable, archive, versions) | Next: structured editors for model policy, guardrails, knowledge and tool bindings once their typed contracts exist; run/test panel with `runs` |
| models (Model Gateway) | Done (Anthropic and mock adapters, cost/provider/capability guardrails, routing evals) | Planned | Model policy editor depends on a typed model-policy contract |
| knowledge | Planned (README only) | Partial (UI shell without backend) | Backend contract first |
| runs | Done for v1 (synchronous single model call, durable record, idempotency, budgets, failure codes; no tools or approvals) | Done (Test run panel on the agent page, runs list with cursor paging, run detail with steps and failure guidance) | Next: tools and approvals (WAITING_APPROVAL), knowledge, streaming and a worker queue |
| tools | Done for v1 (typed catalog, strict bindings, policy, idempotent built-in executor) | Planned | Tool bindings editor depends on exposing the catalog through the API |
| approvals | Done for v1 (durable proposals, decisions, expiry, separation of duties) | Planned | Next: approval inbox and waiting state in the runs UI |
| conversations | Planned | Planned | |
| connections | Planned | Planned | |
| workflows | Planned | Planned | |
| usage | Planned | Planned | |
| webhooks | Planned | n/a | |

## Handoff checklist per module

1. Backend: tests first, implementation, audit, tenant-isolation tests, OpenAPI regenerated.
2. Frontend: `npm run sync-and-generate --workspace=packages/api-client`, wrapper plus tests, UI plus tests, safe error states.
3. Docs: update this table, the domain doc and the module README.
4. CI green in both repositories; `npm run openapi:check` clean.
