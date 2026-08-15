# ADR-007 — Human Approval as First-Class Primitive

**Status:** Accepted  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Decision
Side-effecting tool execution supports policy outcome `allow`, `require_approval` or `deny`. Approval is durable and can pause/resume runs/workflows.

## Rationale
Enterprise adoption requires controlled autonomy. Approval cannot be bolted onto a stateless chat loop later without redesigning execution state.
