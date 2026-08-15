# LLM Tracing and Evaluations

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

AI trace should capture provider/model, prompt-template/version identifiers, context/evidence IDs, token/usage counts, tool request/result metadata, structured-output validation, latency and outcome. Sensitive raw prompt/output retention is configurable/redacted.

Evals need linkage to AgentVersion, prompt version and model route so regressions can be diagnosed. Maintain offline eval run history and later production sampling/feedback.
