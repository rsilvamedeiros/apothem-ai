# pgvector, Migrations and Retention

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Start vector search using pgvector unless retrieval benchmarks prove it inadequate. Store embedding model/version/dimension alongside index metadata so migrations/re-embedding are possible.

Database migrations follow expand/contract compatibility for independently deployed API/workers. Avoid destructive rename/drop in the same release that deploys new code.

Retention jobs operate by data category and tenant policy. Deleting source content should remove retrieval eligibility promptly and eventually clean object/vector materialization, while required audit metadata can remain according to policy.
