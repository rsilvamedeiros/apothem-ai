# ADR-013 — Tools and Human Approvals, v1

**Status:** Accepted
**Project:** APOTHEM AI
**Canonical domain:** `apothemai.com.br`

## Context

Runs (v1) answer from the model only. Agents become useful, and risky, when they can act. [ADR-007](007-human-approval-default.md) makes approval a first-class primitive; `04-ai/tool-calling-guardrails.md` describes the pipeline. This ADR fixes the first concrete slice so that the safety properties exist before any real side effect does.

## Decision

1. **A tool is an application capability with a typed contract, never model-generated code.** Each tool declares a name, a description, an argument schema, a **risk level** (`read_only`, `reversible_write`, `irreversible`) and a handler implemented in `apothem-api`. The catalog is code; agents can only bind tools that exist in it.
2. **Bindings are explicit and typed.** An agent version lists the tools it may use (`toolBindings: [{ "tool": "<name>", "approval": "auto" | "required" }]`). Anything not bound is unavailable to the model; a model request for it fails the run (`TOOL_NOT_BOUND`). Bindings are validated at publish time.
3. **The runtime decides, the model only proposes.** Pipeline: proposal, binding check, argument validation, policy evaluation, then `allow`, `require_approval` or `deny`, then execution, then a normalized result. Authorization and thresholds live in policy code, not in the prompt.
4. **Policy defaults are conservative.** `read_only` tools may run automatically. `reversible_write` requires approval unless the binding says `auto` (an explicit, audited choice by someone who can publish). `irreversible` **always** requires approval; a binding cannot waive it.
5. **Approvals are durable.** A proposal that needs approval is persisted immutably (tool, validated arguments, run, version, requester, expiry) and the run moves to `waiting_approval`. No process or HTTP connection waits for a person.
6. **Separation of duties, without locking out small teams.** Deciding requires the `approval.decide` capability, granted by default to `owner` and `admin`. The person who started the run cannot approve their own proposal **while another eligible approver exists** in the organization. When the requester is the only active person who could decide (a solo owner), self-approval is allowed and the audit event is marked `selfApproved: true`, so the decision is still explicit, attributed and reviewable. Approvals expire (default 24 hours) and an expired approval can no longer be executed.
7. **Resume executes the persisted proposal, never a new one.** On approval the stored arguments are executed once with an idempotency key derived from the approval id. Conditions that could invalidate the approval (agent disabled or archived, approval expired, policy now stricter) are re-checked first. A rejection or expiry ends the run with a clear outcome.
8. **Tool output is untrusted input.** Results are size-limited, serialized as data and clearly delimited before the next model turn; the run keeps a step for every proposal, decision and execution.
9. **Hard caps.** At most 3 tool calls per run in v1, and every executed side effect is audited with actor, approver, tool, run and idempotency key (never the raw arguments when they may hold personal data; argument contents live only in the run record under its retention policy).

## Consequences

- `runs.status` gains `waiting_approval`; a new `approvals` table and a first built-in write tool (`create_note`, a reversible workspace note) exercise the full path without external connectors or credentials.
- External connectors (email, CRM) arrive later as additional catalog entries with their own risk levels and the secrets boundary; they reuse this pipeline unchanged.
- Approval inbox and run states appear in the web UI; the API stays the only place that evaluates policy.
- Per-tenant custom policies (thresholds, allowlists, required approver roles) are future work and slot into the policy step.

## Alternatives

- **Let the model call arbitrary HTTP or SQL:** rejected, it removes every guardrail.
- **Approve by re-asking the model:** rejected; approval must resume the exact persisted proposal.
- **Always allow self-approval:** rejected; it removes the second pair of eyes whenever one is available.
- **Never allow self-approval:** rejected; a solo owner could never use a write tool.
