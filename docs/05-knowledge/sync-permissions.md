# Knowledge Synchronization and Permissions

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Connector-backed sources need synchronization state: cursor/checkpoint, last successful sync, current error, next retry and source revision.

Permission models may include workspace-wide, explicit groups/roles, source-level ACL and later inherited external ACLs. The system must never index “public to the agent” content without remembering who is authorized to retrieve it.

When external access is revoked, the safe default is to remove/disable retrieval eligibility quickly even if physical index cleanup happens asynchronously.
