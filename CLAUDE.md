# Claude Code Project Instructions

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

This file defines how Claude Code should work inside the APOTHEM AI repository. It is an engineering contract, not a suggestion list.

## Mandatory context before implementation

Before creating or materially changing code, read:

1. `README.md`
2. `docs/README.md`
3. `docs/00-context/project-context.md`
4. the domain document for the module being changed;
5. the relevant architecture/security/API documents;
6. active ADRs under `docs/adr/`.

If the requested implementation conflicts with documentation, **do not silently choose one**. Prefer the documented decision and surface the conflict. If the change is intentional, update or add an ADR together with the code.

## Non-negotiable project rules

- APOTHEM is multi-tenant from the domain model forward. Tenant context is never optional on tenant-owned resources.
- Never trust a tenant/workspace identifier received only from a client payload. Authorization must derive accessible scope from authenticated identity and server-side membership.
- AI providers are infrastructure dependencies. Domain code must not depend directly on OpenAI, Anthropic, Google or another provider SDK.
- Agent executions are durable business records. Preserve run inputs, effective agent version, model decision metadata, tool calls, approvals, failures and final outcome according to retention policy.
- Side-effecting tools require explicit policy evaluation. High-risk actions must support human approval.
- A tool is an application capability with a typed contract, not arbitrary model-generated code.
- Prompt text is versioned configuration. Do not scatter critical prompts through UI components or ad hoc service functions.
- Knowledge retrieval must preserve source identity and permissions so answers/actions can be traced back to authorized evidence.
- Never bypass audit logging to “simplify” an implementation path involving permissions, tools, approvals or sensitive data.
- Do not add microservices merely for conceptual purity. Extraction needs an operational reason: scaling, reliability, security boundary, language/runtime requirement or independent ownership.

## Coding direction for the future scaffold

The intended baseline is TypeScript-first for the product/application layer, with Python allowed where a data/AI workload provides a concrete advantage. PostgreSQL is the system of record. pgvector is the first vector capability unless measurements justify a specialized vector store.

The intended repository shape is:

```text
apps/site
apps/web
apps/api
workers/ai
packages/domain
packages/contracts
packages/ai
packages/db
packages/auth
packages/ui
packages/config
infra
tooling
```

Do not create these directories merely to satisfy this document before the scaffold milestone; when created, align boundaries with `docs/02-architecture/monorepo-architecture.md`.

## How to implement a feature

For every non-trivial feature:

1. Identify bounded context and owning module.
2. Define or update domain contracts.
3. Define authorization and tenant scope.
4. Define persistence changes and migration.
5. Define synchronous API behavior and asynchronous events/jobs.
6. Define audit/observability requirements.
7. Define tests, including denied paths and tenant-isolation tests.
8. Implement UI only after application contract is clear.
9. Update documentation when behavior changes.

## AI-specific development rule

Do not test AI features only by “trying the chat”. AI behavior requires deterministic contract tests plus evaluation datasets for semantic behavior. New agents/tools should declare expected scenarios, failure behavior and guardrails.

## Definition of done

A feature is not done because the happy path works. At minimum it must have: authorization, validation, error model, auditability, telemetry, tests, migration safety where applicable, and documentation alignment.
