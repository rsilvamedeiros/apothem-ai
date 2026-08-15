# Tables and Indexing Guidelines

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Index every high-frequency ownership/query path beginning with tenant scope. Examples:
- `(organization_id, id)` where useful;
- `(organization_id, workspace_id, status)`;
- `(workspace_id, agent_id, created_at desc)` for runs;
- `(run_id, sequence)` for timeline events;
- `(knowledge_base_id, source_id, status)`;
- approval inbox by workspace/status/requested_at;
- unique `(organization_id, slug)` and `(workspace_id, slug)` where applicable.

Do not add speculative indexes everywhere. Measure query plans after realistic data generation. Large append-only tables should use time/tenant-aware strategies later.
