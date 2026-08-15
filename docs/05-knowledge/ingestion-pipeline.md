# Knowledge Ingestion Pipeline

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Pipeline states:
`uploaded/discovered → queued → parsing → normalizing → chunking → indexing → ready` with partial/failed states and retry metadata.

Ingestion stores source checksum/version so unchanged content is not unnecessarily reprocessed. Re-ingestion should create a new materialization/version or safely replace index records while preserving source history as required.

Tasks are asynchronous and idempotent. Object storage holds original/normalized artifacts according to retention. Parsing errors are visible to the user with actionable reason rather than silently skipping whole sources.
