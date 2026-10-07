# Contract Tests and AI Evaluations

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

API/event schemas are versioned and tested between producers/consumers. Connector tool schemas use golden fixtures to detect accidental breaking changes.

AI evaluation case fields should include: scenario ID, task input, tenant-safe fixture context, expected/forbidden tools, expected evidence, output schema/properties, max cost/latency where relevant and grading method.

A critical agent version should not be published when mandatory policy/safety evals regress beyond accepted threshold.

## Current evaluation assets

- `apothem-api/src/modules/models/evals/routing.dataset.ts`: policy to expected route/refusal cases, run against a fixed catalog with no provider calls. Add a case for every routing bug or new guardrail.
- Agent-level evals (scenarios, forbidden tools, groundedness) arrive with the `runs` and `tools` modules; the case fields above are the contract they will follow.
