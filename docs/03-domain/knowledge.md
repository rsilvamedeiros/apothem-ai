# Knowledge Domain Model

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Knowledge Base is the permissioned logical collection attached to agents/workspaces.

Knowledge Source represents the origin/lifecycle: uploaded file, folder sync, URL/domain source, database source or connector-managed source.

Document/Item represents a normalized logical item from a source. Chunk/segment represents retrieval units. Index records represent embedding/search materialization and can be rebuilt without changing source identity.

Source lifecycle: pending → processing → ready → partially_failed/failed → syncing → disabled/archived.

Permissions must be applied before retrieval results enter model context. Metadata should preserve source ID, item ID, location/page/section, timestamps and classification.
