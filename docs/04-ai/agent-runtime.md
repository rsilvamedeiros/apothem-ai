# Agent Runtime

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Runtime responsibilities

1. Load run and verify runnable state.
2. Resolve immutable AgentVersion.
3. Resolve principal/tenant/workspace context.
4. Assemble instructions, task input, relevant conversation state, memory and authorized knowledge.
5. Choose model route according to model policy and runtime constraints.
6. Invoke model and normalize output/tool requests.
7. Validate proposed tool arguments.
8. Evaluate tool/approval policy.
9. Execute allowed tool, pause for approval, or deny and return policy feedback.
10. Continue within configured loop budget.
11. Persist structured final output/status/usage.
12. Emit audit/telemetry/evaluation hooks.

## Run budget
A run should declare limits such as maximum duration, model calls, tool calls, provider spend/credits and context size. Exceeding a limit creates a classified terminal/recoverable state rather than an opaque timeout.

## Deterministic boundaries
Authorization, monetary thresholds, data classification and irreversible action rules belong in policy code, not the model prompt.

## Resumability
When waiting for approval, the run persists a continuation point that can be resumed by a worker later. Do not hold an HTTP connection or in-memory process awaiting a person.

## Streaming
Streaming is a view over persisted progress/events. A disconnected client can reconnect and recover state. Partial model text should be treated as provisional until the run/message is finalized.

## Runtime context model

A run should conceptually construct an `ExecutionContext` containing:

- run/organization/workspace/principal identifiers;
- immutable agent-version reference;
- input/task payload;
- conversation state reference if applicable;
- effective policy/autonomy settings;
- allowed knowledge bindings;
- allowed tool bindings;
- model policy and current route;
- remaining budgets/limits;
- correlation/trace identifiers.

This context is assembled server-side. The client never sends an authoritative list of tools or tenant knowledge IDs and expects the runtime to trust it.

## Reasoning loop pseudocode

```text
while run can continue:
    assert state and budgets
    build minimal relevant context
    call model gateway
    persist normalized model step metadata

    if structured final output:
        validate -> finalize run

    if tool proposal:
        validate tool is bound
        validate arguments
        evaluate policy

        if denied:
            record denial and optionally return safe feedback to model

        if approval required:
            persist immutable proposal
            create approval
            transition WAITING_APPROVAL
            stop worker iteration

        if allowed:
            execute through tool runtime with idempotency
            persist normalized result
            feed allowed result back into context

    enforce max loop/model/tool/time/cost budgets
```

## Approval resume

On approval, the system does **not** ask the model to recreate the action. It resumes from the persisted proposal/tool invocation. Before execution it re-checks conditions that can invalidate an approval: connection revoked, resource removed, approval expired, policy changed to stricter deny, or idempotency result already exists.

If a changed payload is required, invalidate/cancel the old proposal and create a new approval.

## Model/tool result persistence

Do not persist hidden chain-of-thought. Persist useful structured execution artifacts: selected model metadata, response/output, tool proposal, validation/policy decision, source evidence IDs, tool result summary, errors and timestamps. This gives operational explainability without relying on private reasoning text.

## Retry semantics

Model read-only calls can usually be retried under bounded policy after transient failures. Tool side effects require idempotency awareness. A timeout after sending an external request is “outcome unknown” until reconciliation; blindly calling again risks duplication.

## Cancellation

Cancellation is cooperative. Before each model/tool step, check run cancellation. An external action already completed cannot be undone by changing run state to cancelled. If a connector supports compensation, it must be an explicit new action.

## Runtime error taxonomy

Use stable internal codes, for example:
- `RUN_CONFIG_INVALID`
- `MODEL_PROVIDER_UNAVAILABLE`
- `MODEL_POLICY_NO_ROUTE`
- `RUN_BUDGET_EXCEEDED`
- `KNOWLEDGE_RETRIEVAL_FAILED`
- `TOOL_NOT_BOUND`
- `TOOL_ARGUMENT_INVALID`
- `TOOL_POLICY_DENIED`
- `TOOL_CONNECTION_REVOKED`
- `TOOL_OUTCOME_UNKNOWN`
- `APPROVAL_EXPIRED`
- `RUN_CANCELLED`

Provider-specific text may be attached privately for diagnosis but not become the public contract.
