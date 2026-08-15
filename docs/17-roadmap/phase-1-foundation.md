# Phase 1 — Foundation and Core Agents

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Deliver repository scaffold, config, local services, DB/migrations, auth integration, organization/workspace/membership, agent draft/version CRUD, model gateway interface, durable run records and basic chat/task UI.

Key exit criteria:
- tenant access tests pass;
- agent publish creates immutable version;
- run uses recorded version;
- mock provider supports deterministic CI;
- one real provider adapter works behind gateway;
- run events/status observable.
