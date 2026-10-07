# Quality Practices

**Status:** Foundation / Draft
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

Decision record: [ADR-011](../adr/011-engineering-quality-and-responsible-ai.md). Applies to `apothem-api` and `apothem-ai`.

## Test layers by repository

| Layer | apothem-api | apothem-ai |
|---|---|---|
| Unit | Vitest: domain, policies, state machines | Vitest: pure logic, formatters, mappers |
| Component | n/a | Vitest + Testing Library for feature components |
| Integration | Vitest + real Postgres (Docker/CI service), repositories, migrations | n/a |
| Contract | OpenAPI response validation, golden fixtures for tool schemas | generated client typechecks against the vendored spec; spec drift check vs `apothem-api` |
| E2E | API journeys with a real DB (agent publish/run, approvals, cross-tenant denial) | Playwright on high-value journeys against a mocked or local API |
| AI evals | datasets run through the mock Model Gateway | n/a (UI never calls providers) |
| Security | dependency audit, secret scan, SAST | dependency audit, secret scan |

## Definition of a good test

- Deterministic: no network, clock or randomness without injection; no live LLM calls.
- Names state behavior (`rejects publishing a version with no model policy`), not implementation.
- One reason to fail; fixtures are tenant-safe and contain no real PII or secrets.
- Denied paths are tested as explicitly as allowed ones.

## Mandatory test cases per tenant-owned resource

1. Allowed access within the same workspace.
2. Denied access to another workspace of the same organization.
3. Denied access to another organization, including by direct ID (must not leak existence: same error as not found).
4. Client-supplied tenant identifiers ignored or rejected when they conflict with the authenticated scope.
5. Audit event emitted for the sensitive operation.

## Property-based testing

Use for invariants that example tests miss: run/approval state machines never reach an illegal state, policy evaluation is monotonic (adding a deny never grants), version immutability after publish.

## Mutation testing

Scheduled (not per push) on authorization, tenant scoping and approval policy, using Stryker with per-test coverage and incremental mode (about 2 minutes for the authorization module). A surviving mutant in these areas is a missing test. Break threshold is 75%; the authorization module scores about 98%.

Property-based testing already paid off: a fast-check property found that a forged role named `toString` made the authorization service throw instead of deny.

## Coverage

Floors are ratcheted upward and never lowered to pass a build. Security-critical modules (authorization, approvals, tenant scoping, audit) carry a higher floor than the repository default.

## Responsible AI checklist (per agent or tool)

- Purpose and owner documented; risk level assigned (read-only, reversible write, irreversible or external side effect).
- Approval policy defined (ADR-007); irreversible actions require human approval by default.
- Guardrails: allowed tools, argument schemas, budgets (tokens, cost, steps), timeouts, retry/idempotency rules.
- Failure behavior: what happens on provider error, schema violation, policy denial, budget exhaustion.
- Eval scenarios: normal, adversarial (prompt injection from knowledge/tool output), cross-tenant, missing evidence, expected refusals.
- Data handling: no PII or secrets in prompts, logs, traces or fixtures; retention per `08-security/audit-retention-lgpd.md`.
- Traceability: run records keep input, effective agent version, model decision metadata, tool calls, approvals and outcome.

## CI gates

Lint, typecheck, unit/component/integration tests, build, migration test on a clean database, OpenAPI regeneration check, doc link check, dependency audit and secret scan. `main` must stay green; fix or revert broken builds before new work.

## Working agreement

Small commits, Conventional Commits in English, push after each commit. After each module, update tests, OpenAPI and docs before requesting review.
