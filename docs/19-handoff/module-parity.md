# Module Parity: Backend and Frontend

**Status:** Living document
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

Backend (`apothem-api`) and frontend (`apothem-ai`) advance module by module. The backend contract comes first; the frontend consumes the generated `packages/api-client` (never hand-written types). Update this table in the same change that moves a module.

Legend: Done, Partial, Planned, n/a.

| Module | Backend | Frontend | Notes |
|---|---|---|---|
| identity | Done for verification (strict JWT bearer auth, production refuses the dev header, mutation tested) | Partial (access token or dev principal cookie; no real sign-in UI) | Next: choose and deploy the token issuer (ADR-012), then a real sign-in flow and refresh |
| organizations | Done (duplicate slug 409, member management with escalation and last-owner guards) | Done (organization page, members page) | Known limitation: organization and first membership are not created atomically |
| workspaces | Done (service tests, cross-organization isolation) | Done | |
| authorization | Done (golden matrix, properties, mutation about 98%) | n/a | Frontend never decides access |
| audit | Done (append-only record, tenant-scoped read API with cursor pagination, mutation about 90%) | Done (audit log page with cursor pagination) | DB integration test for the Drizzle query and the retention job are pending |
| agents | Done (draft/version lifecycle, canonical checksum) | Done for the core flow (list, create, edit instructions, publish, disable, archive, versions) | Next: structured editors for model policy, guardrails, knowledge and tool bindings once their typed contracts exist; run/test panel with `runs` |
| models (Model Gateway) | Done (Anthropic and mock adapters, cost/provider/capability guardrails, routing evals) | Planned | Model policy editor depends on a typed model-policy contract |
| knowledge | Planned (README only) | Partial (UI shell without backend) | Backend contract first |
| runs | Planned | Planned | |
| tools | Planned | Planned | |
| approvals | Planned | Planned | |
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
