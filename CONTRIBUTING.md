# Contributing

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Contribution principles

APOTHEM should evolve through small, reviewable changes that preserve domain clarity. Implementation work must reference the relevant requirement, backlog item or ADR whenever it changes externally observable behavior.

### Branches and commits

Use focused branches and conventional, descriptive commits. Avoid mixing architecture changes, dependency upgrades and unrelated feature work in one commit.

### Pull request expectations

A meaningful PR should explain: problem, chosen approach, affected bounded context, security/tenant implications, database changes, observability, tests, rollout and rollback considerations.

### Documentation rule

Documentation is part of the product. A PR that changes behavior described under `/docs` must update that documentation in the same change.
