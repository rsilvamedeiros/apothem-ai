# Background Jobs

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Long-running work includes document parsing/embedding, agent runs, workflow continuations, connector synchronization, webhooks/retries, evaluations and retention cleanup.

Job requirements:
- durable enqueue;
- explicit retry policy and dead-letter/failure state;
- idempotent handlers where possible;
- tenant-aware concurrency controls;
- correlation with run/source/workflow IDs;
- visibility in operational tooling;
- cancellation where meaningful;
- no raw credentials in queue payloads.

The queue technology remains open. The domain contract should not depend on a specific broker API.
