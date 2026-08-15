# ADR-003 — PostgreSQL + pgvector First

**Status:** Accepted  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Decision
Use PostgreSQL as transactional system of record and initially evaluate pgvector for vector retrieval.

## Rationale
Reduces infrastructure and keeps tenant/metadata filtering close to transactional metadata. A dedicated vector platform can be introduced if measured scale/retrieval requirements justify it.

## Consequence
Embedding/index abstraction should allow rebuilding/migration without changing Knowledge source identity.
