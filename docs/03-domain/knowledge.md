# Knowledge Domain Model

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Knowledge Base is the permissioned logical collection attached to agents/workspaces.

Knowledge Source represents the origin/lifecycle: uploaded file, folder sync, URL/domain source, database source or connector-managed source.

Document/Item represents a normalized logical item from a source. Chunk/segment represents retrieval units. Index records represent embedding/search materialization and can be rebuilt without changing source identity.

Source lifecycle: pending → processing → ready → partially_failed/failed → syncing → disabled/archived.

Permissions must be applied before retrieval results enter model context. Metadata should preserve source ID, item ID, location/page/section, timestamps and classification.

## v1 (ADR-014)

A knowledge base belongs to one workspace and is `active` or `archived`. A document holds normalized text plus its checksum and is `ready` once chunked. Chunks are derived, rebuildable and carry the source identity (`knowledgeBaseId`, `documentId`, `ordinal`, `section`). Retrieval is lexical full-text, constrained in SQL by workspace, bound bases, active base and ready document. Agents reach it through the read-only `search_knowledge` tool and the `knowledgeBindings` of the published version. See [ADR-014](../adr/014-knowledge-v1.md).
