# AI Evaluations, Fallback and Cost Controls

**Status:** Foundation / Draft  
**Project:** APOTHEM AI  
**Canonical domain:** `apothemai.com.br`

## Evaluations
Maintain datasets by agent/use case with inputs, expected properties, forbidden behavior and optional reference outputs. Evaluate retrieval quality, groundedness, structured-output validity, tool selection, policy compliance and end-task success.

## Online signals
Track completion/failure, user correction, approval rejection rate, tool errors, latency, token usage and cost. These are not substitutes for curated evals.

## Release gate
A meaningful prompt/model/tool change should run regression evals before publication when the agent is production-critical.

## Costs
Record model/embedding/reranking usage normalized into provider cost and internal usage units. Budgets can exist at org/workspace/agent/run level. Runtime budget prevents a runaway reasoning loop.

## Graceful degradation
If the preferred model is unavailable, policy decides whether to use an allowed fallback, queue/retry, or fail with a transparent reason. Never silently violate a customer’s provider/privacy restriction to keep the run green.
