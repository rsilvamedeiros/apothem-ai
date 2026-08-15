# Testing Strategy

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

Testing has two dimensions: deterministic software correctness and probabilistic AI behavior.

Software pyramid:
- unit tests for domain/policies/parsers;
- integration tests for DB/repositories/adapters;
- contract tests for API/events/connectors;
- E2E for high-value journeys;
- security/tenant isolation tests.

AI quality:
- structured-output validation;
- retrieval fixtures;
- tool selection/argument evals;
- groundedness/policy compliance scenarios;
- full task success evals.

Do not use live paid providers for every unit test. Provider adapters need mocks/recorded contract fixtures plus a smaller real-provider compatibility suite.
