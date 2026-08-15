# Workflow Engine

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Apothem Flow combines deterministic orchestration with agent reasoning. The workflow definition should be durable/versioned independent from any future visual editor.

Core node classes:
- trigger/input;
- deterministic transform;
- condition/switch;
- agent task;
- tool action;
- approval;
- wait/timer;
- subflow;
- terminal output.

Workflow execution stores current state and completed node outputs so it can resume after process restarts or human waiting periods.

## Why Flow should wait until core actions work

A visual/durable workflow engine multiplies the number of states, retries and failure cases. APOTHEM should prove Agent Runtime + Tool + Approval first; Flow then composes those already reliable primitives instead of reimplementing them.

## Definition model

Workflow has mutable identity/metadata and draft. Publishing creates immutable WorkflowVersion with typed nodes and edges. Executions reference exactly one version.

Every node declares input schema, output schema, retry semantics and whether it can suspend execution. Variables should use explicit names/paths rather than unrestricted code evaluation.

## Durable execution

After each externally meaningful node, persist node attempt and workflow state/checkpoint. A worker can resume by execution ID. Waiting on timers/approval stores wake condition in durable scheduler/state; no long-lived process is required.

## Agent nodes

Agent node uses a published AgentVersion and structured input. If the agent requests an approval through a tool, the enclosing workflow naturally enters waiting state. The workflow engine should not create a second incompatible approval model.

## Determinism and AI

Use AI where interpretation is needed; use deterministic nodes for comparisons, thresholds, field mappings and routing. Example: agent classifies an invoice category into an enum, then deterministic condition routes based on enum and amount.

## Compensation

Do not promise transactional rollback across SaaS APIs. Where business process needs compensation, model explicit compensating tools/nodes and audit them as new actions.
