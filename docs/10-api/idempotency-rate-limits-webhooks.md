# Idempotency, Rate Limits and Webhooks

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Creation/action endpoints that may be retried by clients or network infrastructure should support idempotency keys where duplicate execution is harmful (run creation, external action requests, webhook-triggered commands).

Rate limits can be principal + tenant + capability aware. AI-heavy endpoints may additionally consume concurrency/usage budgets.

Outbound webhooks carry event ID/type/schema version/timestamp/tenant-safe resource references and HMAC signature. Retry with exponential backoff; receivers use event ID for deduplication.
