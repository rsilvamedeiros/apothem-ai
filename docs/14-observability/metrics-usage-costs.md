# Metrics, Usage and Costs

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Platform metrics: request rate/error/latency, queue depth/age, worker saturation, DB health, retrieval latency, connector failures.

Product metrics: active organizations/workspaces/users, published agents, successful runs, time-to-first-value, approval completion, repeat usage.

AI metrics: tokens, model calls, tool calls, context size, retrieval quality proxy, run success/failure, cost per run/agent/org.

Usage events should be appendable and reconcilable so a future billing system is downstream rather than embedded in every provider call.
