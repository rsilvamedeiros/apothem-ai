# ADR-002 — Start as a Modular Monolith

**Status:** Accepted  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Context
The long-term product has many conceptual modules, but operational scale/ownership boundaries are not yet proven.

## Decision
Keep application/domain modules strongly separated while initially sharing an application/database deployment where reasonable, with web/API/worker processes independently deployable.

## Consequences
Lower distributed-system complexity; future extraction requires explicit ports/events and avoidance of cross-module table mutation.
