# Threat Model and AI Security

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Priority threats

### Cross-tenant data access
Mitigation: explicit tenant context, repository constraints, tests, permission-aware retrieval.

### Prompt injection from documents/tools/web
Mitigation: treat retrieved/tool content as untrusted data; isolate instructions; tool allowlists/policy; output validation.

### Tool abuse / excessive agency
Mitigation: typed tools, least privilege, approval policies, limits, idempotency, audit.

### Credential theft
Mitigation: secrets vault, no exposure to model/UI, scoped runtime access, rotation.

### Knowledge poisoning
Mitigation: source provenance, ingestion controls, freshness/version metadata, admin visibility, evaluations.

### SSRF via configurable connectors
Mitigation: network egress restrictions/allowlists, URL validation, connector sandboxing/timeouts.

### Model/provider data leakage
Mitigation: provider policy, redaction/minimization, enterprise data settings, restricted models for sensitive work.

### Denial/cost exhaustion
Mitigation: quotas, run budgets, rate limits, concurrency controls, bounded loops.

### Audit tampering
Mitigation: append-only semantics, restricted access, retention/storage controls and later integrity verification where needed.
