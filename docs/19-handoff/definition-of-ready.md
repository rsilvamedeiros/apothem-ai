# Definition of Ready for Coding

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

A backlog item is ready when:
- desired user/business outcome is clear;
- owning bounded context is known;
- tenant/workspace ownership is known;
- required permission/capability is defined;
- input/output/state transitions are defined;
- persistence/migration impact is understood;
- sync vs async behavior is chosen;
- audit/observability needs are known;
- failure/retry/idempotency behavior is known for external actions;
- tests can be described;
- any architecture conflict has an ADR path.

Not every tiny task needs a formal document, but a coding agent should not be asked to invent these decisions while implementing a risky feature.
