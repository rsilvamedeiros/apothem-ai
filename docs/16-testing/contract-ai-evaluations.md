# Contract Tests and AI Evaluations

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

API/event schemas are versioned and tested between producers/consumers. Connector tool schemas use golden fixtures to detect accidental breaking changes.

AI evaluation case fields should include: scenario ID, task input, tenant-safe fixture context, expected/forbidden tools, expected evidence, output schema/properties, max cost/latency where relevant and grading method.

A critical agent version should not be published when mandatory policy/safety evals regress beyond accepted threshold.
