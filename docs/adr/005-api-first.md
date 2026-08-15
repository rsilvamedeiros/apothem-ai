# ADR-005 — API-First Boundaries

**Status:** Accepted  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Decision
The APOTHEM web client consumes stable application/API contracts; core capabilities are not implemented solely as UI server-action internals that external clients cannot later access.

## Consequence
More explicit contracts/versioning, but supports future SDK, white-label and vertical product reuse.
