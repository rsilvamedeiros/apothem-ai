# Open Questions for the Implementation Phase

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

These questions are intentionally not guessed in the foundation. Resolve when implementation evidence is available.

> Authentication, ORM, queue technology, cloud/hosting and observability approach are now decided for the pre-revenue phase — see [ADR-009 — Zero-Cost Initial Stack](../adr/009-zero-cost-initial-stack.md). Remaining open items below.

## Durable workflow continuation (post-MVP)
Redis + BullMQ (ADR-009) is sufficient for MVP approvals/timers. Whether a durable workflow engine (e.g. Temporal) becomes necessary depends on how long-lived Flow approvals/timers get in practice; revisit once Milestone E/F (approvals hardening) surfaces real continuation requirements.

## First real connector/use case
This should be driven by first design partner because it determines which tool/approval semantics receive production validation first.

## First production model provider
The gateway should support a mock and one real provider first. Add a second when routing/portability is tested, not for checkbox completeness.
