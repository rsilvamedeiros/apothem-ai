# ADR-004 — Multi-Model Gateway

**Status:** Accepted  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Decision
Application/domain code depends on an APOTHEM model gateway/model policy, not direct provider SDKs.

## Consequences
Provider features require adapter/capability modeling; initial engineering cost is higher than a direct SDK call, but prevents agent definitions and runtime history from becoming vendor-shaped.
