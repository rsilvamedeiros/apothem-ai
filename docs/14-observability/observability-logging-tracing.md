# Observability, Logging and Tracing

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Use correlation IDs across API request, run, job, provider call, retrieval and tool execution.

Logs are structured and environment/tenant/resource aware while minimizing sensitive content. Trace spans capture timing/status and safe metadata. Metrics capture throughput, latency, queue depth and errors.

Never use production logs as the canonical business audit trail. Logs may expire quickly and contain implementation details; audit events have a separate contract and retention.
