# ADR-001 — Use a Monorepo

**Status:** Superseded by [ADR-008 — Split into Two Repositories](008-two-repository-split.md)
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Context
Product surfaces and shared contracts will evolve together during early development.

## Decision
Use a monorepo for site, web, API, workers, packages, infrastructure and docs.

## Consequences
Atomic contract changes and shared tooling are easier. CI must use affected-project caching to avoid slowing as repository grows.

## Alternatives
Separate repositories were rejected initially because coordination overhead exceeds current independence benefits.
