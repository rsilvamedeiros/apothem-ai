# API Authentication, Versioning, Pagination and Errors

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Authentication mechanisms may include browser session and scoped API/service credentials. API credentials belong to a tenant principal and expose explicit scopes.

Version public contracts under `/v1`. Internal evolution can be faster but should still use shared schemas to avoid web/API drift.

Use cursor pagination for large ordered collections. Responses include stable next cursor, not database offsets for high-growth event/run tables.

Normalized error shape concept:
```json
{
  "error": {
    "code": "APPROVAL_NOT_ALLOWED",
    "message": "You are not authorized to approve this action.",
    "requestId": "...",
    "details": {}
  }
}
```
Never expose raw provider stack traces/tokens/secrets to clients.
