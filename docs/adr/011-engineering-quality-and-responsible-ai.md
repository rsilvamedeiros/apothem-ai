# ADR-011 — Engineering Quality and Responsible AI Practices

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

## Context

Both repositories are developed with coding agents and ship AI behavior that acts on tenant data. Correctness cannot rest on manual testing or on "trying the chat". The team needs one quality contract shared by `apothem-api` and `apothem-ai`, and automated gates that enforce it.

## Decision

Adopt the practices below as the baseline for every module. Details live in [`16-testing/quality-practices.md`](../16-testing/quality-practices.md).

1. **TDD** (red, green, refactor); bug fixes start with a regression test.
2. **Contract-first**: the backend OpenAPI spec is the single contract; the frontend consumes the generated client and a CI check fails on spec drift between repos.
3. **Contract and golden-fixture tests** for API, events and tool schemas.
4. **Tenant-isolation and denied-path tests** are mandatory for every tenant-owned resource.
5. **AI evaluation datasets** run against the mock Model Gateway in CI; real providers run only in a small, deliberate, cost-capped compatibility suite.
6. **Property-based tests** for policies and state machines (approval, run states, autonomy).
7. **Mutation testing** on security-critical code (authorization, approval, tenant scoping) as a scheduled check, not on every push.
8. **Security gates**: dependency audit, secret scanning, SAST in CI.
9. **Coverage thresholds** with higher floors for security-critical modules; coverage is a floor, not a goal.
10. **Trunk-based flow with small commits**: Conventional Commits, push after every commit, CI must stay green on `main`.
11. **Responsible AI checklist** per agent/tool: purpose, risk level, approval policy, guardrails, failure behavior, eval scenarios, data handling (no PII/secrets in prompts, logs or fixtures).

## Consequences

- Each module is "done" only when its tests, evals, OpenAPI and docs are updated together (see Definition of Done in both `CLAUDE.md` files).
- The frontend gains a test stack (unit, component, E2E) and a CI workflow; it currently has neither.
- CI time grows; slow suites (mutation, real-provider, E2E) are scheduled or path-filtered.
- Thresholds are introduced gradually and ratcheted up; they must not be lowered to make a build pass.

## Alternatives

- **Manual QA and chat-based testing of AI:** rejected, non-deterministic and unauditable.
- **Mutation and E2E on every push:** rejected for cost/time under the zero-cost baseline (ADR-009).
