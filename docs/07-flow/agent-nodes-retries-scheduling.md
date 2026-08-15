# Agent Nodes, Retries and Scheduling

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Agent node references a published AgentVersion or deployment alias and receives structured workflow input. Its result becomes structured node output, not only free-form text.

Retry policy distinguishes transient infrastructure/provider failures from business rejection and invalid configuration. Non-idempotent tools are not blindly retried.

Timers/schedules are durable. A workflow waiting seven days must not depend on a worker process sleeping. Timezone is explicit at trigger definition.
