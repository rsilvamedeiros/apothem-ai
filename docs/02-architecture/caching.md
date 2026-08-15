# Caching Strategy

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Caching is an optimization, never an authorization source of truth without invalidation semantics.

Candidate caches:
- provider/model capability metadata;
- non-sensitive organization/workspace configuration;
- compiled agent/tool schemas;
- short-lived retrieval/query results where data classification permits;
- rate-limit counters;
- session/application performance data.

Do not share cache entries across tenants without tenant-qualified keys. Sensitive knowledge/model outputs require explicit retention policy. Cache misses must not change correctness.
