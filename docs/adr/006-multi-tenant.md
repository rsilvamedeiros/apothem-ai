# ADR-006 — Multi-Tenant from Foundation

**Status:** Accepted  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Decision
Organization is the primary tenant boundary and workspace is an operational sub-boundary. Tenant context is included in persistence, authorization, jobs, caching, object/vector storage and observability design.

## Consequence
Every feature carries tenancy considerations from day one; this is intentional because retrofitting isolation later is high-risk.
